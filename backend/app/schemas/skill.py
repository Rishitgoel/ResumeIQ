from typing import List, Optional
from pydantic import BaseModel

class SkillOut(BaseModel):
    id: str
    name: str
    canonical_name: str
    category: str
    aliases: Optional[List[str]] = []

    model_config = {"from_attributes": True}

class ResumeSkillOut(BaseModel):
    id: str
    skill_id: str
    skill_name: str
    canonical_name: str
    category: str
    detected_as: str
    evidence_level: str
    context_snippet: Optional[str] = None
    confidence_score: float

    model_config = {"from_attributes": True}

class SkillTaxonomyItem(BaseModel):
    name: str
    canonical_name: str
    category: str
    aliases: List[str]
