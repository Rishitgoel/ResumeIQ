import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.core.database import async_engine, Base
from app.models.user import User
from app.core.security import get_password_hash

async def seed_data():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session = async_sessionmaker(bind=async_engine, expire_on_commit=False)
    async with async_session() as session:
        # Check if demo user exists
        stmt = select(User).where(User.email == "engineer@example.com")
        res = await session.execute(stmt)
        user = res.scalar_one_or_none()
        if not user:
            user = User(
                email="engineer@example.com",
                hashed_password=get_password_hash("password123"),
                full_name="Alex Rivera",
                is_active=True,
                is_superuser=True
            )
            session.add(user)
            await session.commit()
            print("Demo user created: engineer@example.com / password123")
        else:
            print("Demo user already exists.")

if __name__ == "__main__":
    asyncio.run(seed_data())
