from typing import List, Optional, Tuple, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.job import JobDescription
from app.repositories.job_repo import JobRepository
from app.schemas.job import JobDescriptionCreate
from app.nlp.jd_parser import parse_job_description

class JobService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = JobRepository(db)

    async def create_job(self, user_id: str, job_in: JobDescriptionCreate) -> JobDescription:
        # Run NLP parsing on the JD text
        parsed = parse_job_description(job_in.raw_text)

        # Merge parsed parameters if user did not explicitly set them
        if not job_in.min_experience_years and parsed.get("min_experience_years"):
            job_in.min_experience_years = parsed["min_experience_years"]
        if not job_in.target_degree and parsed.get("target_degree"):
            job_in.target_degree = parsed["target_degree"]

        job = await self.repo.create(
            user_id=user_id,
            job_in=job_in,
            parsed_requirements=parsed.get("requirements", [])
        )
        return await self.repo.get_by_id(job.id, user_id)

    async def get_job(self, job_id: str, user_id: str) -> Dict[str, Any]:
        job = await self.repo.get_by_id(job_id, user_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job description not found."
            )

        req_skills = [
            r.skill.canonical_name if r.skill else r.description
            for r in job.requirements if r.requirement_type == "REQUIRED_SKILL"
        ]
        pref_skills = [
            r.skill.canonical_name if r.skill else r.description
            for r in job.requirements if r.requirement_type == "PREFERRED_SKILL"
        ]

        return {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "raw_text": job.raw_text,
            "location": job.location,
            "job_type": job.job_type,
            "min_experience_years": job.min_experience_years,
            "target_degree": job.target_degree,
            "created_at": job.created_at,
            "requirements_count": len(job.requirements),
            "requirements": [
                {
                    "id": r.id,
                    "requirement_type": r.requirement_type,
                    "description": r.description,
                    "weight": r.weight,
                    "skill_id": r.skill_id,
                    "skill_name": r.skill.canonical_name if r.skill else None
                }
                for r in job.requirements
            ],
            "required_skills": req_skills,
            "preferred_skills": pref_skills
        }

    async def list_jobs(
        self,
        user_id: str,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None
    ) -> Tuple[List[Dict[str, Any]], int]:
        jobs, total = await self.repo.list_by_user(user_id, page, limit, search)
        formatted = []
        for j in jobs:
            formatted.append({
                "id": j.id,
                "title": j.title,
                "company": j.company,
                "location": j.location,
                "job_type": j.job_type,
                "min_experience_years": j.min_experience_years,
                "target_degree": j.target_degree,
                "created_at": j.created_at,
                "requirements_count": len(j.requirements) if j.requirements else 0
            })
        return formatted, total

    async def delete_job(self, job_id: str, user_id: str) -> bool:
        job = await self.repo.get_by_id(job_id, user_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job description not found."
            )
        return await self.repo.delete(job_id, user_id)
