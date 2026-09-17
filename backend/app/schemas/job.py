from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class JobRequirementOut(BaseModel):
    id: str
    requirement_type: str
    description: str
    weight: float
    skill_id: Optional[str] = None
    skill_name: Optional[str] = None

    model_config = {"from_attributes": True}

class JobDescriptionCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    company: Optional[str] = Field(None, max_length=255)
    raw_text: str = Field(..., min_length=10)
    location: Optional[str] = Field(None, max_length=255)
    job_type: Optional[str] = Field("FULL_TIME", max_length=50)
    min_experience_years: Optional[float] = 0.0
    target_degree: Optional[str] = None

class JobDescriptionOut(BaseModel):
    id: str
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    job_type: str
    min_experience_years: float
    target_degree: Optional[str] = None
    created_at: datetime
    requirements_count: Optional[int] = 0

    model_config = {"from_attributes": True}

class JobDescriptionDetailOut(JobDescriptionOut):
    raw_text: str
    requirements: List[JobRequirementOut] = []
    required_skills: List[str] = []
    preferred_skills: List[str] = []

    model_config = {"from_attributes": True}
