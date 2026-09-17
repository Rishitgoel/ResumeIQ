from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, or_
from sqlalchemy.orm import selectinload
from app.models.job import JobDescription, JobRequirement
from app.models.skill import Skill
from app.schemas.job import JobDescriptionCreate

class JobRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        user_id: str,
        job_in: JobDescriptionCreate,
        parsed_requirements: List[Dict[str, Any]]
    ) -> JobDescription:
        job = JobDescription(
            user_id=user_id,
            title=job_in.title,
            company=job_in.company,
            raw_text=job_in.raw_text,
            location=job_in.location,
            job_type=job_in.job_type or "FULL_TIME",
            min_experience_years=job_in.min_experience_years or 0.0,
            target_degree=job_in.target_degree
        )
        self.db.add(job)
        await self.db.flush()

        # Link requirements
        for req in parsed_requirements:
            skill_id = None
            if req.get("canonical_skill"):
                s_stmt = select(Skill).where(Skill.canonical_name == req["canonical_skill"])
                s_res = await self.db.execute(s_stmt)
                db_skill = s_res.scalar_one_or_none()
                if not db_skill:
                    db_skill = Skill(
                        name=req["canonical_skill"],
                        canonical_name=req["canonical_skill"],
                        category=req.get("category", "OTHER"),
                        aliases=[]
                    )
                    self.db.add(db_skill)
                    await self.db.flush()
                skill_id = db_skill.id

            req_obj = JobRequirement(
                job_description_id=job.id,
                requirement_type=req.get("requirement_type", "REQUIRED_SKILL"),
                description=req.get("description", ""),
                weight=req.get("weight", 1.0),
                skill_id=skill_id
            )
            self.db.add(req_obj)

        await self.db.commit()
        await self.db.refresh(job)
        return job

    async def get_by_id(self, job_id: str, user_id: str) -> Optional[JobDescription]:
        stmt = (
            select(JobDescription)
            .where(JobDescription.id == job_id, JobDescription.user_id == user_id)
            .options(
                selectinload(JobDescription.requirements).selectinload(JobRequirement.skill)
            )
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_user(
        self,
        user_id: str,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None
    ) -> Tuple[List[JobDescription], int]:
        stmt = select(JobDescription).where(JobDescription.user_id == user_id)
        if search:
            search_pattern = f"%{search.lower()}%"
            stmt = stmt.where(
                or_(
                    func.lower(JobDescription.title).like(search_pattern),
                    func.lower(JobDescription.company).like(search_pattern)
                )
            )

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.db.execute(count_stmt)).scalar() or 0

        stmt = (
            stmt.options(selectinload(JobDescription.requirements))
            .order_by(JobDescription.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        jobs = list(result.scalars().all())
        return jobs, total

    async def delete(self, job_id: str, user_id: str) -> bool:
        stmt = select(JobDescription).where(JobDescription.id == job_id, JobDescription.user_id == user_id)
        result = await self.db.execute(stmt)
        job = result.scalar_one_or_none()
        if not job:
            return False
        await self.db.delete(job)
        await self.db.commit()
        return True
