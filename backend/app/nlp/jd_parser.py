import re
from typing import Dict, List, Any
from app.nlp.text_cleaner import clean_text, extract_bullets
from app.nlp.skill_extractor import extract_skills

REQUIRED_PATTERNS = [
    r"^requirements",
    r"^required\s+qualifications",
    r"^required\s+skills",
    r"^minimum\s+qualifications",
    r"^what\s+you\s+need",
    r"^must\s+haves?",
    r"^who\s+you\s+are",
    r"^qualifications",
    r"^basic\s+qualifications"
]

PREFERRED_PATTERNS = [
    r"^preferred\s+qualifications",
    r"^preferred\s+skills",
    r"^nice\s+to\s+haves?",
    r"^bonus\s+points?",
    r"^desired\s+skills",
    r"^pluses?",
    r"^good\s+to\s+have"
]

RESPONSIBILITY_PATTERNS = [
    r"^responsibilities",
    r"^what\s+you(?:'ll|\s+will)\s+do",
    r"^the\s+role",
    r"^duties",
    r"^key\s+responsibilities",
    r"^core\s+responsibilities"
]

def parse_job_description(raw_text: str) -> Dict[str, Any]:
    """Parse raw Job Description text into structured requirements, skills, and parameters."""
    cleaned = clean_text(raw_text)
    lines = cleaned.split("\n")

    current_section = "GENERAL"
    section_texts: Dict[str, List[str]] = {
        "GENERAL": [],
        "RESPONSIBILITIES": [],
        "REQUIRED": [],
        "PREFERRED": []
    }

    def match_heading(line: str) -> str | None:
        stripped = line.strip().lower()
        if not stripped or len(stripped) > 40:
            return None
        cleaned_heading = re.sub(r"[:\-_#*]", "", stripped).strip()

        for p in REQUIRED_PATTERNS:
            if re.match(p + r"$", cleaned_heading):
                return "REQUIRED"
        for p in PREFERRED_PATTERNS:
            if re.match(p + r"$", cleaned_heading):
                return "PREFERRED"
        for p in RESPONSIBILITY_PATTERNS:
            if re.match(p + r"$", cleaned_heading):
                return "RESPONSIBILITIES"
        return None

    for line in lines:
        heading = match_heading(line)
        if heading:
            current_section = heading
        else:
            section_texts[current_section].append(line)

    req_text = "\n".join(section_texts["REQUIRED"])
    pref_text = "\n".join(section_texts["PREFERRED"])
    resp_text = "\n".join(section_texts["RESPONSIBILITIES"])
    general_text = "\n".join(section_texts["GENERAL"])

    # If neither REQUIRED nor PREFERRED headers were found, treat all extracted skills as required
    if not req_text.strip() and not pref_text.strip():
        req_text = cleaned

    req_skills_objs = extract_skills(req_text)
    pref_skills_objs = extract_skills(pref_text)

    # If no separate preferred section, check for sentences with "preferred", "bonus", "plus"
    if not pref_skills_objs and req_text:
        pref_lines = []
        for line in req_text.split("\n"):
            if re.search(r"\b(preferred|plus|bonus|nice to have|optional)\b", line, re.IGNORECASE):
                pref_lines.append(line)
        if pref_lines:
            pref_skills_objs = extract_skills("\n".join(pref_lines))

    # Deduplicate canonical names between required and preferred
    required_skills = [s["canonical_name"] for s in req_skills_objs]
    preferred_skills = [
        s["canonical_name"] for s in pref_skills_objs
        if s["canonical_name"] not in required_skills
    ]

    # Extract minimum experience years
    min_exp_years = 0.0
    exp_matches = re.findall(
        r"(\d+(?:\.\d+)?)\s*(?:\+|-\d+)?\s*(?:years?|yrs?)(?:[^\.\n]*?)(?:experience|exp)\b",
        cleaned,
        re.IGNORECASE
    )
    if exp_matches:
        try:
            min_exp_years = float(exp_matches[0])
        except ValueError:
            min_exp_years = 0.0

    # Extract target degree
    target_degree = None
    if re.search(r"\b(?:ph\.?d|doctorate)\b", cleaned, re.IGNORECASE):
        target_degree = "Ph.D."
    elif re.search(r"\b(?:master'?s?|m\.?s\.?|m\.?tech)\b", cleaned, re.IGNORECASE):
        target_degree = "Master's Degree"
    elif re.search(r"\b(?:bachelor'?s?|b\.?s\.?|b\.?tech|b\.?e\.?|undergraduate)\b", cleaned, re.IGNORECASE):
        target_degree = "Bachelor's Degree"

    # Responsibilities bullets
    responsibilities = extract_bullets(resp_text) if resp_text else extract_bullets(general_text)[:6]

    # Structure list of requirements for DB insertion
    requirements_list = []
    for skill in required_skills:
        requirements_list.append({
            "requirement_type": "REQUIRED_SKILL",
            "canonical_skill": skill,
            "description": f"Proficiency in {skill}",
            "weight": 1.0,
            "category": req_skills_objs[0]["category"] if req_skills_objs else "OTHER"
        })

    for skill in preferred_skills:
        requirements_list.append({
            "requirement_type": "PREFERRED_SKILL",
            "canonical_skill": skill,
            "description": f"Familiarity or bonus experience with {skill}",
            "weight": 0.5,
            "category": "OTHER"
        })

    if min_exp_years > 0:
        requirements_list.append({
            "requirement_type": "EXPERIENCE",
            "canonical_skill": None,
            "description": f"Minimum {min_exp_years} years of relevant professional experience",
            "weight": 1.0
        })

    if target_degree:
        requirements_list.append({
            "requirement_type": "EDUCATION",
            "canonical_skill": None,
            "description": f"Target degree: {target_degree}",
            "weight": 1.0
        })

    return {
        "required_skills": required_skills,
        "preferred_skills": preferred_skills,
        "min_experience_years": min_exp_years,
        "target_degree": target_degree,
        "responsibilities": responsibilities,
        "requirements": requirements_list
    }
