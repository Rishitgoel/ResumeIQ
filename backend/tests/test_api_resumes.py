import pytest
from httpx import AsyncClient
from tests.conftest import generate_pdf_bytes

@pytest.mark.asyncio
async def test_upload_resume_pdf(client: AsyncClient, auth_headers: dict):
    pdf_bytes = generate_pdf_bytes(
        full_name="Alex Rivera",
        skills=["Python", "FastAPI", "PostgreSQL", "Docker", "Git"],
        experiences=[
            "Senior Backend Engineer at TechCorp (Jan 2021 - Present)",
            "• Built high-performance microservices using FastAPI and PostgreSQL handling 50k req/min.",
            "• Scaled Docker container deployments on AWS cloud."
        ]
    )

    files = {
        "file": ("alex_rivera_resume.pdf", pdf_bytes, "application/pdf")
    }
    data = {"title": "Alex Rivera - Senior Backend Resume"}

    response = await client.post("/api/v1/resumes/upload", headers=auth_headers, files=files, data=data)
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["title"] == "Alex Rivera - Senior Backend Resume"
    assert res_data["status"] == "COMPLETED"
    assert len(res_data["skills"]) >= 3
    assert len(res_data["experiences"]) >= 1

@pytest.mark.asyncio
async def test_list_and_get_resume(client: AsyncClient, auth_headers: dict):
    # Upload one resume
    pdf_bytes = generate_pdf_bytes(full_name="Morgan Chase")
    files = {"file": ("morgan.pdf", pdf_bytes, "application/pdf")}
    upload_res = await client.post("/api/v1/resumes/upload", headers=auth_headers, files=files)
    assert upload_res.status_code == 201
    resume_id = upload_res.json()["id"]

    # List resumes
    list_res = await client.get("/api/v1/resumes/", headers=auth_headers)
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert list_data["total"] >= 1

    # Get single resume
    get_res = await client.get(f"/api/v1/resumes/{resume_id}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == resume_id

@pytest.mark.asyncio
async def test_delete_resume(client: AsyncClient, auth_headers: dict):
    pdf_bytes = generate_pdf_bytes(full_name="Delete Candidate")
    files = {"file": ("delete_me.pdf", pdf_bytes, "application/pdf")}
    upload_res = await client.post("/api/v1/resumes/upload", headers=auth_headers, files=files)
    resume_id = upload_res.json()["id"]

    # Delete
    del_res = await client.delete(f"/api/v1/resumes/{resume_id}", headers=auth_headers)
    assert del_res.status_code == 204

    # Verify not found
    get_res = await client.get(f"/api/v1/resumes/{resume_id}", headers=auth_headers)
    assert get_res.status_code == 404
