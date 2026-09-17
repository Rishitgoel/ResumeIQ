from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field
from app.schemas.skill import ResumeSkillOut

class ResumeSectionOut(BaseModel):
    id: str
    section_type: str
    raw_content: str
    section_order: int

    model_config = {"from_attributes": True}

class ExperienceOut(BaseModel):
    id: str
    company_name: str
    job_title: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None
    bullet_points: Optional[List[str]] = []
    technologies: Optional[List[str]] = []
    years_duration: float = 0.0

    model_config = {"from_attributes": True}

class ProjectOut(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    url: Optional[str] = None
    bullet_points: Optional[List[str]] = []
    technologies: Optional[List[str]] = []

    model_config = {"from_attributes": True}

class EducationOut(BaseModel):
    id: str
    institution: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    gpa: Optional[float] = None
    max_gpa: Optional[float] = None

    model_config = {"from_attributes": True}

class CertificationOut(BaseModel):
    id: str
    name: str
    issuer: Optional[str] = None
    issue_date: Optional[str] = None
    credential_url: Optional[str] = None

    model_config = {"from_attributes": True}

class ResumeOut(BaseModel):
    id: str
    title: str
    original_filename: str
    file_size_bytes: int
    status: str
    error_message: Optional[str] = None
    parsed_at: Optional[datetime] = None
    created_at: datetime
    skills_count: Optional[int] = 0
    experience_count: Optional[int] = 0

    model_config = {"from_attributes": True}

class ResumeDetailOut(ResumeOut):
    raw_text: Optional[str] = None
    sections: List[ResumeSectionOut] = []
    skills: List[ResumeSkillOut] = []
    experiences: List[ExperienceOut] = []
    projects: List[ProjectOut] = []
    education: List[EducationOut] = []
    certifications: List[CertificationOut] = []

    model_config = {"from_attributes": True}

class ResumeStatusOut(BaseModel):
    id: str
    status: str
    error_message: Optional[str] = None
    parsed_at: Optional[datetime] = None

class ResumeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
