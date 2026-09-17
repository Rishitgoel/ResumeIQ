from datetime import datetime, timezone
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, or_
from sqlalchemy.orm import selectinload
from app.models.resume import (
    Resume,
    ResumeSection,
    Experience,
    Project,
    Education,
    Certification
)
from app.models.skill import Skill, ResumeSkill

class ResumeRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        user_id: str,
        title: str,
        original_filename: str,
        file_path: str,
        file_size_bytes: int,
        file_hash: str
    ) -> Resume:
        resume = Resume(
            user_id=user_id,
            title=title,
            original_filename=original_filename,
            file_path=file_path,
            file_size_bytes=file_size_bytes,
            file_hash=file_hash,
            status="UPLOADED"
        )
        self.db.add(resume)
        await self.db.commit()
        await self.db.refresh(resume)
        return resume

    async def get_by_id(self, resume_id: str, user_id: str) -> Optional[Resume]:
        stmt = (
            select(Resume)
            .where(Resume.id == resume_id, Resume.user_id == user_id)
            .options(
                selectinload(Resume.sections),
                selectinload(Resume.skills).selectinload(ResumeSkill.skill),
                selectinload(Resume.experiences),
                selectinload(Resume.projects),
                selectinload(Resume.education),
                selectinload(Resume.certifications)
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
    ) -> Tuple[List[Resume], int]:
        stmt = select(Resume).where(Resume.user_id == user_id)
        if search:
            search_pattern = f"%{search.lower()}%"
            stmt = stmt.where(
                or_(
                    func.lower(Resume.title).like(search_pattern),
                    func.lower(Resume.original_filename).like(search_pattern)
                )
            )

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.db.execute(count_stmt)).scalar() or 0

        # Paginate and order by newest first
        stmt = (
            stmt.options(
                selectinload(Resume.skills),
                selectinload(Resume.experiences)
            )
            .order_by(Resume.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        resumes = list(result.scalars().all())
        return resumes, total

    async def update_status(
        self,
        resume_id: str,
        status: str,
        error_message: Optional[str] = None,
        raw_text: Optional[str] = None
    ):
        stmt = select(Resume).where(Resume.id == resume_id)
        result = await self.db.execute(stmt)
        resume = result.scalar_one_or_none()
        if resume:
            resume.status = status
            if error_message:
                resume.error_message = error_message
            if raw_text:
                resume.raw_text = raw_text
            if status == "COMPLETED":
                resume.parsed_at = datetime.now(timezone.utc)
            await self.db.commit()
            await self.db.refresh(resume)
        return resume

    async def save_parsed_data(
        self,
        resume_id: str,
        raw_text: str,
        sections: List[Dict[str, Any]],
        skills: List[Dict[str, Any]],
        experiences: List[Dict[str, Any]],
        projects: List[Dict[str, Any]],
        education_list: List[Dict[str, Any]],
        certifications_list: List[Dict[str, Any]]
    ):
        stmt = (
            select(Resume)
            .where(Resume.id == resume_id)
            .options(
                selectinload(Resume.sections),
                selectinload(Resume.skills),
                selectinload(Resume.experiences),
                selectinload(Resume.projects),
                selectinload(Resume.education),
                selectinload(Resume.certifications)
            )
        )
        result = await self.db.execute(stmt)
        resume = result.scalar_one_or_none()
        if not resume:
            return None

        resume.raw_text = raw_text

        # Clear existing parsed associations if re-parsing
        resume.sections.clear()
        resume.skills.clear()
        resume.experiences.clear()
        resume.projects.clear()
        resume.education.clear()
        resume.certifications.clear()

        # Add sections
        for idx, sec in enumerate(sections):
            resume.sections.append(
                ResumeSection(
                    section_type=sec.get("section_type", "OTHER"),
                    raw_content=sec.get("raw_content", ""),
                    section_order=idx
                )
            )

        # Upsert canonical skills and add resume_skills
        for sk in skills:
            skill_name = sk["canonical_name"]
            # Look up or create Skill
            s_stmt = select(Skill).where(Skill.canonical_name == skill_name)
            s_res = await self.db.execute(s_stmt)
            db_skill = s_res.scalar_one_or_none()
            if not db_skill:
                db_skill = Skill(
                    name=sk.get("name", skill_name),
                    canonical_name=skill_name,
                    category=sk.get("category", "OTHER"),
                    aliases=sk.get("aliases", [])
                )
                self.db.add(db_skill)
                await self.db.flush()

            resume.skills.append(
                ResumeSkill(
                    skill_id=db_skill.id,
                    detected_as=sk.get("detected_as", skill_name),
                    evidence_level=sk.get("evidence_level", "WEAK"),
                    context_snippet=sk.get("context_snippet"),
                    confidence_score=sk.get("confidence_score", 1.0)
                )
            )

        # Add experiences
        for exp in experiences:
            resume.experiences.append(
                Experience(
                    company_name=exp.get("company_name", "Unknown Company"),
                    job_title=exp.get("job_title", "Professional"),
                    location=exp.get("location"),
                    start_date=exp.get("start_date"),
                    end_date=exp.get("end_date"),
                    is_current=exp.get("is_current", False),
                    description=exp.get("description"),
                    bullet_points=exp.get("bullet_points", []),
                    technologies=exp.get("technologies", []),
                    years_duration=exp.get("years_duration", 0.0)
                )
            )

        # Add projects
        for proj in projects:
            resume.projects.append(
                Project(
                    name=proj.get("name", "Project"),
                    description=proj.get("description"),
                    url=proj.get("url"),
                    bullet_points=proj.get("bullet_points", []),
                    technologies=proj.get("technologies", [])
                )
            )

        # Add education
        for edu in education_list:
            resume.education.append(
                Education(
                    institution=edu.get("institution", "Unknown Institution"),
                    degree=edu.get("degree"),
                    field_of_study=edu.get("field_of_study"),
                    start_date=edu.get("start_date"),
                    end_date=edu.get("end_date"),
                    gpa=edu.get("gpa"),
                    max_gpa=edu.get("max_gpa")
                )
            )

        # Add certifications
        for cert in certifications_list:
            resume.certifications.append(
                Certification(
                    name=cert.get("name", "Certification"),
                    issuer=cert.get("issuer"),
                    issue_date=cert.get("issue_date"),
                    credential_url=cert.get("credential_url")
                )
            )

        resume.status = "COMPLETED"
        resume.parsed_at = datetime.now(timezone.utc)
        resume.error_message = None

        await self.db.commit()
        await self.db.refresh(resume)
        return resume

    async def delete(self, resume_id: str, user_id: str) -> bool:
        stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == user_id)
        result = await self.db.execute(stmt)
        resume = result.scalar_one_or_none()
        if not resume:
            return False
        await self.db.delete(resume)
        await self.db.commit()
        return True
