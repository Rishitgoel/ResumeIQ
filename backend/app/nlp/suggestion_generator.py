from typing import List, Dict, Any, Optional

def generate_suggestions(
    skill_matches: List[Dict[str, Any]],
    total_exp_years: float,
    jd_min_exp_years: float,
    resume_projects: List[Dict[str, Any]],
    resume_experiences: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Generate actionable, prioritized recommendations based on matching results.
    Distinguishes completely missing skills, weakly evidenced skills, and experience deltas.
    """
    suggestions: List[Dict[str, Any]] = []

    # 1. Missing Required Skills (HIGH Priority)
    missing_req = [m for m in skill_matches if m["requirement_type"] == "REQUIRED_SKILL" and m["match_status"] == "MISSING"]
    for m in missing_req[:3]:  # Top 3 missing required
        skill = m["skill_name"]
        suggestions.append({
            "suggestion_type": "MISSING_REQUIRED_SKILL",
            "priority": "HIGH",
            "title": f"Address Missing Required Skill: {skill}",
            "description": (
                f"'{skill}' is explicitly required by the job description but was not detected anywhere in your resume. "
                f"If you have hands-on experience or coursework in {skill}, add specific examples or bullet points describing how you used it."
            ),
            "action_category": "SKILL_GAP"
        })

    # 2. Weakly Evidenced Skills (MEDIUM Priority)
    weak_skills = [
        m for m in skill_matches
        if m["match_status"] == "EXACT_MATCH" and m["resume_evidence_level"] == "WEAK"
    ]
    for m in weak_skills[:3]:
        skill = m["skill_name"]
        suggestions.append({
            "suggestion_type": "WEAK_EVIDENCE",
            "priority": "MEDIUM",
            "title": f"Strengthen Evidence for {skill}",
            "description": (
                f"'{skill}' was detected in your skills list, but was not found within your work experience or project bullet points. "
                f"Recruiters look for contextual application: incorporate a bullet point showing where you applied {skill} to achieve measurable impact."
            ),
            "action_category": "RESUME_IMPROVEMENT"
        })

    # 3. Experience Delta (MEDIUM Priority if gap exists)
    if jd_min_exp_years > 0 and total_exp_years < jd_min_exp_years:
        gap = round(jd_min_exp_years - total_exp_years, 1)
        suggestions.append({
            "suggestion_type": "EXPERIENCE_GAP",
            "priority": "MEDIUM",
            "title": f"Mitigate Experience Gap ({total_exp_years} yrs vs {jd_min_exp_years} yrs requested)",
            "description": (
                f"The job posting requests {jd_min_exp_years} years of professional experience, whereas your profile outlines {total_exp_years} years. "
                f"To bridge this {gap}-year difference, highlight leadership responsibilities, freelance projects, or complex technical contributions."
            ),
            "action_category": "EXPERIENCE"
        })

    # 4. Missing Preferred Skills (LOW Priority)
    missing_pref = [m for m in skill_matches if m["requirement_type"] == "PREFERRED_SKILL" and m["match_status"] == "MISSING"]
    if missing_pref:
        pref_names = [m["skill_name"] for m in missing_pref[:3]]
        suggestions.append({
            "suggestion_type": "MISSING_PREFERRED_SKILL",
            "priority": "LOW",
            "title": f"Incorporate Bonus Qualifications: {', '.join(pref_names)}",
            "description": (
                f"The role lists {', '.join(pref_names)} as preferred or bonus qualifications. "
                f"Incorporating even secondary exposure or personal projects using these tools can differentiate you from other candidates."
            ),
            "action_category": "BONUS_SKILLS"
        })

    # 5. Bullet Point Quantification (LOW Priority)
    all_bullets = []
    for exp in resume_experiences:
        all_bullets.extend(exp.get("bullet_points", []))
    for proj in resume_projects:
        all_bullets.extend(proj.get("bullet_points", []))

    has_metrics = any(any(char.isdigit() or char == "%" for char in b) for b in all_bullets)
    if not has_metrics and all_bullets:
        suggestions.append({
            "suggestion_type": "FORMATTING",
            "priority": "LOW",
            "title": "Add Measurable Business Metrics",
            "description": (
                "Your experience bullet points describe responsibilities well, but lack quantified business metrics. "
                "Include concrete numbers such as 'increased performance by 40%', 'reduced latency by 120ms', or 'supported 50k+ active users'."
            ),
            "action_category": "IMPACT_QUANTIFICATION"
        })

    return suggestions
