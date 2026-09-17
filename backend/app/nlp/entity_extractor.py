import re
from typing import Dict, List, Any, Optional
from datetime import datetime
from app.nlp.text_cleaner import extract_bullets
from app.nlp.skill_extractor import extract_skills

DATE_RANGE_REGEX = re.compile(
    r"((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{1,2}/\d{4}|\d{4})\s*(?:-|–|—|to)\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{1,2}/\d{4}|\d{4}|present|current)",
    re.IGNORECASE
)

MONTH_MAP = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12
}

def parse_date_to_year_fraction(date_str: str) -> float:
    date_str = date_str.strip().lower()
    if date_str in {"present", "current"}:
        now = datetime.now()
        return now.year + (now.month / 12.0)

    # Check "Month YYYY"
    m_match = re.search(r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{4})", date_str)
    if m_match:
        m = MONTH_MAP.get(m_match.group(1)[:3], 1)
        y = int(m_match.group(2))
        return y + (m / 12.0)

    # Check "MM/YYYY"
    slash_match = re.search(r"(\d{1,2})/(\d{4})", date_str)
    if slash_match:
        m = int(slash_match.group(1))
        y = int(slash_match.group(2))
        return y + (m / 12.0)

    # Check "YYYY"
    year_match = re.search(r"\b(19\d\d|20\d\d)\b", date_str)
    if year_match:
        return float(year_match.group(1))

    return float(datetime.now().year)

def calculate_duration_years(start_str: str, end_str: str) -> float:
    try:
        start = parse_date_to_year_fraction(start_str)
        end = parse_date_to_year_fraction(end_str)
        diff = max(0.1, round(end - start, 1))
        return min(diff, 40.0)
    except Exception:
        return 1.0

def extract_experiences(section_text: str) -> List[Dict[str, Any]]:
    """Parse work experiences from EXPERIENCE section."""
    if not section_text or not section_text.strip():
        return []

    experiences = []
    # Split blocks by double newline or date patterns
    blocks = re.split(r"\n\s*\n", section_text)

    for block in blocks:
        block = block.strip()
        if not block or len(block) < 20:
            continue

        lines = [line.strip() for line in block.split("\n") if line.strip()]
        if not lines:
            continue

        date_match = DATE_RANGE_REGEX.search(block)
        start_date = None
        end_date = None
        duration = 1.0
        is_current = False

        if date_match:
            start_date = date_match.group(1).strip()
            end_date = date_match.group(2).strip()
            if "present" in end_date.lower() or "current" in end_date.lower():
                is_current = True
            duration = calculate_duration_years(start_date, end_date)

        # First line usually contains Job Title and/or Company
        header_line = lines[0]
        company = "Company"
        title = "Software Engineer"

        # Check for delimiters like "|", "at", "-", "@"
        if " at " in header_line:
            parts = header_line.split(" at ")
            title = parts[0].strip()
            company = parts[1].split("|")[0].strip()
        elif " | " in header_line:
            parts = header_line.split(" | ")
            title = parts[0].strip()
            company = parts[1].strip()
        elif " - " in header_line and not date_match:
            parts = header_line.split(" - ")
            title = parts[0].strip()
            company = parts[1].strip()
        else:
            title = header_line
            if len(lines) > 1 and not lines[1].startswith(("•", "-", "*")):
                company = lines[1]

        # Strip any parenthetical dates or metadata like (Jan 2021 - Jan 2024)
        company = re.sub(r"\(.*?\)", "", company).strip()
        title = re.sub(r"\(.*?\)", "", title).strip()

        # Extract bullets and technologies
        bullets = extract_bullets(block)
        found_skills = extract_skills(block)
        technologies = [s["canonical_name"] for s in found_skills]

        experiences.append({
            "company_name": company[:250],
            "job_title": title[:250],
            "location": None,
            "start_date": start_date,
            "end_date": end_date,
            "is_current": is_current,
            "description": block[:1000],
            "bullet_points": bullets,
            "technologies": technologies,
            "years_duration": duration
        })

    return experiences

def extract_projects(section_text: str) -> List[Dict[str, Any]]:
    """Parse projects from PROJECTS section."""
    if not section_text or not section_text.strip():
        return []

    projects = []
    blocks = re.split(r"\n\s*\n", section_text)

    for block in blocks:
        block = block.strip()
        if not block or len(block) < 15:
            continue

        lines = [line.strip() for line in block.split("\n") if line.strip()]
        if not lines:
            continue

        name_line = lines[0]
        # Look for URLs
        url_match = re.search(r"(https?://[^\s)]+|github\.com/[^\s)]+)", block)
        url = url_match.group(1) if url_match else None

        # Clean project name from delimiters
        project_name = re.sub(r"[|–\-:].*$", "", name_line).strip()
        bullets = extract_bullets(block)
        found_skills = extract_skills(block)
        technologies = [s["canonical_name"] for s in found_skills]

        projects.append({
            "name": project_name[:250] if project_name else "Featured Project",
            "description": block[:1000],
            "url": url,
            "bullet_points": bullets,
            "technologies": technologies
        })

    return projects

def extract_education(section_text: str) -> List[Dict[str, Any]]:
    """Parse education details from EDUCATION section."""
    if not section_text or not section_text.strip():
        return []

    education_list = []
    blocks = re.split(r"\n\s*\n", section_text)

    degree_patterns = [
        r"(?:bachelor|b\.?s\.?|b\.?tech|b\.?e\.?|undergraduate)\s*(?:of|in)?\s*([a-zA-Z\s]+)?",
        r"(?:master|m\.?s\.?|m\.?tech|m\.?e\.?|graduate)\s*(?:of|in)?\s*([a-zA-Z\s]+)?",
        r"(?:ph\.?d\.?|doctorate)\s*(?:of|in)?\s*([a-zA-Z\s]+)?",
        r"(?:associate)\s*(?:of|in)?\s*([a-zA-Z\s]+)?",
    ]

    for block in blocks:
        block = block.strip()
        if not block or len(block) < 10:
            continue

        institution = "University / College"
        lines = [line.strip() for line in block.split("\n") if line.strip()]
        if lines:
            institution = lines[0]

        degree = None
        field = None
        for pat in degree_patterns:
            m = re.search(pat, block, re.IGNORECASE)
            if m:
                degree = m.group(0).strip()
                if m.lastindex and m.group(1):
                    field = m.group(1).strip()
                break

        # Check for GPA
        gpa = None
        max_gpa = 4.0
        gpa_match = re.search(r"(?:gpa|cgpa)[:\s]*([0-9]\.[0-9]+)(?:\s*/\s*([0-9](?:\.0)?))?", block, re.IGNORECASE)
        if gpa_match:
            try:
                gpa = float(gpa_match.group(1))
                if gpa_match.group(2):
                    max_gpa = float(gpa_match.group(2))
            except ValueError:
                pass

        # Check for years
        year_matches = re.findall(r"\b(19\d\d|20\d\d)\b", block)
        start_date = year_matches[0] if len(year_matches) > 1 else None
        end_date = year_matches[-1] if year_matches else None

        education_list.append({
            "institution": institution[:250],
            "degree": degree[:250] if degree else "Bachelor's Degree",
            "field_of_study": field[:250] if field else "Computer Science",
            "start_date": start_date,
            "end_date": end_date,
            "gpa": gpa,
            "max_gpa": max_gpa
        })

    return education_list

def extract_certifications(section_text: str) -> List[Dict[str, Any]]:
    """Parse certifications from CERTIFICATIONS section."""
    if not section_text or not section_text.strip():
        return []

    certs = []
    lines = [line.strip() for line in section_text.split("\n") if line.strip()]

    known_issuers = ["AWS", "Amazon", "Google", "Microsoft", "Azure", "Oracle", "Cisco", "Coursera", "Udacity", "IBM"]

    for line in lines:
        line_clean = re.sub(r"^[•\-*]\s*", "", line).strip()
        if len(line_clean) < 5:
            continue

        issuer = None
        for ki in known_issuers:
            if ki.lower() in line_clean.lower():
                issuer = ki
                break

        year_match = re.search(r"\b(20\d\d)\b", line_clean)
        issue_date = year_match.group(1) if year_match else None

        url_match = re.search(r"(https?://[^\s)]+)", line_clean)
        cred_url = url_match.group(1) if url_match else None

        certs.append({
            "name": line_clean[:250],
            "issuer": issuer or "Accredited Body",
            "issue_date": issue_date,
            "credential_url": cred_url
        })

    return certs
