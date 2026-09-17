import pytest
from httpx import AsyncClient
from tests.conftest import generate_pdf_bytes

@pytest.mark.asyncio
async def test_full_analysis_workflow(client: AsyncClient, auth_headers: dict):
    # 1. Upload Resume
    pdf_bytes = generate_pdf_bytes(
        full_name="Sam Backend",
        skills=["Python", "FastAPI", "PostgreSQL", "Docker", "Git"],
        experiences=[
            "Senior Backend Engineer at TechCorp (2021 - Present)",
            "• Built microservices using FastAPI and PostgreSQL.",
            "• Managed Docker containers."
        ]
    )
    files = {"file": ("sam_resume.pdf", pdf_bytes, "application/pdf")}
    res_upload = await client.post("/api/v1/resumes/upload", headers=auth_headers, files=files)
    assert res_upload.status_code == 201
    resume_id = res_upload.json()["id"]

    # 2. Create Job Description
    jd_payload = {
        "title": "Senior Python Backend Engineer",
        "company": "ScaleUp Inc",
        "raw_text": """
        We are looking for a Senior Python Backend Engineer.
        
        Requirements:
        • 3+ years experience with Python and FastAPI.
        • Strong knowledge of PostgreSQL databases.
        • Experience with Next.js is required.

        Preferred:
        • Docker and Redis experience.
        """
    }
    res_jd = await client.post("/api/v1/jobs/", headers=auth_headers, json=jd_payload)
    assert res_jd.status_code == 201
    job_id = res_jd.json()["id"]

    # 3. Trigger Analysis
    analysis_payload = {
        "resume_id": resume_id,
        "job_description_id": job_id
    }
    res_analysis = await client.post("/api/v1/analyses/", headers=auth_headers, json=analysis_payload)
    assert res_analysis.status_code == 201
    analysis_data = res_analysis.json()
    assert 0 <= analysis_data["overall_score"] <= 100
    assert len(analysis_data["skill_matches"]) > 0
    assert len(analysis_data["suggestions"]) > 0
    analysis_id = analysis_data["id"]

    # 4. Fetch specific analysis details
    get_res = await client.get(f"/api/v1/analyses/{analysis_id}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == analysis_id

    # 5. Fetch skill matches
    skills_res = await client.get(f"/api/v1/analyses/{analysis_id}/skills", headers=auth_headers)
    assert skills_res.status_code == 200
    matches = skills_res.json()
    match_map = {m["skill_name"]: m["match_status"] for m in matches}
    assert match_map.get("Python") == "EXACT_MATCH"
    assert match_map.get("FastAPI") == "EXACT_MATCH"
    assert match_map.get("Next.js") == "MISSING"

    # 6. Fetch suggestions
    sugg_res = await client.get(f"/api/v1/analyses/{analysis_id}/suggestions", headers=auth_headers)
    assert sugg_res.status_code == 200
    suggestions = sugg_res.json()
    assert any("Next.js" in s["title"] for s in suggestions)

    # 7. Check Dashboard statistics
    dash_res = await client.get("/api/v1/analytics/dashboard", headers=auth_headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["total_resumes"] >= 1
    assert dash_data["total_jobs"] >= 1
    assert dash_data["total_analyses"] >= 1

@pytest.mark.asyncio
async def test_multi_resume_comparison(client: AsyncClient, auth_headers: dict):
    # Candidate 1: Python + FastAPI + Docker
    pdf1 = generate_pdf_bytes(
        full_name="Candidate One",
        skills=["Python", "FastAPI", "Docker"]
    )
    r1 = (await client.post("/api/v1/resumes/upload", headers=auth_headers, files={"file": ("c1.pdf", pdf1, "application/pdf")})).json()["id"]

    # Candidate 2: Python + PostgreSQL + Next.js
    pdf2 = generate_pdf_bytes(
        full_name="Candidate Two",
        skills=["Python", "PostgreSQL", "Next.js"]
    )
    r2 = (await client.post("/api/v1/resumes/upload", headers=auth_headers, files={"file": ("c2.pdf", pdf2, "application/pdf")})).json()["id"]

    # JD
    jd_payload = {
        "title": "Fullstack Python Engineer",
        "raw_text": "Requirements: Python, FastAPI, Next.js, Docker."
    }
    job_id = (await client.post("/api/v1/jobs/", headers=auth_headers, json=jd_payload)).json()["id"]

    # Compare
    compare_payload = {
        "job_description_id": job_id,
        "resume_ids": [r1, r2]
    }
    comp_res = await client.post("/api/v1/analyses/compare", headers=auth_headers, json=compare_payload)
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert len(comp_data["candidates"]) == 2
    assert "skill_coverage_matrix" in comp_data
    # Verify rankings 1 and 2 exist
    ranks = [c["rank"] for c in comp_data["candidates"]]
    assert 1 in ranks and 2 in ranks
