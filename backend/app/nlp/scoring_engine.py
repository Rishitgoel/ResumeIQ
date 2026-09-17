from typing import Dict, List, Any, Optional
from app.core.config import settings

def calculate_match_scores(
    skill_matches: List[Dict[str, Any]],
    resume_experiences: List[Dict[str, Any]],
    resume_projects: List[Dict[str, Any]],
    resume_education: List[Dict[str, Any]],
    resume_certifications: List[Dict[str, Any]],
    jd_min_exp_years: float,
    jd_target_degree: Optional[str],
    custom_weights: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    Calculate transparent, explainable multi-dimensional resume-to-JD match scores.
    """
    weights = custom_weights or settings.scoring_weights

    # Normalize weights so sum is 1.0
    weight_sum = sum(weights.values()) or 1.0
    norm_weights = {k: v / weight_sum for k, v in weights.items()}

    # 1. Required Skills Score
    req_matches = [m for m in skill_matches if m["requirement_type"] == "REQUIRED_SKILL"]
    if req_matches:
        req_points = 0.0
        for m in req_matches:
            status = m["match_status"]
            ev = m["resume_evidence_level"]
            if status == "EXACT_MATCH":
                if ev == "STRONG":
                    req_points += 1.0
                elif ev == "MODERATE":
                    req_points += 0.95
                else:  # WEAK
                    req_points += 0.85
            elif status == "SEMANTIC_MATCH":
                req_points += min(0.80, m.get("similarity_score", 0.7) * 0.9)
            else:
                req_points += 0.0
        req_score = round((req_points / len(req_matches)) * 100, 1)
    else:
        req_score = 100.0

    # 2. Preferred Skills Score
    pref_matches = [m for m in skill_matches if m["requirement_type"] == "PREFERRED_SKILL"]
    if pref_matches:
        pref_points = 0.0
        for m in pref_matches:
            status = m["match_status"]
            ev = m["resume_evidence_level"]
            if status == "EXACT_MATCH":
                pref_points += 1.0 if ev in ("STRONG", "MODERATE") else 0.85
            elif status == "SEMANTIC_MATCH":
                pref_points += 0.75
        pref_score = round((pref_points / len(pref_matches)) * 100, 1)
    else:
        # If no preferred skills were specified, give candidate full credit
        pref_score = 100.0

    # 3. Experience Score
    total_exp_years = sum(exp.get("years_duration", 0.0) for exp in resume_experiences)
    if jd_min_exp_years > 0:
        duration_ratio = min(1.0, total_exp_years / jd_min_exp_years)
        exp_score = round(duration_ratio * 100, 1)
    else:
        exp_score = 90.0 if total_exp_years > 0 else 75.0

    # Bonus if experienced in company environments
    if len(resume_experiences) >= 2 and exp_score < 100:
        exp_score = min(100.0, exp_score + 5.0)

    # 4. Project Score
    if resume_projects:
        # Check if projects utilize required skills
        matched_skills_in_projects = sum(
            1 for p in resume_projects if len(p.get("technologies", [])) > 0
        )
        proj_score = min(100.0, 70.0 + (matched_skills_in_projects * 10.0))
    else:
        proj_score = 60.0 if len(resume_experiences) > 0 else 40.0

    # 5. Education Score
    if resume_education:
        edu_score = 90.0
        # Check if candidate has degree matching or exceeding JD degree
        highest_degree = " ".join([e.get("degree", "").lower() for e in resume_education])
        if jd_target_degree:
            jd_deg = jd_target_degree.lower()
            if "ph" in jd_deg and "ph" in highest_degree:
                edu_score = 100.0
            elif "master" in jd_deg and ("master" in highest_degree or "ph" in highest_degree):
                edu_score = 100.0
            elif "bachelor" in jd_deg and any(d in highest_degree for d in ["bachelor", "b.", "master", "ph"]):
                edu_score = 100.0
            else:
                edu_score = 80.0
        else:
            edu_score = 100.0
    else:
        edu_score = 70.0

    # 6. Other Score (Certifications & Extra Credentials)
    other_score = min(100.0, 75.0 + (len(resume_certifications) * 12.5))

    # Overall Composite Score
    overall = (
        norm_weights["required_skills"] * req_score +
        norm_weights["preferred_skills"] * pref_score +
        norm_weights["experience"] * exp_score +
        norm_weights["projects"] * proj_score +
        norm_weights["education"] * edu_score +
        norm_weights["other"] * other_score
    )
    overall_score = round(overall, 1)

    scores = {
        "overall": overall_score,
        "required_skills": req_score,
        "preferred_skills": pref_score,
        "experience": exp_score,
        "projects": proj_score,
        "education": edu_score,
        "other": other_score
    }

    # Generate Human-Readable Explanations
    explanations = []
    num_req_matched = sum(1 for m in req_matches if m["match_status"] in ("EXACT_MATCH", "SEMANTIC_MATCH"))
    num_req_total = len(req_matches)
    if num_req_total > 0:
        explanations.append(f"Resume satisfies {num_req_matched} of {num_req_total} required skills ({req_score}% required skill score).")

    strong_ev_skills = [m["skill_name"] for m in skill_matches if m["resume_evidence_level"] == "STRONG"]
    if strong_ev_skills:
        explanations.append(f"Strong evidence in work experience identified for: {', '.join(strong_ev_skills[:4])}.")

    weak_ev_skills = [m["skill_name"] for m in skill_matches if m["resume_evidence_level"] == "WEAK" and m["match_status"] == "EXACT_MATCH"]
    if weak_ev_skills:
        explanations.append(f"Skills present only in a standalone skills listing without operational context: {', '.join(weak_ev_skills[:3])}.")

    missing_req = [m["skill_name"] for m in req_matches if m["match_status"] == "MISSING"]
    if missing_req:
        explanations.append(f"Critical required skills not detected in resume: {', '.join(missing_req[:4])}.")

    if jd_min_exp_years > 0:
        explanations.append(
            f"Candidate displays approximately {round(total_exp_years, 1)} years of experience versus {jd_min_exp_years} years requested."
        )

    explanation_summary = "\n\n".join(explanations)

    detailed_breakdown = {
        "scores": scores,
        "weights": norm_weights,
        "total_experience_years": round(total_exp_years, 1),
        "required_skills_matched": num_req_matched,
        "required_skills_total": num_req_total,
        "strong_evidence_count": len(strong_ev_skills),
        "weak_evidence_count": len(weak_ev_skills),
        "missing_required_count": len(missing_req)
    }

    return {
        "scores": scores,
        "weights": norm_weights,
        "explanation_summary": explanation_summary,
        "detailed_breakdown": detailed_breakdown
    }
