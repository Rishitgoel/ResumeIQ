import pytest
from app.nlp.taxonomy import get_canonical_skill
from app.nlp.skill_extractor import extract_skills
from app.nlp.section_detector import detect_sections
from app.nlp.entity_extractor import extract_experiences, extract_education
from app.nlp.jd_parser import parse_job_description

def test_canonical_skill_resolution():
    assert get_canonical_skill("react.js") == "React"
    assert get_canonical_skill("reactjs") == "React"
    assert get_canonical_skill("postgres") == "PostgreSQL"
    assert get_canonical_skill("k8s") == "Kubernetes"
    assert get_canonical_skill("golang") == "Go"
    assert get_canonical_skill("aws") == "Amazon Web Services"

def test_word_boundary_false_positives():
    # Text contains "Google", "Clean", "React" - should not falsely match "Go" or "C"
    sample_text = "Experienced with Google Cloud, writing clean maintainable code in React."
    found = extract_skills(sample_text)
    canonical_names = [s["canonical_name"] for s in found]
    assert "C" not in canonical_names
    assert "Go" not in canonical_names
    assert "React" in canonical_names

def test_evidence_level_classification():
    sections = [
        {
            "section_type": "EXPERIENCE",
            "raw_content": "Tech Lead at MegaCorp (2020 - 2023)\n• Built and deployed scalable REST APIs with FastAPI and PostgreSQL."
        },
        {
            "section_type": "SKILLS",
            "raw_content": "Technical Skills: Docker, Kubernetes, Redis, Python, FastAPI, PostgreSQL"
        }
    ]
    full_text = "\n\n".join([s["raw_content"] for s in sections])
    skills = extract_skills(full_text, sections)
    skill_map = {s["canonical_name"]: s for s in skills}

    # FastAPI was in EXPERIENCE with action verb "Built and deployed" -> STRONG
    assert skill_map["FastAPI"]["evidence_level"] == "STRONG"
    # PostgreSQL was also in the experience bullet -> STRONG
    assert skill_map["PostgreSQL"]["evidence_level"] == "STRONG"
    # Redis was only in SKILLS -> WEAK
    assert skill_map["Redis"]["evidence_level"] == "WEAK"

def test_experience_duration_extraction():
    exp_text = """
    Senior Software Engineer at Stripe (Jan 2021 - Jan 2024)
    • Architected payments infrastructure using Python and Kafka.
    """
    experiences = extract_experiences(exp_text)
    assert len(experiences) == 1
    assert experiences[0]["company_name"] == "Stripe"
    assert experiences[0]["years_duration"] >= 2.9

def test_education_extraction():
    edu_text = """
    Stanford University
    Bachelor of Science in Computer Science, GPA: 3.8/4.0
    2018 - 2022
    """
    edu_list = extract_education(edu_text)
    assert len(edu_list) >= 1
    assert "Stanford" in edu_list[0]["institution"]
    assert edu_list[0]["gpa"] == 3.8

def test_job_description_parsing():
    jd_text = """
    Backend Engineer - Payments
    Company: Stripe

    About the Role:
    We are seeking a seasoned engineer to build core payment services.

    Responsibilities:
    • Design high-availability payment routing systems.
    • Collaborate with cross-functional product teams.

    Requirements:
    • 3+ years of software engineering experience.
    • Strong proficiency in Python, FastAPI, and PostgreSQL.
    • Experience with Docker and Microservices.

    Preferred Qualifications:
    • Familiarity with Kubernetes, Redis, and Kafka.
    • Bachelor's degree in Computer Science or equivalent.
    """
    parsed = parse_job_description(jd_text)
    assert "Python" in parsed["required_skills"]
    assert "FastAPI" in parsed["required_skills"]
    assert "PostgreSQL" in parsed["required_skills"]
    assert "Kubernetes" in parsed["preferred_skills"]
    assert "Redis" in parsed["preferred_skills"]
    assert parsed["min_experience_years"] == 3.0
    assert "Bachelor" in (parsed["target_degree"] or "")
