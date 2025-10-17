"""SQLAlchemy database models for WasteIQ Backend."""
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    Boolean, Column, DateTime, Enum, Float, ForeignKey, 
    Integer, JSON, String, Text
)
from sqlalchemy.orm import relationship

from app.db.base import Base


# Enums
class UserRole(str, PyEnum):
    """User role enumeration."""
    ADMIN = "admin"
    MUNICIPAL_OFFICER = "municipal_officer"
    COLLECTOR = "collector"
    RECYCLER = "recycler"
    CITIZEN = "citizen"


class JobStatus(str, PyEnum):
    """Job processing status."""
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ExchangeStatus(str, PyEnum):
    """Industrial exchange status."""
    AVAILABLE = "available"
    RESERVED = "reserved"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class LogLevel(str, PyEnum):
    """Log level enumeration."""
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


# Models
class User(Base):
    """User model for authentication and authorization."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CITIZEN)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    api_keys = relationship("APIKey", back_populates="user", cascade="all, delete-orphan")
    images = relationship("Image", back_populates="uploader", cascade="all, delete-orphan")
    cctv_videos = relationship("CCTVVideo", back_populates="uploader", cascade="all, delete-orphan")


class APIKey(Base):
    """API key storage for external service providers."""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(100), nullable=False)  # e.g., "huggingface", "mistral"
    masked_key = Column(String(255), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="api_keys")


class Image(Base):
    """Image upload and inference result storage."""
    __tablename__ = "images"
    
    id = Column(Integer, primary_key=True, index=True)
    uploader_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    file_url = Column(String(500), nullable=False)
    filename = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=True)  # Size in bytes
    image_metadata = Column(JSON, nullable=True)  # Location, source, etc.
    
    # Inference results
    job_id = Column(String(100), unique=True, index=True, nullable=True)
    job_status = Column(Enum(JobStatus), default=JobStatus.QUEUED, nullable=False)
    inference_result = Column(JSON, nullable=True)
    predicted_label = Column(String(255), nullable=True)
    confidence = Column(Float, nullable=True)
    model_used = Column(String(255), nullable=True)
    processing_time = Column(Float, nullable=True)  # Time in seconds
    error_message = Column(Text, nullable=True)
    
    # Relationships
    uploader = relationship("User", back_populates="images")


class CCTVVideo(Base):
    """CCTV video upload and processing tracking."""
    __tablename__ = "cctv_videos"
    
    id = Column(Integer, primary_key=True, index=True)
    uploader_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    source_url = Column(String(500), nullable=True)  # File URL or RTSP stream
    rtsp_url = Column(String(500), nullable=True)
    filename = Column(String(255), nullable=True)
    file_size = Column(Integer, nullable=True)
    duration = Column(Float, nullable=True)  # Video duration in seconds
    
    # Processing
    job_id = Column(String(100), unique=True, index=True, nullable=True)
    job_status = Column(Enum(JobStatus), default=JobStatus.QUEUED, nullable=False)
    processed = Column(Boolean, default=False, nullable=False)
    frames_processed = Column(Integer, default=0, nullable=False)
    
    # Metadata
    ward_id = Column(String(100), nullable=True)
    location = Column(JSON, nullable=True)  # {lat, lon, address}
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    
    # Results
    annotated_video_url = Column(String(500), nullable=True)
    summary_report_id = Column(Integer, ForeignKey("audit_reports.id"), nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Relationships
    uploader = relationship("User", back_populates="cctv_videos")
    audit_events = relationship("AuditEvent", back_populates="cctv_video", cascade="all, delete-orphan")
    summary_report = relationship("AuditReport", back_populates="cctv_video")


class AuditEvent(Base):
    """Individual audit events detected in CCTV footage."""
    __tablename__ = "audit_events"
    
    id = Column(Integer, primary_key=True, index=True)
    cctv_video_id = Column(Integer, ForeignKey("cctv_videos.id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, nullable=False)  # Timestamp in video
    frame_number = Column(Integer, nullable=True)
    event_type = Column(String(100), nullable=False)  # e.g., "illegal_dumping", "overflow", "mixing"
    confidence = Column(Float, nullable=True)
    event_metadata = Column(JSON, nullable=True)  # Detection details, bounding boxes
    
    # Relationships
    cctv_video = relationship("CCTVVideo", back_populates="audit_events")


class AuditReport(Base):
    """Generated audit reports for CCTV analysis."""
    __tablename__ = "audit_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    report_type = Column(String(50), default="cctv_audit", nullable=False)
    summary = Column(JSON, nullable=True)  # Aggregated statistics
    pdf_url = Column(String(500), nullable=True)
    json_data = Column(JSON, nullable=True)
    
    # Relationships
    cctv_video = relationship("CCTVVideo", back_populates="summary_report")


class WasteBatch(Base):
    """Waste batch tracking for collection and processing."""
    __tablename__ = "waste_batches"
    
    id = Column(Integer, primary_key=True, index=True)
    source_location = Column(String(500), nullable=True)
    location_coords = Column(JSON, nullable=True)  # {lat, lon}
    waste_type = Column(String(100), nullable=False)
    estimated_weight = Column(Float, nullable=True)  # Weight in kg
    status = Column(String(50), default="collected", nullable=False)
    collection_date = Column(DateTime, nullable=True)
    batch_metadata = Column(JSON, nullable=True)


class IndustrialListing(Base):
    """Industrial waste exchange marketplace listings."""
    __tablename__ = "industrial_listings"
    
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), nullable=False)
    waste_type = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)  # Quantity in tons/kg
    unit = Column(String(20), default="kg", nullable=False)
    location = Column(String(500), nullable=True)
    location_coords = Column(JSON, nullable=True)  # {lat, lon}
    contact_info = Column(JSON, nullable=False)  # {email, phone, person}
    description = Column(Text, nullable=True)
    status = Column(Enum(ExchangeStatus), default=ExchangeStatus.AVAILABLE, nullable=False)
    
    # AI Matching
    embedding_vector = Column(JSON, nullable=True)  # Stored as JSON array for semantic matching
    
    # Relationships
    exchanges = relationship("Exchange", back_populates="listing", cascade="all, delete-orphan")


class Exchange(Base):
    """Industrial waste exchange transactions."""
    __tablename__ = "exchanges"
    
    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("industrial_listings.id", ondelete="CASCADE"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    seller_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    batch_id = Column(Integer, ForeignKey("waste_batches.id", ondelete="SET NULL"), nullable=True)
    status = Column(Enum(ExchangeStatus), default=ExchangeStatus.RESERVED, nullable=False)
    quantity = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    listing = relationship("IndustrialListing", back_populates="exchanges")


class Forecast(Base):
    """Municipal waste forecasting results."""
    __tablename__ = "forecasts"
    
    id = Column(Integer, primary_key=True, index=True)
    ward_id = Column(String(100), nullable=False, index=True)
    forecast_type = Column(String(50), default="waste_generation", nullable=False)
    forecast_horizon_days = Column(Integer, default=30, nullable=False)
    forecast_json = Column(JSON, nullable=False)  # {dates: [...], values: [...], confidence: [...]}
    model_used = Column(String(100), nullable=True)
    accuracy_metrics = Column(JSON, nullable=True)  # MAE, RMSE, etc.


class Route(Base):
    """Optimized collection route plans."""
    __tablename__ = "routes"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False, index=True)
    ward_id = Column(String(100), nullable=True)
    vehicle_id = Column(String(100), nullable=True)
    route_plan_json = Column(JSON, nullable=False)  # Ordered list of stops with ETAs
    optimizer_score = Column(Float, nullable=True)  # Total distance or time
    total_distance_km = Column(Float, nullable=True)
    estimated_duration_minutes = Column(Integer, nullable=True)
    status = Column(String(50), default="planned", nullable=False)


class Log(Base):
    """Application and inference logs."""
    __tablename__ = "logs"
    
    id = Column(Integer, primary_key=True, index=True)
    service = Column(String(100), nullable=False, index=True)
    message = Column(Text, nullable=False)
    level = Column(Enum(LogLevel), default=LogLevel.INFO, nullable=False)
    log_metadata = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)


class ModelRegistry(Base):
    """Registry of available AI models."""
    __tablename__ = "model_registry"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    model_type = Column(String(100), nullable=False)  # classification, detection, chat, embedding
    provider = Column(String(100), nullable=False)  # huggingface, mistral, local
    endpoint = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)  # [waste, recycling, etc.]
    is_active = Column(Boolean, default=True, nullable=False)
    config = Column(JSON, nullable=True)  # Model-specific configuration
