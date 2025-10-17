"""Pydantic schemas for inference operations."""
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.db.models import JobStatus


# Image Inference Schemas
class ImageUploadRequest(BaseModel):
    """Schema for image upload metadata."""
    location: Optional[str] = None
    uploader_id: Optional[int] = None
    source: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class ImageInferenceResponse(BaseModel):
    """Schema for image inference job creation response."""
    job_id: str
    status: JobStatus
    message: str = "Image uploaded and queued for processing"


class ImageJobStatusResponse(BaseModel):
    """Schema for image job status response."""
    job_id: str
    status: JobStatus
    image_url: Optional[str] = None
    filename: Optional[str] = None
    created_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    predicted_label: Optional[str] = None
    confidence: Optional[float] = None
    model_used: Optional[str] = None
    processing_time: Optional[float] = None
    error_message: Optional[str] = None
    
    class Config:
        from_attributes = True


# Chat Schemas
class ChatMessage(BaseModel):
    """Single chat message."""
    role: str = Field(..., pattern="^(system|user|assistant)$")
    content: str


class ChatRequest(BaseModel):
    """Schema for chat completion request."""
    model: str = "mistral-tiny"
    messages: List[ChatMessage]
    user_id: Optional[int] = None
    max_tokens: Optional[int] = Field(None, ge=1, le=4096)
    temperature: Optional[float] = Field(0.7, ge=0.0, le=2.0)
    stream: bool = False


class ChatResponse(BaseModel):
    """Schema for chat completion response."""
    id: str
    model: str
    response: str
    finish_reason: str = "stop"
    usage: Optional[Dict[str, int]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Model Registry Schemas
class ModelInfo(BaseModel):
    """Schema for model information."""
    id: int
    name: str
    model_type: str
    provider: str
    endpoint: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    is_active: bool
    
    class Config:
        from_attributes = True


class ModelRegisterRequest(BaseModel):
    """Schema for registering a new model."""
    name: str = Field(..., min_length=1, max_length=255)
    model_type: str = Field(..., pattern="^(classification|detection|segmentation|chat|embedding)$")
    provider: str = Field(..., min_length=1, max_length=100)
    endpoint: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    config: Optional[Dict[str, Any]] = None
