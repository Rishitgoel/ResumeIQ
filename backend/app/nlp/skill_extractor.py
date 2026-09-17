import re
from typing import Dict, List, Any, Optional
from app.nlp.taxonomy import LOOKUP_MAP, SKILL_TAXONOMY, get_skill_category

ACTION_VERBS = {
    "developed", "built", "implemented", "designed", "engineered", "created",
    "architected", "deployed", "scaled", "optimized", "managed", "led",
    "integrated", "refactored", "migrated", "automated", "maintained"
}

# Compile patterns sorted by descending length to match longest multi-word phrases first
SORTED_TERMS = sorted(LOOKUP_MAP.keys(), key=lambda t: len(t), reverse=True)

# Special patterns for tricky short abbreviations
SPECIAL_PATTERNS = {
    "c": re.compile(r"(?<![a-zA-Z0-9_#+])C(?![a-zA-Z0-9_#+])"),
    "r": re.compile(r"(?<![a-zA-Z0-9_#+])R(?![a-zA-Z0-9_#+])"),
    "go": re.compile(r"(?<![a-zA-Z0-9_])(?:Go|golang)(?![a-zA-Z0-9_])", re.IGNORECASE),
}

def extract_skills(text: str, sections: Optional[List[Dict[str, str]]] = None) -> List[Dict[str, Any]]:
    """
    Extract skills from text and sections with canonical normalization and evidence level evaluation.
    Evidence levels:
      - STRONG: Present in work experience bullet points with action verbs
      - MODERATE: Present in projects or work experience without explicit action verbs
      - WEAK: Present only in a comma-separated skills list or summary
    """
    detected: Dict[str, Dict[str, Any]] = {}

    # Map section types to their texts if provided
    section_map = {}
    if sections:
        for s in sections:
            section_map[s["section_type"]] = s["raw_content"]
    else:
        section_map["OTHER"] = text

    for term in SORTED_TERMS:
        canonical = LOOKUP_MAP[term]
        
        # Determine appropriate regex pattern
        if term in SPECIAL_PATTERNS:
            pattern = SPECIAL_PATTERNS[term]
        else:
            pattern = re.compile(r"(?<![a-zA-Z0-9_])" + re.escape(term) + r"(?![a-zA-Z0-9_])", re.IGNORECASE)

        # Check in each section for evidence assignment
        for sec_type, content in section_map.items():
            matches = list(pattern.finditer(content))
            if not matches:
                continue

            match = matches[0]
            start = max(0, match.start() - 60)
            end = min(len(content), match.end() + 60)
            snippet = content[start:end].replace("\n", " ").strip()

            evidence = "WEAK"
            confidence = 0.90

            if sec_type == "EXPERIENCE":
                # Check for action verb presence in surrounding snippet
                words = re.findall(r"\b[a-zA-Z]+\b", snippet.lower())
                has_action_verb = any(w in ACTION_VERBS for w in words)
                if has_action_verb:
                    evidence = "STRONG"
                    confidence = 1.0
                else:
                    evidence = "MODERATE"
                    confidence = 0.95
            elif sec_type == "PROJECTS":
                evidence = "MODERATE"
                confidence = 0.95
            elif sec_type == "SKILLS":
                evidence = "WEAK"
                confidence = 0.85

            # If already detected, upgrade evidence if current section has stronger proof
            if canonical in detected:
                existing_ev = detected[canonical]["evidence_level"]
                ev_rank = {"WEAK": 1, "MODERATE": 2, "STRONG": 3}
                if ev_rank.get(evidence, 1) > ev_rank.get(existing_ev, 1):
                    detected[canonical]["evidence_level"] = evidence
                    detected[canonical]["context_snippet"] = snippet
                    detected[canonical]["confidence_score"] = confidence
            else:
                detected[canonical] = {
                    "name": canonical,
                    "canonical_name": canonical,
                    "category": get_skill_category(canonical),
                    "aliases": SKILL_TAXONOMY.get(canonical, {}).get("aliases", []),
                    "detected_as": match.group(0),
                    "evidence_level": evidence,
                    "context_snippet": snippet,
                    "confidence_score": confidence
                }

    return list(detected.values())
