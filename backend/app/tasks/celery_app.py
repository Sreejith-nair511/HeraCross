"""
Celery application configuration.
"""
from celery import Celery
from celery.schedules import crontab

from app.core.config import settings

# Create Celery app
celery_app = Celery(
    "wasteiq",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks.tasks"]
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Periodic tasks schedule
celery_app.conf.beat_schedule = {
    "daily-forecast-generation": {
        "task": "app.tasks.tasks.generate_daily_forecasts",
        "schedule": crontab(hour=2, minute=0),  # Run at 2 AM daily
    },
    "optimize-daily-routes": {
        "task": "app.tasks.tasks.optimize_daily_routes",
        "schedule": crontab(hour=3, minute=0),  # Run at 3 AM daily
    },
}

# Task routes (optional - for routing tasks to specific queues)
celery_app.conf.task_routes = {
    "app.tasks.tasks.process_image": {"queue": "images"},
    "app.tasks.tasks.process_video": {"queue": "videos"},
    "app.tasks.tasks.run_forecast": {"queue": "analytics"},
    "app.tasks.tasks.optimize_route": {"queue": "optimization"},
}
