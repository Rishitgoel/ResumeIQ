import os
import logging
from datetime import datetime, timezone
from app.workers.celery_app import celery_app
from app.core.database import SyncSessionLocal
from app.models.resume import (
    Resume,
    ResumeSection,
    Experience,
    Project,
    Education,
    Certification
)
from app.models.skill import Skill, ResumeSkill
from app.nlp.pdf_parser import extract_text_from_pdf, PDFParseException
from app.nlp.section_detector import detect_sections
from app.nlp.skill_extractor import extract_skills
from app.nlp.entity_extractor import (
    extract_experiences,
    extract_projects,
    extract_education,
    extract_certifications
)

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, max_retries=3, default_retry_delay=10)
def parse_resume_async(self, resume_id: str, file_path: str):
    """
    Background Celery worker task to extract text, sections, and entities from PDF resumes.
    Implements automatic retries with backoff for transient failures.
    """
    logger.info(f"Starting background parse for resume_id={resume_id}")
    db = SyncSessionLocal()

    try:
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if not resume:
            logger.error(f"Resume {resume_id} not found in database.")
            return {"status": "FAILED", "error": "Resume record not found"}

        resume.status = "PROCESSING"
        db.commit()

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found on disk at {file_path}")

        # 1. Extract text
        raw_text, page_count, metadata = extract_text_from_pdf(file_path)

        # 2. Extract sections
        sections = detect_sections(raw_text)
        section_map = {s["section_type"]: s["raw_content"] for s in sections}

        # 3. Extract skills with evidence levels
        skills = extract_skills(raw_text, sections)

        # 4. Extract entities
        experiences = extract_experiences(section_map.get("EXPERIENCE", ""))
        projects = extract_projects(section_map.get("PROJECTS", ""))
        education_list = extract_education(section_map.get("EDUCATION", ""))
        certifications = extract_certifications(section_map.get("CERTIFICATIONS", ""))

        # 5. Save structured data to DB
        resume.raw_text = raw_text
        resume.sections.clear()
        resume.skills.clear()
        resume.experiences.clear()
        resume.projects.clear()
        resume.education.clear()
        resume.certifications.clear()

        for idx, sec in enumerate(sections):
            resume.sections.append(
                ResumeSection(
                    section_type=sec.get("section_type", "OTHER"),
                    raw_content=sec.get("raw_content", ""),
                    section_order=idx
                )
            )

        for sk in skills:
            canonical_name = sk["canonical_name"]
            db_skill = db.query(Skill).filter(Skill.canonical_name == canonical_name).first()
            if not db_skill:
                db_skill = Skill(
                    name=sk.get("name", canonical_name),
                    canonical_name=canonical_name,
                    category=sk.get("category", "OTHER"),
                    aliases=sk.get("aliases", [])
                )
                db.add(db_skill)
                db.flush()

            resume.skills.append(
                ResumeSkill(
                    skill_id=db_skill.id,
                    detected_as=sk.get("detected_as", canonical_name),
                    evidence_level=sk.get("evidence_level", "WEAK"),
                    context_snippet=sk.get("context_snippet"),
                    confidence_score=sk.get("confidence_score", 1.0)
                )
            )

        for exp in experiences:
            resume.experiences.append(
                Experience(
                    company_name=exp.get("company_name", "Company"),
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

        for edu in education_list:
            resume.education.append(
                Education(
                    institution=edu.get("institution", "Institution"),
                    degree=edu.get("degree"),
                    field_of_study=edu.get("field_of_study"),
                    start_date=edu.get("start_date"),
                    end_date=edu.get("end_date"),
                    gpa=edu.get("gpa"),
                    max_gpa=edu.get("max_gpa")
                )
            )

        for cert in certifications:
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

        db.commit()
        logger.info(f"Background parsing succeeded for resume {resume_id}")
        return {"status": "COMPLETED", "resume_id": resume_id}

    except PDFParseException as pe:
        logger.error(f"Unrecoverable PDF error for resume {resume_id}: {pe}")
        if resume:
            resume.status = "FAILED"
            resume.error_message = str(pe)
            db.commit()
        return {"status": "FAILED", "error": str(pe)}
    except Exception as exc:
        logger.exception(f"Error processing resume {resume_id}: {exc}")
        if self.request.retries < self.max_retries:
            raise self.retry(exc=exc)
        if resume:
            resume.status = "FAILED"
            resume.error_message = f"Processing error: {str(exc)}"
            db.commit()
        return {"status": "FAILED", "error": str(exc)}
    finally:
        db.close()
