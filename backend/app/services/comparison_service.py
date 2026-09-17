from typing import List, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.resume_repo import ResumeRepository
from app.repositories.job_repo import JobRepository
from app.schemas.analysis import CompareResumesRequest, CompareResumesResponse, ResumeComparisonItem
from app.nlp.semantic_matcher import semantic_matcher
from app.nlp.scoring_engine import calculate_match_scores

class ComparisonService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.resume_repo = ResumeRepository(db)
        self.job_repo = JobRepository(db)

    async def compare_resumes(self, user_id: str, comp_in: CompareResumesRequest) -> CompareResumesResponse:
        job = await self.job_repo.get_by_id(comp_in.job_description_id, user_id)
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found.")

        required_skills = [
            r.skill.canonical_name if r.skill else r.description
            for r in job.requirements if r.requirement_type == "REQUIRED_SKILL"
        ]
        preferred_skills = [
            r.skill.canonical_name if r.skill else r.description
            for r in job.requirements if r.requirement_type == "PREFERRED_SKILL"
        ]

        if not required_skills and not preferred_skills:
            from app.nlp.jd_parser import parse_job_description
            parsed_jd = parse_job_description(job.raw_text)
            required_skills = parsed_jd.get("required_skills", [])
            preferred_skills = parsed_jd.get("preferred_skills", [])

        candidates: List[ResumeComparisonItem] = []
        coverage_matrix: Dict[str, Dict[str, bool]] = {
            s: {} for s in (required_skills + preferred_skills)
        }

        evaluated_candidates = []

        for r_id in comp_in.resume_ids:
            resume = await self.resume_repo.get_by_id(r_id, user_id)
            if not resume:
                continue

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

            resume_proj_data = [
                {"name": p.name, "technologies": p.technologies or []}
                for p in resume.projects
            ]
            resume_edu_data = [{"degree": e.degree} for e in resume.education]
            resume_cert_data = [{"name": c.name} for c in resume.certifications]

            skill_matches, _ = semantic_matcher.match_skills(
                required_skills=required_skills,
                preferred_skills=preferred_skills,
                resume_skills=resume_skills_data,
                resume_bullets=resume_bullets
            )

            score_res = calculate_match_scores(
                skill_matches=skill_matches,
                resume_experiences=resume_exp_data,
                resume_projects=resume_proj_data,
                resume_education=resume_edu_data,
                resume_certifications=resume_cert_data,
                jd_min_exp_years=job.min_experience_years,
                jd_target_degree=job.target_degree
            )

            matched_s = [
                m["skill_name"] for m in skill_matches if m["match_status"] in ("EXACT_MATCH", "SEMANTIC_MATCH")
            ]
            missing_s = [
                m["skill_name"] for m in skill_matches if m["match_status"] == "MISSING"
            ]

            # Populate coverage matrix
            for s in coverage_matrix:
                coverage_matrix[s][resume.id] = s in matched_s

            total_years = sum(e.get("years_duration", 0.0) for e in resume_exp_data)

            evaluated_candidates.append({
                "resume_id": resume.id,
                "resume_title": resume.title,
                "candidate_name": resume.title,
                "overall_score": score_res["scores"]["overall"],
                "required_skills_score": score_res["scores"]["required_skills"],
                "preferred_skills_score": score_res["scores"]["preferred_skills"],
                "experience_score": score_res["scores"]["experience"],
                "project_score": score_res["scores"]["projects"],
                "education_score": score_res["scores"]["education"],
                "matched_skills_count": len(matched_s),
                "missing_skills_count": len(missing_s),
                "matched_skills": matched_s,
                "missing_skills": missing_s,
                "experience_years": round(total_years, 1),
            })

        # Rank candidates by overall score descending
        evaluated_candidates.sort(key=lambda c: c["overall_score"], reverse=True)
        for idx, c in enumerate(evaluated_candidates):
            c["rank"] = idx + 1
            candidates.append(ResumeComparisonItem(**c))

        return CompareResumesResponse(
            job_description_id=job.id,
            job_title=job.title,
            required_skills=required_skills,
            preferred_skills=preferred_skills,
            candidates=candidates,
            skill_coverage_matrix=coverage_matrix
        )
