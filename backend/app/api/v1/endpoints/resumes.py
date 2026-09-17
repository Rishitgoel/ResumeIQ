from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, UploadFile, File, Form, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.resume_service import ResumeService
from app.schemas.resume import (
    ResumeOut,
    ResumeDetailOut,
    ResumeStatusOut
)

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/upload", response_model=ResumeDetailOut, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload and parse a PDF resume."""
    resume_service = ResumeService(db)
    resume = await resume_service.upload_and_process(
        user_id=current_user.id,
        file=file,
        title=title
    )
    return resume

@router.get("/", response_model=Dict[str, Any])
async def list_resumes(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List authenticated user's uploaded resumes with pagination and search."""
    resume_service = ResumeService(db)
    items, total = await resume_service.list_resumes(
        user_id=current_user.id,
        page=page,
        limit=limit,
        search=search
    )
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit if limit else 1
    }

@router.get("/{resume_id}", response_model=ResumeDetailOut)
async def get_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve full parsed and structured details of a specific resume."""
    resume_service = ResumeService(db)
    return await resume_service.get_resume(resume_id, current_user.id)

@router.get("/{resume_id}/status", response_model=ResumeStatusOut)
async def get_resume_status(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Check asynchronous parsing status of a resume."""
    resume_service = ResumeService(db)
    resume = await resume_service.get_resume(resume_id, current_user.id)
    return ResumeStatusOut(
        id=resume.id,
        status=resume.status,
        error_message=resume.error_message,
        parsed_at=resume.parsed_at
    )

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a resume and its associated parsed entities and files."""
    resume_service = ResumeService(db)
    await resume_service.delete_resume(resume_id, current_user.id)
    return None
