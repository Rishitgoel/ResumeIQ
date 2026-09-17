import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_user_success(client: AsyncClient):
    payload = {
        "email": "newuser@example.com",
        "password": "strongpassword123",
        "full_name": "Jordan Lee"
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "newuser@example.com"
    assert data["user"]["full_name"] == "Jordan Lee"

@pytest.mark.asyncio
async def test_register_duplicate_email_fails(client: AsyncClient):
    payload = {
        "email": "duplicate@example.com",
        "password": "password123",
        "full_name": "First User"
    }
    res1 = await client.post("/api/v1/auth/register", json=payload)
    assert res1.status_code == 201

    # Second attempt with same email
    res2 = await client.post("/api/v1/auth/register", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]

@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    # Register first
    await client.post("/api/v1/auth/register", json={
        "email": "loginuser@example.com",
        "password": "secretpassword",
        "full_name": "Login User"
    })

    # Login via json
    response = await client.post("/api/v1/auth/login/json", json={
        "email": "loginuser@example.com",
        "password": "secretpassword"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "loginuser@example.com"

@pytest.mark.asyncio
async def test_login_invalid_password_fails(client: AsyncClient):
    await client.post("/api/v1/auth/register", json={
        "email": "target@example.com",
        "password": "correctpassword",
        "full_name": "Target User"
    })

    response = await client.post("/api/v1/auth/login/json", json={
        "email": "target@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]

@pytest.mark.asyncio
async def test_get_me_authenticated(client: AsyncClient, auth_headers: dict):
    response = await client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "engineer@example.com"
    assert data["full_name"] == "Alex Rivera"

@pytest.mark.asyncio
async def test_unauthenticated_me_fails(client: AsyncClient):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401
