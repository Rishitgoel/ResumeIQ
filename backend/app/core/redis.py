import json
from typing import Optional, Any
import redis.asyncio as aioredis
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class RedisClient:
    def __init__(self):
        self.client: Optional[aioredis.Redis] = None

    async def connect(self):
        try:
            self.client = aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                socket_connect_timeout=2.0
            )
            await self.client.ping()
            logger.info("Connected to Redis successfully.")
        except Exception as e:
            logger.warning(f"Could not connect to Redis at {settings.REDIS_URL}: {e}. Operating in graceful degraded mode.")
            self.client = None

    async def close(self):
        if self.client:
            await self.client.close()

    async def get(self, key: str) -> Optional[str]:
        if not self.client:
            return None
        try:
            return await self.client.get(key)
        except Exception as e:
            logger.warning(f"Redis get error for key {key}: {e}")
            return None

    async def set(self, key: str, value: Any, expire_seconds: int = 3600) -> bool:
        if not self.client:
            return False
        try:
            if not isinstance(value, str):
                value = json.dumps(value)
            await self.client.set(key, value, ex=expire_seconds)
            return True
        except Exception as e:
            logger.warning(f"Redis set error for key {key}: {e}")
            return False

    async def delete(self, key: str) -> bool:
        if not self.client:
            return False
        try:
            await self.client.delete(key)
            return True
        except Exception as e:
            logger.warning(f"Redis delete error for key {key}: {e}")
            return False

    async def is_rate_limited(self, identifier: str, max_requests: int = 60, window_seconds: int = 60) -> bool:
        """Sliding window rate limiter."""
        if not self.client:
            return False
        try:
            key = f"rate_limit:{identifier}"
            current = await self.client.incr(key)
            if current == 1:
                await self.client.expire(key, window_seconds)
            return current > max_requests
        except Exception as e:
            logger.warning(f"Redis rate limiting error: {e}")
            return False

redis_client = RedisClient()
