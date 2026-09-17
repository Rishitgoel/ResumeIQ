from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy import create_engine
from app.core.config import settings
import logging
import re

logger = logging.getLogger(__name__)

def _mask_url(url: str) -> str:
    """Mask password in URL for safe logging."""
    return re.sub(r"://([^:]+):([^@]+)@", r"://\1:****@", url)

# --- Async engine ---
_async_url = settings.async_database_url
print(f"[DB] async engine URL: {_mask_url(_async_url)}", flush=True)

try:
    is_async_sqlite = "sqlite" in _async_url
    async_connect_args = {"check_same_thread": False} if is_async_sqlite else {}
    async_engine = create_async_engine(
        _async_url,
        echo=False,
        future=True,
        pool_pre_ping=not is_async_sqlite,
        connect_args=async_connect_args,
    )
except Exception as e:
    raise RuntimeError(
        f"[DB] Failed to create async engine. URL was: '{_mask_url(_async_url)}'. "
        f"Set DATABASE_URL correctly in Railway Variables. Error: {e}"
    ) from e

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# --- Sync engine ---
_sync_url = settings.sync_database_url
print(f"[DB] sync engine URL: {_mask_url(_sync_url)}", flush=True)

try:
    is_sync_sqlite = "sqlite" in _sync_url
    sync_connect_args = {"check_same_thread": False} if is_sync_sqlite else {}
    sync_engine = create_engine(
        _sync_url,
        echo=False,
        pool_pre_ping=not is_sync_sqlite,
        connect_args=sync_connect_args,
    )
except Exception as e:
    raise RuntimeError(
        f"[DB] Failed to create sync engine. URL was: '{_mask_url(_sync_url)}'. "
        f"Set SYNC_DATABASE_URL correctly in Railway Variables. Error: {e}"
    ) from e

SyncSessionLocal = sessionmaker(
    bind=sync_engine,
    autocommit=False,
    autoflush=False,
)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for yielding an async database session per request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            raise e
        finally:
            await session.close()

