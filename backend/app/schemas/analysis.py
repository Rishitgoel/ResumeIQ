from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ScoringWeightsInput(BaseModel):
    required_skills: Optional[float] = Field(0.40, ge=0.0, le=1.0)
    preferred_skills: Optional[float] = Field(0.20, ge=0.0, le=1.0)
    experience: Optional[float] = Field(0.15, ge=0.0, le=1.0)
    projects: Optional[float] = Field(0.10, ge=0.0, le=1.0)
    education: Optional[float] = Field(0.10, ge=0.0, le=1.0)
    other: Optional[float] = Field(0.05, ge=0.0, le=1.0)

class AnalysisCreate(BaseModel):
    resume_id: str
    job_description_id: str
    custom_weights: Optional[ScoringWeightsInput] = None

class AnalysisSkillMatchOut(BaseModel):
    id: str
    skill_name: str
    requirement_type: str  # REQUIRED_SKILL, PREFERRED_SKILL
    match_status: str      # EXACT_MATCH, SEMANTIC_MATCH, MISSING
    resume_evidence_level: str  # NONE, WEAK, MODERATE, STRONG
    resume_snippet: Optional[str] = None
    similarity_score: float

    model_config = {"from_attributes": True}

class AnalysisSuggestionOut(BaseModel):
    id: str
    suggestion_type: str  # MISSING_REQUIRED_SKILL, MISSING_PREFERRED_SKILL, WEAK_EVIDENCE, EXPERIENCE_GAP, FORMATTING
    priority: str         # HIGH, MEDIUM, LOW
    title: str
    description: str
    action_category: Optional[str] = None

    model_config = {"from_attributes": True}

class AnalysisOut(BaseModel):
    id: str
    resume_id: str
    job_description_id: str
    overall_score: float
    required_skills_score: float
    preferred_skills_score: float
    experience_score: float
    project_score: float
    education_score: float
    other_score: float
    status: str
    created_at: datetime
    resume_title: Optional[str] = None
    job_title: Optional[str] = None
    job_company: Optional[str] = None

    model_config = {"from_attributes": True}

class AnalysisDetailOut(AnalysisOut):
    scoring_weights: Dict[str, float]
    explanation_summary: Optional[str] = None
    detailed_breakdown: Optional[Dict[str, Any]] = None
    skill_matches: List[AnalysisSkillMatchOut] = []
    suggestions: List[AnalysisSuggestionOut] = []

    model_config = {"from_attributes": True}

class CompareResumesRequest(BaseModel):
    job_description_id: str
    resume_ids: List[str] = Field(..., min_length=2, max_length=5)

class ResumeComparisonItem(BaseModel):
    resume_id: str
    resume_title: str
    candidate_name: Optional[str] = None
    overall_score: float
    required_skills_score: float
    preferred_skills_score: float
    experience_score: float
    project_score: float
    education_score: float
    matched_skills_count: int
    missing_skills_count: int
    matched_skills: List[str]
    missing_skills: List[str]
    experience_years: float
    rank: int

class CompareResumesResponse(BaseModel):
    job_description_id: str
    job_title: str
    required_skills: List[str]
    preferred_skills: List[str]
    candidates: List[ResumeComparisonItem]
    skill_coverage_matrix: Dict[str, Dict[str, bool]]  # skill_name -> {resume_id: bool}
