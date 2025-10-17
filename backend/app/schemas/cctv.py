"""Pydantic schemas for CCTV and video audit operations."""
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.db.models import JobStatus


# CCTV Upload Schemas
class CCTVUploadRequest(BaseModel):
    """Schema for CCTV video upload metadata."""
    rtsp_url: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    ward_id: Optional[str] = None
    location: Optional[Dict[str, Any]] = None  # {lat, lon, address}
    uploader_id: Optional[int] = None


class CCTVUploadResponse(BaseModel):
    """Schema for CCTV upload response."""
    job_id: str
    status: JobStatus
    message: str = "Video uploaded and queued for processing"


# CCTV Processing Status
class AuditEventSummary(BaseModel):
    """Summary of an audit event."""
    id: int
    timestamp: datetime
    event_type: str
    confidence: Optional[float] = None
    frame_number: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True


class CCTVStatusResponse(BaseModel):
    """Schema for CCTV processing status response."""
    job_id: str
    status: JobStatus
    processed: bool
    frames_processed: int
    progress_percent: Optional[float] = None
    source_url: Optional[str] = None
    annotated_video_url: Optional[str] = None
    events_detected: Optional[List[AuditEventSummary]] = None
    summary_report_id: Optional[int] = None
    error_message: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Audit Report Schemas
class AuditReportSummary(BaseModel):
    """Summary statistics for audit report."""
    total_events: int
    event_types: Dict[str, int]  # {event_type: count}
    avg_confidence: Optional[float] = None
    duration_analyzed: Optional[float] = None  # seconds
    violations_detected: int


class AuditReportResponse(BaseModel):
    """Schema for audit report response."""
    report_id: int
    report_type: str
    summary: Optional[AuditReportSummary] = None
    pdf_url: Optional[str] = None
    json_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
