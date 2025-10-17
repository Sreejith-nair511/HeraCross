"""
Simplified configuration module for WasteIQ Backend showcase.
Uses SQLite for local development and deployment.
"""
from functools import lru_cache
from typing import List, Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "WasteIQ API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database - SQLite for showcase
    DATABASE_URL: str = Field(
        default="sqlite:///./wasteiq.db",
        description="SQLite database connection URL"
    )
    
    # Redis - Disabled for showcase
    REDIS_URL: str = Field(
        default="",
        description="Redis connection URL (disabled for showcase)"
    )
    
    # Celery - Disabled for showcase
    CELERY_BROKER_URL: str = Field(
        default="",
        description="Celery broker URL (disabled for showcase)"
    )
    CELERY_RESULT_BACKEND: str = Field(
        default="",
        description="Celery result backend URL (disabled for showcase)"
    )
    
    # API Keys - External Services (optional for showcase)
    HF_API_TOKEN: str = Field(
        default="",
        description="HuggingFace API token (optional for showcase)"
    )
    MISTRAL_API_KEY: str = Field(
        default="",
        description="Mistral AI API key (optional for showcase)"
    )
    
    # Security
    SECRET_KEY: str = Field(
        default="showcase-secret-key-for-demo-purposes-only-change-in-production",
        min_length=32,
        description="Secret key for JWT token generation"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Storage - Disabled for showcase
    S3_BUCKET_URL: Optional[str] = None
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    
    # Storage - Firebase (Disabled for showcase)
    FIREBASE_STORAGE_URL: Optional[str] = None
    
    # Storage - MinIO (Disabled for showcase)
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET: str = "wasteiq"
    MINIO_SECURE: bool = False
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://localhost:8000"
    
    @field_validator("CORS_ORIGINS")
    @classmethod
    def parse_cors_origins(cls, v: str) -> List[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in v.split(",") if origin.strip()]
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    
    # CCTV Processing
    CCTV_FRAME_SAMPLE_RATE: int = 1
    MAX_VIDEO_SIZE_MB: int = 500
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    # HuggingFace API Configuration
    HF_API_BASE_URL: str = "https://api-inference.huggingface.co/models"
    HF_TIMEOUT: int = 60
    HF_MAX_RETRIES: int = 3
    
    # Mistral API Configuration
    MISTRAL_API_BASE_URL: str = "https://api.mistral.ai/v1"
    MISTRAL_TIMEOUT: int = 60
    MISTRAL_MAX_RETRIES: int = 3
    
    # Default Models
    DEFAULT_CLASSIFICATION_MODEL: str = "google/vit-base-patch16-224"
    DEFAULT_DETECTION_MODEL: str = "hustvl/yolos-tiny"
    DEFAULT_EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    DEFAULT_CHAT_MODEL: str = "mistral-tiny"
    
    # File Upload Limits
    MAX_IMAGE_SIZE_MB: int = 10
    MAX_VIDEO_SIZE_MB: int = 500
    ALLOWED_IMAGE_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".webp"]
    ALLOWED_VIDEO_EXTENSIONS: List[str] = [".mp4", ".avi", ".mov", ".mkv"]
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Uses LRU cache to ensure settings are loaded only once.
    """
    return Settings()


# Export settings instance
settings = get_settings()