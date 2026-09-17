import uuid
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Float, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.skill import Skill
    from app.models.analysis import Analysis

class JobDescription(Base, TimestampMixin):
    __tablename__ = "job_descriptions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    company: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    raw_text: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    job_type: Mapped[str] = mapped_column(String(50), default="FULL_TIME", nullable=False)  # FULL_TIME, PART_TIME, CONTRACT, REMOTE, HYBRID
    min_experience_years: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    target_degree: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="job_descriptions")
    requirements: Mapped[List["JobRequirement"]] = relationship("JobRequirement", back_populates="job_description", cascade="all, delete-orphan")
    analyses: Mapped[List["Analysis"]] = relationship("Analysis", back_populates="job_description", cascade="all, delete-orphan")

class JobRequirement(Base, TimestampMixin):
    __tablename__ = "job_requirements"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_description_id: Mapped[str] = mapped_column(String(36), ForeignKey("job_descriptions.id", ondelete="CASCADE"), index=True, nullable=False)
    skill_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("skills.id", ondelete="SET NULL"), nullable=True)

    requirement_type: Mapped[str] = mapped_column(String(50), nullable=False)  # REQUIRED_SKILL, PREFERRED_SKILL, RESPONSIBILITY, EDUCATION, EXPERIENCE
    description: Mapped[str] = mapped_column(Text, nullable=False)
    weight: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)

    # Relationships
    job_description: Mapped["JobDescription"] = relationship("JobDescription", back_populates="requirements")
    skill: Mapped[Optional["Skill"]] = relationship("Skill", back_populates="job_requirements")
