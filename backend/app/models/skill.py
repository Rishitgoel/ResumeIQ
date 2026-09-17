import uuid
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Float, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.resume import Resume
    from app.models.job import JobRequirement
    from app.models.analysis import AnalysisSkillMatch

class Skill(Base, TimestampMixin):
    __tablename__ = "skills"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    canonical_name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="OTHER", index=True, nullable=False)
    aliases: Mapped[Optional[list]] = mapped_column(JSON, default=list, nullable=True)

    # Relationships
    resume_skills: Mapped[List["ResumeSkill"]] = relationship("ResumeSkill", back_populates="skill", cascade="all, delete-orphan")
    job_requirements: Mapped[List["JobRequirement"]] = relationship("JobRequirement", back_populates="skill")
    skill_matches: Mapped[List["AnalysisSkillMatch"]] = relationship("AnalysisSkillMatch", back_populates="skill")

class ResumeSkill(Base, TimestampMixin):
    __tablename__ = "resume_skills"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id: Mapped[str] = mapped_column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), index=True, nullable=False)
    skill_id: Mapped[str] = mapped_column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), index=True, nullable=False)
    
    detected_as: Mapped[str] = mapped_column(String(100), nullable=False)
    evidence_level: Mapped[str] = mapped_column(String(20), default="WEAK", nullable=False)  # WEAK, MODERATE, STRONG
    context_snippet: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    confidence_score: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)

    # Relationships
    resume: Mapped["Resume"] = relationship("Resume", back_populates="skills")
    skill: Mapped["Skill"] = relationship("Skill", back_populates="resume_skills")

    @property
    def skill_name(self) -> str:
        return self.skill.name if self.skill else self.detected_as

    @property
    def canonical_name(self) -> str:
        return self.skill.canonical_name if self.skill else self.detected_as

    @property
    def category(self) -> str:
        return self.skill.category if self.skill else "OTHER"
