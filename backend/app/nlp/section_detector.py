import re
from typing import Dict, List, Tuple

SECTION_PATTERNS = {
    "SUMMARY": [
        r"^professional\s+summary",
        r"^executive\s+summary",
        r"^career\s+summary",
        r"^summary\s+of\s+qualifications",
        r"^profile",
        r"^about\s+me",
        r"^summary",
        r"^objective",
        r"^career\s+objective",
    ],
    "EXPERIENCE": [
        r"^work\s+experience",
        r"^professional\s+experience",
        r"^employment\s+history",
        r"^work\s+history",
        r"^relevant\s+experience",
        r"^experience",
        r"^internships",
    ],
    "PROJECTS": [
        r"^technical\s+projects",
        r"^academic\s+projects",
        r"^personal\s+projects",
        r"^key\s+projects",
        r"^notable\s+projects",
        r"^projects",
        r"^portfolio",
    ],
    "SKILLS": [
        r"^technical\s+skills",
        r"^core\s+competencies",
        r"^skills\s*(?:&|and)\s*technologies",
        r"^skills\s*(?:&|and)\s*tools",
        r"^skills\s*(?:&|and)\s*frameworks",
        r"^skills\s*(?:&|and)\s*abilities",
        r"^technologies\s*(?:&|and)\s*tools",
        r"^programming\s+languages",
        r"^skills",
        r"^competencies",
    ],
    "EDUCATION": [
        r"^academic\s+background",
        r"^educational\s+background",
        r"^education\s*(?:&|and)\s*credentials",
        r"^education",
        r"^academics",
        r"^degrees",
    ],
    "CERTIFICATIONS": [
        r"^licenses\s*(?:&|and)\s*certifications",
        r"^certifications\s*(?:&|and)\s*licenses",
        r"^professional\s+certifications",
        r"^certifications",
        r"^certificates",
        r"^credentials",
    ],
    "ACHIEVEMENTS": [
        r"^honors\s*(?:&|and)\s*awards",
        r"^awards\s*(?:&|and)\s*achievements",
        r"^key\s+achievements",
        r"^achievements",
        r"^awards",
        r"^publications",
    ]
}

def detect_sections(text: str) -> List[Dict[str, str]]:
    """
    Split resume text into semantic sections using regex pattern matching on line headers.
    Returns a list of dicts: [{"section_type": "EXPERIENCE", "raw_content": "..."}, ...]
    """
    lines = text.split("\n")
    sections: List[Dict[str, str]] = []

    current_section_type = "SUMMARY"
    current_content: List[str] = []

    def classify_line_header(line: str) -> str | None:
        stripped = line.strip()
        # Header candidate criteria: short line, usually <= 45 chars
        if not stripped or len(stripped) > 45:
            return None

        # Clean punctuation from header candidate
        candidate = re.sub(r"[:\-_|#*]", "", stripped).strip().lower()

        for sec_type, patterns in SECTION_PATTERNS.items():
            for pat in patterns:
                if re.match(pat + r"$", candidate):
                    return sec_type
        return None

    for line in lines:
        detected_type = classify_line_header(line)
        if detected_type:
            # Save accumulated lines from prior section
            if current_content:
                raw_text = "\n".join(current_content).strip()
                if raw_text:
                    sections.append({
                        "section_type": current_section_type,
                        "raw_content": raw_text
                    })
            current_section_type = detected_type
            current_content = []
        else:
            current_content.append(line)

    if current_content:
        raw_text = "\n".join(current_content).strip()
        if raw_text:
            sections.append({
                "section_type": current_section_type,
                "raw_content": raw_text
            })

    # If no recognized headers matched, return single OTHER section
    if not sections:
        sections.append({
            "section_type": "OTHER",
            "raw_content": text.strip()
        })

    return sections
