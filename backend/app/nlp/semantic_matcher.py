from typing import List, Dict, Tuple, Optional, Any
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.nlp.taxonomy import get_skill_category

class SemanticMatcher:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")

    def compute_text_similarity(self, query: str, candidates: List[str]) -> List[float]:
        """Compute cosine similarity between query string and a list of candidate strings."""
        if not query or not candidates:
            return [0.0] * len(candidates)

        clean_candidates = [c if c and c.strip() else "empty" for c in candidates]
        corpus = [query] + clean_candidates

        try:
            tfidf_matrix = self.vectorizer.fit_transform(corpus)
            sim_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
            return [float(np.clip(s, 0.0, 1.0)) for s in sim_scores]
        except Exception:
            return [0.0] * len(candidates)

    def match_skills(
        self,
        required_skills: List[str],
        preferred_skills: List[str],
        resume_skills: List[Dict[str, Any]],
        resume_bullets: List[str]
    ) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """
        Evaluate exact matches, semantic matches, and missing skills.
        Returns detailed list of matches and summary stats.
        """
        resume_skill_map = {s["canonical_name"].lower(): s for s in resume_skills}
        matches: List[Dict[str, Any]] = []

        all_reqs = [(s, "REQUIRED_SKILL") for s in required_skills] + [(s, "PREFERRED_SKILL") for s in preferred_skills]

        exact_count = 0
        semantic_count = 0
        missing_count = 0

        for skill_name, req_type in all_reqs:
            norm_name = skill_name.lower()

            if norm_name in resume_skill_map:
                # Exact or Canonical Match
                matched_obj = resume_skill_map[norm_name]
                evidence = matched_obj.get("evidence_level", "WEAK")
                matches.append({
                    "skill_name": skill_name,
                    "requirement_type": req_type,
                    "match_status": "EXACT_MATCH",
                    "resume_evidence_level": evidence,
                    "resume_snippet": matched_obj.get("context_snippet"),
                    "similarity_score": 1.0
                })
                exact_count += 1
            else:
                # Attempt Semantic Proximity against resume bullets
                sim_scores = self.compute_text_similarity(skill_name, resume_bullets) if resume_bullets else []
                max_score = max(sim_scores) if sim_scores else 0.0

                # If similarity exceeds conservative threshold (0.65) and belongs to tech context
                if max_score >= 0.65:
                    best_idx = int(np.argmax(sim_scores))
                    best_bullet = resume_bullets[best_idx]
                    matches.append({
                        "skill_name": skill_name,
                        "requirement_type": req_type,
                        "match_status": "SEMANTIC_MATCH",
                        "resume_evidence_level": "MODERATE",
                        "resume_snippet": best_bullet[:200],
                        "similarity_score": round(max_score, 2)
                    })
                    semantic_count += 1
                else:
                    # Missing Skill
                    matches.append({
                        "skill_name": skill_name,
                        "requirement_type": req_type,
                        "match_status": "MISSING",
                        "resume_evidence_level": "NONE",
                        "resume_snippet": None,
                        "similarity_score": 0.0
                    })
                    missing_count += 1

        summary = {
            "total_evaluated": len(all_reqs),
            "exact_matches": exact_count,
            "semantic_matches": semantic_count,
            "missing": missing_count
        }

        return matches, summary

semantic_matcher = SemanticMatcher()
