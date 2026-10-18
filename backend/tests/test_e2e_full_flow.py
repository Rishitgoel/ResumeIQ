import pytest
from httpx import AsyncClient
from tests.conftest import generate_pdf_bytes

@pytest.mark.asyncio
async def test_end_to_end_platform_flow(client: AsyncClient):
    """
    Complete end-to-end integration flow testing:
    1. User registration, login, JWT token validation.
    2. Multiple resume PDF generation & uploads with full NLP parsing.
    3. Job description creation & requirements extraction.
    4. Match analysis with custom weights, radar dimensions, explanations & suggestions.
    5. Side-by-side multi-candidate comparison & ranking parity.
    6. Dashboard analytics aggregation & taxonomy mapping.
    7. Resource deletion & lifecycle verification.
    """

    # =========================================================================
    # STEP 1: User Registration & Authentication
    # =========================================================================
    user_payload = {
        "email": "e2e_lead@example.com",
        "password": "Password123!",
        "full_name": "E2E Lead Evaluator"
    }
    reg_res = await client.post("/api/v1/auth/register", json=user_payload)
    assert reg_res.status_code == 201, f"Register failed: {reg_res.text}"
    user_data = reg_res.json()
    assert user_data["user"]["email"] == user_payload["email"]
    assert "id" in user_data["user"]

    login_res = await client.post("/api/v1/auth/login/json", json={
        "email": user_payload["email"],
        "password": user_payload["password"]
    })
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token_data = login_res.json()
    token = token_data["access_token"]
    assert token, "Token missing from login response"

    headers = {"Authorization": f"Bearer {token}"}

    me_res = await client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == user_payload["email"]

    # =========================================================================
    # STEP 2: Resume 1 Upload & Deep NLP Extraction (Senior Profile)
    # =========================================================================
    pdf1_bytes = generate_pdf_bytes(
        full_name="Sarah Connor",
        skills=["Python", "FastAPI", "PostgreSQL", "Docker", "Kubernetes", "AWS", "Kafka", "Redis"],
        experiences=[
            "Senior Backend Architect at Cyberdyne Systems (Jan 2021 - Present)",
            "• Architected scalable microservices using FastAPI, Python, and PostgreSQL serving 100k req/sec.",
            "• Implemented event-driven streaming with Kafka and containerized clusters on Kubernetes and AWS.",
            "• Designed caching layer with Redis cutting DB latency by 65%."
        ],
        education="Stanford University\nMaster of Science in Computer Science, GPA: 3.9/4.0\n2018 - 2020"
    )

    upload1_res = await client.post(
        "/api/v1/resumes/upload",
        headers=headers,
        files={"file": ("sarah_connor_resume.pdf", pdf1_bytes, "application/pdf")}
    )
    assert upload1_res.status_code == 201, f"Upload 1 failed: {upload1_res.text}"
    resume1 = upload1_res.json()
    r1_id = resume1["id"]
    assert resume1["status"] == "COMPLETED"
    assert len(resume1["skills"]) >= 5
    assert len(resume1["experiences"]) >= 1

    # Inspect parsed details for Resume 1
    get_r1 = await client.get(f"/api/v1/resumes/{r1_id}", headers=headers)
    assert get_r1.status_code == 200
    r1_detail = get_r1.json()
    r1_skill_names = [s["canonical_name"] for s in r1_detail["skills"]]
    assert "FastAPI" in r1_skill_names
    assert "Python" in r1_skill_names
    assert "PostgreSQL" in r1_skill_names

    # Check evidence level: FastAPI was used in experience bullet with action verb
    fastapi_skill = next(s for s in r1_detail["skills"] if s["canonical_name"] == "FastAPI")
    assert fastapi_skill["evidence_level"] == "STRONG"

    # Check education details
    assert len(r1_detail["education"]) >= 1
    assert "Master" in r1_detail["education"][0]["degree"]
    assert r1_detail["education"][0]["gpa"] == 3.9

    # =========================================================================
    # STEP 3: Resume 2 Upload (Junior / Different Profile for Comparison)
    # =========================================================================
    pdf2_bytes = generate_pdf_bytes(
        full_name="John Matrix",
        skills=["Python", "Django", "MySQL", "HTML", "CSS"],
        experiences=[
            "Junior Web Developer at Val Verde Logistics (Feb 2023 - Present)",
            "• Built internal admin portals using Django and MySQL database.",
            "• Created responsive frontend views using HTML and CSS."
        ],
        education="State University\nBachelor of Science in Information Technology, CGPA: 8.5/10\n2019 - 2023"
    )

    upload2_res = await client.post(
        "/api/v1/resumes/upload",
        headers=headers,
        files={"file": ("john_matrix_resume.pdf", pdf2_bytes, "application/pdf")}
    )
    assert upload2_res.status_code == 201, f"Upload 2 failed: {upload2_res.text}"
    resume2 = upload2_res.json()
    r2_id = resume2["id"]
    assert resume2["status"] == "COMPLETED"

    # Check 10-point scale CGPA on Resume 2
    get_r2 = await client.get(f"/api/v1/resumes/{r2_id}", headers=headers)
    assert get_r2.status_code == 200
    r2_edu = get_r2.json()["education"][0]
    assert r2_edu["gpa"] == 8.5
    assert r2_edu["max_gpa"] == 10.0

    # =========================================================================
    # STEP 4: Job Description Creation & Parsing
    # =========================================================================
    jd_payload = {
        "title": "Lead Cloud Backend Engineer",
        "company": "Apex Cloud Systems",
        "raw_text": """
        About Us:
        Apex Cloud Systems is building next-generation cloud infrastructure.

        Responsibilities:
        • Architect high-throughput distributed systems.
        • Mentor junior engineers and conduct system design reviews.

        Requirements:
        • 3+ years professional software development experience.
        • Strong proficiency in Python, FastAPI, and PostgreSQL.
        • Hands-on production experience with Docker and Kubernetes.

        Preferred Qualifications:
        • Familiarity with Kafka and AWS cloud services.
        • Master's degree in Computer Science or related engineering discipline.
        """
    }
    jd_res = await client.post("/api/v1/jobs/", headers=headers, json=jd_payload)
    assert jd_res.status_code == 201, f"Create Job failed: {jd_res.text}"
    jd_data = jd_res.json()
    job_id = jd_data["id"]
    assert jd_data["title"] == jd_payload["title"]
    assert jd_data["company"] == jd_payload["company"]
    assert jd_data["min_experience_years"] == 3.0
    assert "Master" in (jd_data["target_degree"] or "")

    # Verify requirements and skills
    assert "Python" in jd_data["required_skills"]
    assert "FastAPI" in jd_data["required_skills"]
    assert "PostgreSQL" in jd_data["required_skills"]
    assert "Docker" in jd_data["required_skills"]
    assert "Kafka" in jd_data["preferred_skills"]
    assert "Amazon Web Services" in jd_data["preferred_skills"] or "AWS" in jd_data["preferred_skills"]

    # =========================================================================
    # STEP 5: Run Detailed Match Analysis (Sarah Connor vs Apex Job)
    # =========================================================================
    analysis_create_payload = {
        "resume_id": r1_id,
        "job_description_id": job_id,
        "custom_weights": {
            "required_skills": 0.40,
            "preferred_skills": 0.15,
            "experience": 0.20,
            "projects": 0.10,
            "education": 0.10,
            "other": 0.05
        }
    }
    an_res = await client.post("/api/v1/analyses/", headers=headers, json=analysis_create_payload)
    assert an_res.status_code == 201, f"Analysis failed: {an_res.text}"
    analysis = an_res.json()
    analysis_id = analysis["id"]

    # Verify scores
    assert analysis["overall_score"] >= 80.0, f"Expected high match score, got {analysis['overall_score']}"
    assert analysis["required_skills_score"] >= 95.0  # Python, FastAPI, PostgreSQL, Docker, Kubernetes all matched with high evidence
    assert analysis["experience_score"] == 100.0       # >3 years
    assert analysis["education_score"] == 100.0        # Master's degree matched target Master's
    assert "explanation_summary" in analysis

    # Query GET /analyses/{id}
    detail_res = await client.get(f"/api/v1/analyses/{analysis_id}", headers=headers)
    assert detail_res.status_code == 200
    assert detail_res.json()["id"] == analysis_id

    # Query GET /analyses/{id}/skills
    skills_matrix_res = await client.get(f"/api/v1/analyses/{analysis_id}/skills", headers=headers)
    assert skills_matrix_res.status_code == 200
    skill_items = skills_matrix_res.json()
    matched_names = [s["skill_name"] for s in skill_items if s["match_status"] == "EXACT_MATCH"]
    assert "FastAPI" in matched_names
    assert "PostgreSQL" in matched_names
    assert "Kafka" in matched_names

    # Query GET /analyses/{id}/suggestions
    sugg_res = await client.get(f"/api/v1/analyses/{analysis_id}/suggestions", headers=headers)
    assert sugg_res.status_code == 200
    suggestions = sugg_res.json()
    assert isinstance(suggestions, list)

    # =========================================================================
    # STEP 6: Side-by-Side Multi-Resume Comparison
    # =========================================================================
    comp_payload = {
        "job_description_id": job_id,
        "resume_ids": [r1_id, r2_id]
    }
    comp_res = await client.post("/api/v1/analyses/compare", headers=headers, json=comp_payload)
    assert comp_res.status_code == 200, f"Comparison failed: {comp_res.text}"
    comp_data = comp_res.json()

    assert len(comp_data["candidates"]) == 2
    candidates = comp_data["candidates"]

    # Candidate 1 (Sarah) should be rank 1 with high score
    assert candidates[0]["resume_id"] == r1_id
    assert candidates[0]["rank"] == 1
    assert candidates[0]["overall_score"] > candidates[1]["overall_score"]

    # Candidate 2 (John) should be rank 2
    assert candidates[1]["resume_id"] == r2_id
    assert candidates[1]["rank"] == 2

    # Verify skill coverage matrix
    matrix = comp_data["skill_coverage_matrix"]
    assert "FastAPI" in matrix
    assert matrix["FastAPI"][r1_id] is True
    assert matrix["FastAPI"][r2_id] is False

    # =========================================================================
    # STEP 7: Dashboard Analytics Verification
    # =========================================================================
    dash_res = await client.get("/api/v1/analytics/dashboard", headers=headers)
    assert dash_res.status_code == 200
    dash = dash_res.json()
    assert dash["total_resumes"] == 2
    assert dash["total_jobs"] == 1
    assert dash["total_analyses"] >= 1
    assert dash["average_match_score"] > 0
    assert len(dash["recent_analyses"]) >= 1
    assert dash["recent_analyses"][0]["id"] == analysis_id

    # Verify score distribution buckets
    assert len(dash["score_distribution"]) == 5

    # =========================================================================
    # STEP 8: Deletion & Lifecycle Verification
    # =========================================================================
    # Delete analysis
    del_an = await client.delete(f"/api/v1/analyses/{analysis_id}", headers=headers)
    assert del_an.status_code == 204

    # Verify analysis is deleted
    get_del_an = await client.get(f"/api/v1/analyses/{analysis_id}", headers=headers)
    assert get_del_an.status_code == 404

    # Delete resume 2
    del_r2 = await client.delete(f"/api/v1/resumes/{r2_id}", headers=headers)
    assert del_r2.status_code == 204
    assert (await client.get(f"/api/v1/resumes/{r2_id}", headers=headers)).status_code == 404

    # Delete job
    del_job = await client.delete(f"/api/v1/jobs/{job_id}", headers=headers)
    assert del_job.status_code == 204
    assert (await client.get(f"/api/v1/jobs/{job_id}", headers=headers)).status_code == 404
