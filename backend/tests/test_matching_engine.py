import pytest
from app.nlp.semantic_matcher import semantic_matcher
from app.nlp.scoring_engine import calculate_match_scores
from app.nlp.suggestion_generator import generate_suggestions

def test_semantic_skill_matching():
    required = ["Python", "FastAPI", "PostgreSQL", "Next.js"]
    preferred = ["Docker", "Redis"]

    resume_skills = [
        {"canonical_name": "Python", "evidence_level": "STRONG", "context_snippet": "Built APIs in Python"},
        {"canonical_name": "FastAPI", "evidence_level": "STRONG", "context_snippet": "High speed FastAPI endpoints"},
        {"canonical_name": "PostgreSQL", "evidence_level": "WEAK", "context_snippet": None},
        {"canonical_name": "Docker", "evidence_level": "MODERATE", "context_snippet": "Containerized with Docker"}
    ]
    resume_bullets = [
        "Built microservices with Python and FastAPI",
        "Managed relational schemas in PostgreSQL",
        "Deployed Docker containers to AWS ECS"
    ]

    matches, summary = semantic_matcher.match_skills(required, preferred, resume_skills, resume_bullets)

    match_dict = {m["skill_name"]: m for m in matches}

    # Python, FastAPI, PostgreSQL should be exact matches
    assert match_dict["Python"]["match_status"] == "EXACT_MATCH"
    assert match_dict["Python"]["resume_evidence_level"] == "STRONG"
    assert match_dict["PostgreSQL"]["match_status"] == "EXACT_MATCH"

    # Next.js is completely missing
    assert match_dict["Next.js"]["match_status"] == "MISSING"

    # Redis is preferred and missing
    assert match_dict["Redis"]["match_status"] == "MISSING"

    # Docker is preferred and matched
    assert match_dict["Docker"]["match_status"] == "EXACT_MATCH"

def test_scoring_engine_calculation():
    skill_matches = [
        {"skill_name": "Python", "requirement_type": "REQUIRED_SKILL", "match_status": "EXACT_MATCH", "resume_evidence_level": "STRONG", "similarity_score": 1.0},
        {"skill_name": "FastAPI", "requirement_type": "REQUIRED_SKILL", "match_status": "EXACT_MATCH", "resume_evidence_level": "STRONG", "similarity_score": 1.0},
        {"skill_name": "Next.js", "requirement_type": "REQUIRED_SKILL", "match_status": "MISSING", "resume_evidence_level": "NONE", "similarity_score": 0.0},
        {"skill_name": "Docker", "requirement_type": "PREFERRED_SKILL", "match_status": "EXACT_MATCH", "resume_evidence_level": "MODERATE", "similarity_score": 1.0}
    ]
    experiences = [{"years_duration": 3.5, "company_name": "Tech Corp"}]
    projects = [{"name": "API Gateway", "technologies": ["FastAPI", "Python"]}]
    education = [{"degree": "Bachelor of Science in Computer Science"}]
    certifications = []

    res = calculate_match_scores(
        skill_matches=skill_matches,
        resume_experiences=experiences,
        resume_projects=projects,
        resume_education=education,
        resume_certifications=certifications,
        jd_min_exp_years=3.0,
        jd_target_degree="Bachelor's"
    )

    scores = res["scores"]
    assert 0 <= scores["overall"] <= 100
    assert scores["required_skills"] == 66.7  # 2 of 3 matched with 1.0 points
    assert scores["preferred_skills"] == 100.0  # 1 of 1 matched
    assert scores["experience"] == 100.0  # 3.5 yrs >= 3.0 yrs
    assert scores["education"] == 100.0
    assert "explanation_summary" in res
    assert "2 of 3 required skills" in res["explanation_summary"]

def test_suggestion_generator_priorities():
    skill_matches = [
        {"skill_name": "Python", "requirement_type": "REQUIRED_SKILL", "match_status": "EXACT_MATCH", "resume_evidence_level": "STRONG"},
        {"skill_name": "SQL", "requirement_type": "REQUIRED_SKILL", "match_status": "EXACT_MATCH", "resume_evidence_level": "WEAK"},
        {"skill_name": "Next.js", "requirement_type": "REQUIRED_SKILL", "match_status": "MISSING", "resume_evidence_level": "NONE"},
        {"skill_name": "Redis", "requirement_type": "PREFERRED_SKILL", "match_status": "MISSING", "resume_evidence_level": "NONE"},
    ]
    suggestions = generate_suggestions(
        skill_matches=skill_matches,
        total_exp_years=1.5,
        jd_min_exp_years=4.0,
        resume_projects=[],
        resume_experiences=[]
    )

    # Next.js should be HIGH priority missing required skill
    high_suggestions = [s for s in suggestions if s["priority"] == "HIGH"]
    assert any("Next.js" in s["title"] for s in high_suggestions)

    # SQL should be MEDIUM priority weak evidence
    med_suggestions = [s for s in suggestions if s["priority"] == "MEDIUM"]
    assert any("SQL" in s["title"] for s in med_suggestions)
    # Experience gap should also be flagged
    assert any("Experience Gap" in s["title"] for s in med_suggestions)
