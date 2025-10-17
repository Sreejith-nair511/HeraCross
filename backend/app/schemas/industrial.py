"""Pydantic schemas for industrial waste exchange operations."""
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.db.models import ExchangeStatus


# Industrial Listing Schemas
class ContactInfo(BaseModel):
    """Contact information schema."""
    email: str
    phone: Optional[str] = None
    person: Optional[str] = None


class LocationCoords(BaseModel):
    """Location coordinates schema."""
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)


class IndustrialListingCreate(BaseModel):
    """Schema for creating an industrial listing."""
    company_name: str = Field(..., min_length=1, max_length=255)
    waste_type: str = Field(..., min_length=1, max_length=100)
    quantity: float = Field(..., gt=0)
    unit: str = Field(default="kg", pattern="^(kg|ton|m3|liter)$")
    location: Optional[str] = None
    location_coords: Optional[LocationCoords] = None
    contact_info: ContactInfo
    description: Optional[str] = None


class IndustrialListingResponse(BaseModel):
    """Schema for industrial listing response."""
    id: int
    company_name: str
    waste_type: str
    quantity: float
    unit: str
    location: Optional[str] = None
    location_coords: Optional[Dict[str, float]] = None
    contact_info: Dict[str, Any]
    description: Optional[str] = None
    status: ExchangeStatus
    created_at: datetime
    
    class Config:
        from_attributes = True


class IndustrialListingUpdate(BaseModel):
    """Schema for updating an industrial listing."""
    quantity: Optional[float] = Field(None, gt=0)
    location: Optional[str] = None
    location_coords: Optional[LocationCoords] = None
    contact_info: Optional[ContactInfo] = None
    description: Optional[str] = None
    status: Optional[ExchangeStatus] = None


# Matching Schemas
class MatchResult(BaseModel):
    """Schema for a single match result."""
    listing_id: int
    listing: IndustrialListingResponse
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    distance_km: Optional[float] = None
    combined_score: float = Field(..., ge=0.0, le=1.0)


class MatchRequest(BaseModel):
    """Schema for requesting matches."""
    listing_id: int
    max_results: int = Field(default=10, ge=1, le=50)
    min_similarity: float = Field(default=0.3, ge=0.0, le=1.0)
    max_distance_km: Optional[float] = Field(None, gt=0)


class MatchResponse(BaseModel):
    """Schema for match response."""
    source_listing_id: int
    matches: List[MatchResult]
    total_matches: int


# Exchange Schemas
class ExchangeCreate(BaseModel):
    """Schema for creating an exchange."""
    listing_id: int
    buyer_id: Optional[int] = None
    seller_id: Optional[int] = None
    quantity: Optional[float] = Field(None, gt=0)
    notes: Optional[str] = None


class ExchangeResponse(BaseModel):
    """Schema for exchange response."""
    id: int
    listing_id: int
    buyer_id: Optional[int] = None
    seller_id: Optional[int] = None
    batch_id: Optional[int] = None
    status: ExchangeStatus
    quantity: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ExchangeUpdate(BaseModel):
    """Schema for updating an exchange."""
    status: Optional[ExchangeStatus] = None
    quantity: Optional[float] = Field(None, gt=0)
    notes: Optional[str] = None
