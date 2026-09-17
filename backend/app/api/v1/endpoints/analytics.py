from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.repositories.analysis_repo import AnalysisRepository
from app.nlp.taxonomy import SKILL_TAXONOMY
from app.schemas.analytics import DashboardStatsOut

router = APIRouter(prefix="/analytics", tags=["Analytics & Insights"])

@router.get("/dashboard", response_model=DashboardStatsOut)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Fetch user aggregate metrics, match distributions, and top missing skill gaps."""
    analysis_repo = AnalysisRepository(db)
    return await analysis_repo.get_dashboard_stats(current_user.id)

@router.get("/skills/taxonomy")
async def get_skill_taxonomy():
    """Retrieve canonical skill taxonomy with categories and aliases."""
    categorized: Dict[str, List[Dict[str, Any]]] = {}
    for skill, data in SKILL_TAXONOMY.items():
        cat = data.get("category", "OTHER")
        if cat not in categorized:
            categorized[cat] = []
        categorized[cat].append({
            "name": skill,
            "canonical_name": skill,
            "category": cat,
            "aliases": data.get("aliases", [])
        })
    return categorized
