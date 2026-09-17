from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.job_service import JobService
from app.schemas.job import (
    JobDescriptionCreate,
    JobDescriptionOut,
    JobDescriptionDetailOut
)

router = APIRouter(prefix="/jobs", tags=["Job Descriptions"])

@router.post("/", response_model=JobDescriptionDetailOut, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_in: JobDescriptionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new job description and automatically extract requirements via NLP."""
    job_service = JobService(db)
    job = await job_service.create_job(current_user.id, job_in)
    return await job_service.get_job(job.id, current_user.id)

@router.get("/", response_model=Dict[str, Any])
async def list_jobs(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List authenticated user's job descriptions with pagination and search."""
    job_service = JobService(db)
    items, total = await job_service.list_jobs(current_user.id, page, limit, search)
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit if limit else 1
    }

@router.get("/{job_id}", response_model=JobDescriptionDetailOut)
async def get_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get full details and parsed requirements of a specific job description."""
    job_service = JobService(db)
    return await job_service.get_job(job_id, current_user.id)

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a job description and its parsed requirements."""
    job_service = JobService(db)
    await job_service.delete_job(job_id, current_user.id)
    return None
