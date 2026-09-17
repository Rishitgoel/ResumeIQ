import os
import uuid
import hashlib
from typing import List, Optional, Tuple, Dict, Any
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.models.resume import Resume
from app.repositories.resume_repo import ResumeRepository
from app.nlp.pdf_parser import extract_text_from_pdf, PDFParseException
from app.nlp.section_detector import detect_sections
from app.nlp.skill_extractor import extract_skills
from app.nlp.entity_extractor import (
    extract_experiences,
    extract_projects,
    extract_education,
    extract_certifications
)
import logging

logger = logging.getLogger(__name__)

class ResumeService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ResumeRepository(db)

    async def upload_and_process(
        self,
        user_id: str,
        file: UploadFile,
        title: Optional[str] = None
    ) -> Resume:
        """Validate, store, and execute parsing pipeline for uploaded resume PDF."""
        # 1. Validate MIME type and file extension
        if not file.filename.lower().endswith(".pdf") and file.content_type != "application/pdf":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file format. Only PDF files (.pdf) are permitted."
            )

        # 2. Read contents and validate size
        contents = await file.read()
        file_size = len(contents)
        if file_size > settings.MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds maximum allowed limit of {settings.MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB."
            )
        if file_size < 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty or too small to be a valid resume."
            )

        # 3. Calculate SHA-256 hash
        file_hash = hashlib.sha256(contents).hexdigest()

        # 4. Generate secure file storage path
        safe_filename = f"{uuid.uuid4().hex}.pdf"
        file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
        with open(file_path, "wb") as f:
            f.write(contents)

        resume_title = title.strip() if title else file.filename.replace(".pdf", "")

        # 5. Create initial record in UPLOADED state
        resume = await self.repo.create(
            user_id=user_id,
            title=resume_title,
            original_filename=file.filename,
            file_path=file_path,
            file_size_bytes=file_size,
            file_hash=file_hash
        )

        # 6. Execute NLP parsing pipeline
        await self.process_resume(resume.id, contents)
        # Reload with all relationships
        return await self.repo.get_by_id(resume.id, user_id)

    async def process_resume(self, resume_id: str, pdf_bytes: bytes) -> Optional[Resume]:
        """Execute text extraction, section segmentation, entity extraction, and persistence."""
        await self.repo.update_status(resume_id, "PROCESSING")

        try:
            # 1. PDF Text extraction
            raw_text, page_count, metadata = extract_text_from_pdf(pdf_bytes)

            # 2. Section detection
            sections = detect_sections(raw_text)
            section_map = {s["section_type"]: s["raw_content"] for s in sections}

            # 3. Skill extraction with evidence levels
            skills = extract_skills(raw_text, sections)

            # 4. Entity extraction
            experiences = extract_experiences(section_map.get("EXPERIENCE", ""))
            projects = extract_projects(section_map.get("PROJECTS", ""))
            education_list = extract_education(section_map.get("EDUCATION", ""))
            certifications = extract_certifications(section_map.get("CERTIFICATIONS", ""))

            # 5. Save structured data to database
            resume = await self.repo.save_parsed_data(
                resume_id=resume_id,
                raw_text=raw_text,
                sections=sections,
                skills=skills,
                experiences=experiences,
                projects=projects,
                education_list=education_list,
                certifications_list=certifications
            )
            logger.info(f"Resume {resume_id} parsed successfully: {len(skills)} skills, {len(experiences)} experiences.")
            return resume

        except PDFParseException as pe:
            logger.error(f"PDF Parse error for resume {resume_id}: {pe}")
            await self.repo.update_status(resume_id, "FAILED", error_message=str(pe))
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(pe))
        except Exception as e:
            logger.exception(f"Unexpected error parsing resume {resume_id}: {e}")
            await self.repo.update_status(resume_id, "FAILED", error_message=f"Parsing error: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred while analyzing the resume PDF.")

    async def get_resume(self, resume_id: str, user_id: str) -> Resume:
        resume = await self.repo.get_by_id(resume_id, user_id)
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found."
            )
        return resume

    async def list_resumes(
        self,
        user_id: str,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None
    ) -> Tuple[List[Dict[str, Any]], int]:
        resumes, total = await self.repo.list_by_user(user_id, page, limit, search)
        formatted = []
        for r in resumes:
            formatted.append({
                "id": r.id,
                "title": r.title,
                "original_filename": r.original_filename,
                "file_size_bytes": r.file_size_bytes,
                "status": r.status,
                "error_message": r.error_message,
                "parsed_at": r.parsed_at,
                "created_at": r.created_at,
                "skills_count": len(r.skills) if r.skills else 0,
                "experience_count": len(r.experiences) if r.experiences else 0
            })
        return formatted, total

    async def delete_resume(self, resume_id: str, user_id: str) -> bool:
        resume = await self.repo.get_by_id(resume_id, user_id)
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found."
            )
        # Delete file from disk if present
        if resume.file_path and os.path.exists(resume.file_path):
            try:
                os.remove(resume.file_path)
            except OSError:
                pass
        return await self.repo.delete(resume_id, user_id)
