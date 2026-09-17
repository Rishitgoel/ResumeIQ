from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "resumeiq_workers",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.workers.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,        # 5 minutes maximum runtime
    task_soft_time_limit=240,   # 4 minutes soft timeout
    worker_concurrency=2,
    worker_prefetch_multiplier=1,
    # Use in-memory transport when no external broker is configured
    broker_transport_options={"visibility_timeout": 3600},
)
