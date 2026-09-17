import json
from typing import List, Optional, Dict, Any, Tuple
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.analysis import Analysis
from app.repositories.analysis_repo import AnalysisRepository
from app.repositories.resume_repo import ResumeRepository
from app.repositories.job_repo import JobRepository
from app.schemas.analysis import AnalysisCreate, ScoringWeightsInput
from app.nlp.semantic_matcher import semantic_matcher
from app.nlp.scoring_engine import calculate_match_scores
from app.nlp.suggestion_generator import generate_suggestions
from app.core.redis import redis_client
import logging

logger = logging.getLogger(__name__)

class AnalysisService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.analysis_repo = AnalysisRepository(db)
        self.resume_repo = ResumeRepository(db)
        self.job_repo = JobRepository(db)

    async def run_analysis(self, user_id: str, analysis_in: AnalysisCreate) -> Analysis:
        # 1. Fetch and verify Resume
        resume = await self.resume_repo.get_by_id(analysis_in.resume_id, user_id)
        if not resume:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")
        if resume.status != "COMPLETED":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Resume is currently in '{resume.status}' status. Must be 'COMPLETED' before analysis."
            )

        # 2. Fetch and verify Job Description
        job = await self.job_repo.get_by_id(analysis_in.job_description_id, user_id)
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found.")

        # 3. Extract structured elements from Resume
        resume_skills_data = [
            {
                "canonical_name": rs.skill.canonical_name if rs.skill else rs.detected_as,
                "evidence_level": rs.evidence_level,
                "context_snippet": rs.context_snippet
            }
            for rs in resume.skills
        ]

        resume_bullets = []
        resume_exp_data = []
        for exp in resume.experiences:
            b_list = exp.bullet_points or []
            resume_bullets.extend(b_list)
            resume_exp_data.append({
                "company_name": exp.company_name,
                "job_title": exp.job_title,
                "bullet_points": b_list,
                "technologies": exp.technologies or [],
                "years_duration": exp.years_duration
            })

        resume_proj_data = []
        for p in resume.projects:
            b_list = p.bullet_points or []
            resume_bullets.extend(b_list)
            resume_proj_data.append({
                "name": p.name,
                "bullet_points": b_list,
                "technologies": p.technologies or []
            })

        resume_edu_data = [
            {"degree": e.degree, "institution": e.institution, "field_of_study": e.field_of_study}
            for e in resume.education
        ]
        resume_cert_data = [{"name": c.name, "issuer": c.issuer} for c in resume.certifications]

        # 4. Extract JD requirements
        required_skills = [
            r.skill.canonical_name if r.skill else r.description
            for r in job.requirements if r.requirement_type == "REQUIRED_SKILL"
        ]
        preferred_skills = [
            r.skill.canonical_name if r.skill else r.description
            for r in job.requirements if r.requirement_type == "PREFERRED_SKILL"
        ]

        # Fallback if no skills in requirements
        if not required_skills and not preferred_skills:
            from app.nlp.jd_parser import parse_job_description
            parsed_jd = parse_job_description(job.raw_text)
            required_skills = parsed_jd.get("required_skills", [])
            preferred_skills = parsed_jd.get("preferred_skills", [])

        # 5. Execute Skill Matching (Exact + Semantic Proximity)
        skill_matches, summary = semantic_matcher.match_skills(
            required_skills=required_skills,
            preferred_skills=preferred_skills,
            resume_skills=resume_skills_data,
            resume_bullets=resume_bullets
        )

        # 6. Calculate Weighted Scores & Explanations
        custom_weights_dict = analysis_in.custom_weights.model_dump() if analysis_in.custom_weights else None
        score_result = calculate_match_scores(
            skill_matches=skill_matches,
            resume_experiences=resume_exp_data,
            resume_projects=resume_proj_data,
            resume_education=resume_edu_data,
            resume_certifications=resume_cert_data,
            jd_min_exp_years=job.min_experience_years,
            jd_target_degree=job.target_degree,
            custom_weights=custom_weights_dict
        )

        # 7. Generate Actionable Recommendations
        total_exp = sum(e.get("years_duration", 0.0) for e in resume_exp_data)
        suggestions = generate_suggestions(
            skill_matches=skill_matches,
            total_exp_years=total_exp,
            jd_min_exp_years=job.min_experience_years,
            resume_projects=resume_proj_data,
            resume_experiences=resume_exp_data
        )

        # 8. Persist to Database
        analysis = await self.analysis_repo.create(
            user_id=user_id,
            resume_id=analysis_in.resume_id,
            job_description_id=analysis_in.job_description_id,
            scores=score_result["scores"],
            scoring_weights=score_result["weights"],
            explanation_summary=score_result["explanation_summary"],
            detailed_breakdown=score_result["detailed_breakdown"],
            skill_matches=skill_matches,
            suggestions=suggestions
        )

        # 9. Cache match score summary in Redis
        cache_key = f"analysis:{analysis.id}:summary"
        await redis_client.set(cache_key, {
            "id": analysis.id,
            "overall_score": analysis.overall_score,
            "required_score": analysis.required_skills_score
        }, expire_seconds=86400)

        return await self.analysis_repo.get_by_id(analysis.id, user_id)

    async def get_analysis(self, analysis_id: str, user_id: str) -> Analysis:
        analysis = await self.analysis_repo.get_by_id(analysis_id, user_id)
        if not analysis:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found.")
        return analysis

    async def list_analyses(
        self,
        user_id: str,
        page: int = 1,
        limit: int = 10
    ) -> Tuple[List[Dict[str, Any]], int]:
        analyses, total = await self.analysis_repo.list_by_user(user_id, page, limit)
        formatted = []
        for a in analyses:
            formatted.append({
                "id": a.id,
                "resume_id": a.resume_id,
                "job_description_id": a.job_description_id,
                "overall_score": a.overall_score,
                "required_skills_score": a.required_skills_score,
                "preferred_skills_score": a.preferred_skills_score,
                "experience_score": a.experience_score,
                "project_score": a.project_score,
                "education_score": a.education_score,
                "other_score": a.other_score,
                "status": a.status,
                "created_at": a.created_at,
                "resume_title": a.resume.title if a.resume else "Resume",
                "job_title": a.job_description.title if a.job_description else "Job",
                "job_company": a.job_description.company if a.job_description else None
            })
        return formatted, total
