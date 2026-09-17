from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload
from app.models.analysis import Analysis, AnalysisSkillMatch, AnalysisSuggestion
from app.models.resume import Resume
from app.models.job import JobDescription
from app.models.skill import Skill

class AnalysisRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        user_id: str,
        resume_id: str,
        job_description_id: str,
        scores: Dict[str, float],
        scoring_weights: Dict[str, float],
        explanation_summary: str,
        detailed_breakdown: Dict[str, Any],
        skill_matches: List[Dict[str, Any]],
        suggestions: List[Dict[str, Any]]
    ) -> Analysis:
        analysis = Analysis(
            user_id=user_id,
            resume_id=resume_id,
            job_description_id=job_description_id,
            overall_score=scores.get("overall", 0.0),
            required_skills_score=scores.get("required_skills", 0.0),
            preferred_skills_score=scores.get("preferred_skills", 0.0),
            experience_score=scores.get("experience", 0.0),
            project_score=scores.get("projects", 0.0),
            education_score=scores.get("education", 0.0),
            other_score=scores.get("other", 0.0),
            scoring_weights=scoring_weights,
            explanation_summary=explanation_summary,
            detailed_breakdown=detailed_breakdown,
            status="COMPLETED"
        )
        self.db.add(analysis)
        await self.db.flush()

        # Add skill matches
        for m in skill_matches:
            self.db.add(
                AnalysisSkillMatch(
                    analysis_id=analysis.id,
                    skill_name=m["skill_name"],
                    requirement_type=m.get("requirement_type", "REQUIRED_SKILL"),
                    match_status=m.get("match_status", "MISSING"),
                    resume_evidence_level=m.get("resume_evidence_level", "NONE"),
                    resume_snippet=m.get("resume_snippet"),
                    similarity_score=m.get("similarity_score", 0.0)
                )
            )

        # Add suggestions
        for s in suggestions:
            self.db.add(
                AnalysisSuggestion(
                    analysis_id=analysis.id,
                    suggestion_type=s.get("suggestion_type", "FORMATTING"),
                    priority=s.get("priority", "MEDIUM"),
                    title=s.get("title", ""),
                    description=s.get("description", ""),
                    action_category=s.get("action_category")
                )
            )

        await self.db.commit()
        await self.db.refresh(analysis)
        return analysis

    async def get_by_id(self, analysis_id: str, user_id: str) -> Optional[Analysis]:
        stmt = (
            select(Analysis)
            .where(Analysis.id == analysis_id, Analysis.user_id == user_id)
            .options(
                selectinload(Analysis.skill_matches),
                selectinload(Analysis.suggestions),
                selectinload(Analysis.resume),
                selectinload(Analysis.job_description)
            )
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_user(
        self,
        user_id: str,
        page: int = 1,
        limit: int = 10
    ) -> Tuple[List[Analysis], int]:
        stmt = select(Analysis).where(Analysis.user_id == user_id)
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.db.execute(count_stmt)).scalar() or 0

        stmt = (
            stmt.options(
                selectinload(Analysis.resume),
                selectinload(Analysis.job_description)
            )
            .order_by(Analysis.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        analyses = list(result.scalars().all())
        return analyses, total

    async def get_dashboard_stats(self, user_id: str) -> Dict[str, Any]:
        # Count Resumes
        resume_count = (await self.db.execute(
            select(func.count()).select_from(Resume).where(Resume.user_id == user_id)
        )).scalar() or 0

        # Count Jobs
        job_count = (await self.db.execute(
            select(func.count()).select_from(JobDescription).where(JobDescription.user_id == user_id)
        )).scalar() or 0

        # Count Analyses & Scores
        analysis_stats = (await self.db.execute(
            select(
                func.count(Analysis.id),
                func.avg(Analysis.overall_score),
                func.max(Analysis.overall_score),
                func.min(Analysis.overall_score)
            ).where(Analysis.user_id == user_id)
        )).first()

        total_analyses = analysis_stats[0] or 0
        avg_score = round(float(analysis_stats[1] or 0.0), 1)
        max_score = round(float(analysis_stats[2] or 0.0), 1)
        min_score = round(float(analysis_stats[3] or 0.0), 1)

        # Missing Skills Aggregation
        missing_skills_stmt = (
            select(
                AnalysisSkillMatch.skill_name,
                func.count(AnalysisSkillMatch.id).label("freq")
            )
            .join(Analysis, Analysis.id == AnalysisSkillMatch.analysis_id)
            .where(
                Analysis.user_id == user_id,
                AnalysisSkillMatch.match_status == "MISSING"
            )
            .group_by(AnalysisSkillMatch.skill_name)
            .order_by(desc("freq"))
            .limit(8)
        )
        missing_res = await self.db.execute(missing_skills_stmt)
        top_missing = [
            {"skill_name": row[0], "frequency": row[1], "category": "TECHNICAL"}
            for row in missing_res.all()
        ]

        # Score distribution buckets (0-20, 21-40, 41-60, 61-80, 81-100)
        all_scores_stmt = select(Analysis.overall_score).where(Analysis.user_id == user_id)
        scores_res = await self.db.execute(all_scores_stmt)
        scores = [s[0] for s in scores_res.all()]

        buckets = {
            "0-20%": 0,
            "21-40%": 0,
            "41-60%": 0,
            "61-80%": 0,
            "81-100%": 0
        }
        for s in scores:
            if s <= 20:
                buckets["0-20%"] += 1
            elif s <= 40:
                buckets["21-40%"] += 1
            elif s <= 60:
                buckets["41-60%"] += 1
            elif s <= 80:
                buckets["61-80%"] += 1
            else:
                buckets["81-100%"] += 1

        distribution = [{"range_label": k, "count": v} for k, v in buckets.items()]

        # Recent 5 analyses
        recent_stmt = (
            select(Analysis)
            .where(Analysis.user_id == user_id)
            .options(selectinload(Analysis.resume), selectinload(Analysis.job_description))
            .order_by(Analysis.created_at.desc())
            .limit(5)
        )
        recent_res = await self.db.execute(recent_stmt)
        recent_analyses = [
            {
                "id": a.id,
                "resume_id": a.resume_id,
                "job_id": a.job_description_id,
                "resume_title": a.resume.title if a.resume else "Resume",
                "job_title": a.job_description.title if a.job_description else "Job",
                "company": a.job_description.company if a.job_description else None,
                "overall_score": a.overall_score,
                "created_at": a.created_at.isoformat()
            }
            for a in recent_res.scalars().all()
        ]

        return {
            "total_resumes": resume_count,
            "total_jobs": job_count,
            "total_analyses": total_analyses,
            "average_match_score": avg_score,
            "highest_match_score": max_score,
            "lowest_match_score": min_score,
            "top_missing_skills": top_missing,
            "score_distribution": distribution,
            "recent_analyses": recent_analyses
        }
