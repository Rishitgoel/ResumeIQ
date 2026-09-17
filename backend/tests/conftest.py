import io
import os
import sys
import pytest
import pytest_asyncio

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from app.main import app
from app.core.database import Base, get_db
from app.core.security import get_password_hash, create_access_token
from app.models.user import User

# In-memory SQLite async engine for automated tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_async_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = async_sessionmaker(
    bind=test_async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create a fresh database schema for each test."""
    async with test_async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestingSessionLocal() as session:
        yield session

    async with test_async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """FastAPI test client with overridden database dependency."""
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()

@pytest_asyncio.fixture(scope="function")
async def test_user(db_session: AsyncSession) -> User:
    """Create a test user in the database."""
    user = User(
        email="engineer@example.com",
        hashed_password=get_password_hash("password123"),
        full_name="Alex Rivera",
        is_active=True,
        is_superuser=False
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user

@pytest_asyncio.fixture(scope="function")
async def auth_headers(test_user: User) -> dict:
    """Generate authorization bearer headers for test user."""
    token = create_access_token(test_user.id)
    return {"Authorization": f"Bearer {token}"}

def generate_pdf_bytes(
    full_name: str = "Alex Rivera",
    skills: list = None,
    experiences: list = None,
    education: str = "B.S. in Computer Science, Stanford University, 2022"
) -> bytes:
    """Generate a realistic test resume PDF using ReportLab."""
    if skills is None:
        skills = ["Python", "FastAPI", "PostgreSQL", "Docker", "Git"]
    if experiences is None:
        experiences = [
            "Senior Backend Engineer at TechCorp (Jan 2022 - Present)",
            "• Built high-performance microservices using FastAPI and PostgreSQL handling 50k requests/min.",
            "• Architected scalable containerized deployments with Docker on AWS cloud infrastructure.",
            "• Implemented automated CI/CD pipelines with GitHub Actions reducing deployment time by 40%."
        ]

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    story.append(Paragraph(f"<b>{full_name}</b>", styles["Title"]))
    story.append(Paragraph("alex.rivera@example.com | San Francisco, CA | github.com/alexrivera", styles["Normal"]))
    story.append(Spacer(1, 14))

    # Professional Summary
    story.append(Paragraph("<b>PROFESSIONAL SUMMARY</b>", styles["Heading2"]))
    story.append(Paragraph(
        "Software Engineer with 3+ years of experience designing and implementing distributed systems, "
        "scalable REST APIs, and database architectures.",
        styles["Normal"]
    ))
    story.append(Spacer(1, 12))

    # Work Experience
    story.append(Paragraph("<b>WORK EXPERIENCE</b>", styles["Heading2"]))
    for exp_line in experiences:
        story.append(Paragraph(exp_line, styles["Normal"]))
    story.append(Spacer(1, 12))

    # Technical Skills
    story.append(Paragraph("<b>TECHNICAL SKILLS</b>", styles["Heading2"]))
    story.append(Paragraph(", ".join(skills), styles["Normal"]))
    story.append(Spacer(1, 12))

    # Education
    story.append(Paragraph("<b>EDUCATION</b>", styles["Heading2"]))
    story.append(Paragraph(education, styles["Normal"]))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
