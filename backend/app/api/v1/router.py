from fastapi import APIRouter
from app.api.v1.endpoints import auth, resumes, jobs, analyses, analytics

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(resumes.router)
api_router.include_router(jobs.router)
api_router.include_router(analyses.router)
api_router.include_router(analytics.router)
