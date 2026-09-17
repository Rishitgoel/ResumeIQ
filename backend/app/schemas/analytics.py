from typing import List, Dict
from pydantic import BaseModel

class MissingSkillStat(BaseModel):
    skill_name: str
    frequency: int
    category: str

class ScoreDistributionBucket(BaseModel):
    range_label: str  # e.g., "0-20%", "21-40%", "41-60%", "61-80%", "81-100%"
    count: int

class DashboardStatsOut(BaseModel):
    total_resumes: int
    total_jobs: int
    total_analyses: int
    average_match_score: float
    highest_match_score: float
    lowest_match_score: float
    top_missing_skills: List[MissingSkillStat]
    score_distribution: List[ScoreDistributionBucket]
    recent_analyses: List[Dict]
