import uuid
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Float, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.resume import Resume
    from app.models.job import JobDescription
    from app.models.skill import Skill

class Analysis(Base, TimestampMixin):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    resume_id: Mapped[str] = mapped_column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), index=True, nullable=False)
    job_description_id: Mapped[str] = mapped_column(String(36), ForeignKey("job_descriptions.id", ondelete="CASCADE"), index=True, nullable=False)

    overall_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    required_skills_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    preferred_skills_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    experience_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    project_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    education_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    other_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    scoring_weights: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=True)
    explanation_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    detailed_breakdown: Mapped[Optional[dict]] = mapped_column(JSON, default=dict, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="COMPLETED", nullable=False)  # PENDING, PROCESSING, COMPLETED, FAILED

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="analyses")
    resume: Mapped["Resume"] = relationship("Resume", back_populates="analyses")
    job_description: Mapped["JobDescription"] = relationship("JobDescription", back_populates="analyses")
    skill_matches: Mapped[List["AnalysisSkillMatch"]] = relationship("AnalysisSkillMatch", back_populates="analysis", cascade="all, delete-orphan")
    suggestions: Mapped[List["AnalysisSuggestion"]] = relationship("AnalysisSuggestion", back_populates="analysis", cascade="all, delete-orphan")

class AnalysisSkillMatch(Base, TimestampMixin):
    __tablename__ = "analysis_skill_matches"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id: Mapped[str] = mapped_column(String(36), ForeignKey("analyses.id", ondelete="CASCADE"), index=True, nullable=False)
    skill_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("skills.id", ondelete="SET NULL"), nullable=True)

    skill_name: Mapped[str] = mapped_column(String(100), nullable=False)
    requirement_type: Mapped[str] = mapped_column(String(50), default="REQUIRED_SKILL", nullable=False)  # REQUIRED_SKILL, PREFERRED_SKILL
    match_status: Mapped[str] = mapped_column(String(50), nullable=False)  # EXACT_MATCH, SEMANTIC_MATCH, MISSING
    resume_evidence_level: Mapped[str] = mapped_column(String(20), default="NONE", nullable=False)  # NONE, WEAK, MODERATE, STRONG
    resume_snippet: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    similarity_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    analysis: Mapped["Analysis"] = relationship("Analysis", back_populates="skill_matches")
    skill: Mapped[Optional["Skill"]] = relationship("Skill", back_populates="skill_matches")

class AnalysisSuggestion(Base, TimestampMixin):
    __tablename__ = "analysis_suggestions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id: Mapped[str] = mapped_column(String(36), ForeignKey("analyses.id", ondelete="CASCADE"), index=True, nullable=False)

    suggestion_type: Mapped[str] = mapped_column(String(50), nullable=False)  # MISSING_REQUIRED_SKILL, MISSING_PREFERRED_SKILL, WEAK_EVIDENCE, EXPERIENCE_GAP, FORMATTING
    priority: Mapped[str] = mapped_column(String(20), default="MEDIUM", nullable=False)  # HIGH, MEDIUM, LOW
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    action_category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    analysis: Mapped["Analysis"] = relationship("Analysis", back_populates="suggestions")
