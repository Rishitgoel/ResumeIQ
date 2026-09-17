from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.analysis_service import AnalysisService
from app.services.comparison_service import ComparisonService
from app.schemas.analysis import (
    AnalysisCreate,
    AnalysisOut,
    AnalysisDetailOut,
    AnalysisSkillMatchOut,
    AnalysisSuggestionOut,
    CompareResumesRequest,
    CompareResumesResponse
)

router = APIRouter(prefix="/analyses", tags=["Matching & Analysis"])

@router.post("/", response_model=AnalysisDetailOut, status_code=status.HTTP_201_CREATED)
async def create_analysis(
    analysis_in: AnalysisCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Execute resume-to-job matching analysis with transparent scoring and actionable suggestions."""
    analysis_service = AnalysisService(db)
    analysis = await analysis_service.run_analysis(current_user.id, analysis_in)
    return analysis

@router.get("/", response_model=Dict[str, Any])
async def list_analyses(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List authenticated user's previous analyses with pagination."""
    analysis_service = AnalysisService(db)
    items, total = await analysis_service.list_analyses(current_user.id, page, limit)
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit if limit else 1
    }

@router.get("/{analysis_id}", response_model=AnalysisDetailOut)
async def get_analysis(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve complete analysis report including radar metrics, explanations, and breakdowns."""
    analysis_service = AnalysisService(db)
    return await analysis_service.get_analysis(analysis_id, current_user.id)

@router.get("/{analysis_id}/skills", response_model=List[AnalysisSkillMatchOut])
async def get_analysis_skills(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve detailed skill comparison matrix (exact, semantic, missing, evidence levels)."""
    analysis_service = AnalysisService(db)
    analysis = await analysis_service.get_analysis(analysis_id, current_user.id)
    return analysis.skill_matches

@router.get("/{analysis_id}/suggestions", response_model=List[AnalysisSuggestionOut])
async def get_analysis_suggestions(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve prioritized resume improvement recommendations."""
    analysis_service = AnalysisService(db)
    analysis = await analysis_service.get_analysis(analysis_id, current_user.id)
    return analysis.suggestions

@router.post("/compare", response_model=CompareResumesResponse)
async def compare_resumes(
    comp_in: CompareResumesRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Compare 2 to 5 resumes side-by-side against a single Job Description."""
    comparison_service = ComparisonService(db)
    return await comparison_service.compare_resumes(current_user.id, comp_in)
