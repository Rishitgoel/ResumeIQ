from typing import List, Dict, Any, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, field_validator
import os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    PROJECT_NAME: str = "ResumeIQ"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"

    # Security & Authentication
    SECRET_KEY: str = "resumeiq-super-secret-key-production-ready-min-32-chars-entropy"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/resumeiq"
    SYNC_DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/resumeiq"

    # Redis & Celery (defaults to in-memory — set these only if you have Redis)
    REDIS_URL: str = "memory://"
    CELERY_BROKER_URL: str = "memory://"
    CELERY_RESULT_BACKEND: str = "cache+memory://"

    # Storage
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")
    MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

    # Default Match Scoring Weights
    WEIGHT_REQUIRED_SKILLS: float = 0.40
    WEIGHT_PREFERRED_SKILLS: float = 0.20
    WEIGHT_EXPERIENCE: float = 0.15
    WEIGHT_PROJECTS: float = 0.10
    WEIGHT_EDUCATION: float = 0.10
    WEIGHT_OTHER: float = 0.05

    @property
    def scoring_weights(self) -> Dict[str, float]:
        return {
            "required_skills": self.WEIGHT_REQUIRED_SKILLS,
            "preferred_skills": self.WEIGHT_PREFERRED_SKILLS,
            "experience": self.WEIGHT_EXPERIENCE,
            "projects": self.WEIGHT_PROJECTS,
            "education": self.WEIGHT_EDUCATION,
            "other": self.WEIGHT_OTHER,
        }

settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
