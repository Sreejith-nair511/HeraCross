"""Pydantic schemas for municipal analytics and forecasting operations."""
from datetime import date, datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# Analytics Summary Schemas
class AnalyticsSummaryRequest(BaseModel):
    """Request schema for analytics summary."""
    start_date: date
    end_date: date
    ward_id: Optional[str] = None


class WasteTypeStat(BaseModel):
    """Waste type statistic."""
    waste_type: str
    count: int
    percentage: float


class AnalyticsSummaryResponse(BaseModel):
    """Response schema for analytics summary."""
    period_start: date
    period_end: date
    ward_id: Optional[str] = None
    total_collected_kg: float
    segregation_rate: float = Field(..., ge=0.0, le=100.0)
    recycling_rate: float = Field(..., ge=0.0, le=100.0)
    overflow_events: int
    illegal_dumping_events: int
    top_waste_types: List[WasteTypeStat]
    daily_average_kg: float


# Forecasting Schemas
class TimeSeriesDataPoint(BaseModel):
    """Single time series data point."""
    date: date
    value: float


class ForecastRequest(BaseModel):
    """Request schema for creating a forecast."""
    ward_id: str
    forecast_type: str = Field(default="waste_generation", pattern="^(waste_generation|collection_demand|recycling_rate)$")
    forecast_horizon_days: int = Field(default=30, ge=1, le=365)
    historical_data: Optional[List[TimeSeriesDataPoint]] = None  # If not provided, fetch from DB


class ForecastDataPoint(BaseModel):
    """Forecast data point with confidence interval."""
    date: date
    predicted_value: float
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None
    confidence: Optional[float] = None


class ForecastResponse(BaseModel):
    """Response schema for forecast."""
    id: int
    ward_id: str
    forecast_type: str
    forecast_horizon_days: int
    forecasts: List[ForecastDataPoint]
    model_used: Optional[str] = None
    accuracy_metrics: Optional[Dict[str, float]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# Route Optimization Schemas
class Pickup(BaseModel):
    """Individual pickup location."""
    id: str
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)
    estimated_weight_kg: float = Field(..., ge=0)
    time_window_start: Optional[str] = None  # HH:MM format
    time_window_end: Optional[str] = None  # HH:MM format
    service_time_minutes: int = Field(default=5, ge=0)


class RouteOptimizationRequest(BaseModel):
    """Request schema for route optimization."""
    date: date
    ward_id: Optional[str] = None
    pickups: List[Pickup]
    vehicle_capacity_kg: float = Field(..., gt=0)
    depot_location: Optional[Dict[str, float]] = None  # {lat, lon}
    num_vehicles: int = Field(default=1, ge=1, le=20)


class Stop(BaseModel):
    """Single stop in optimized route."""
    stop_number: int
    pickup_id: str
    lat: float
    lon: float
    estimated_weight_kg: float
    arrival_time: str  # HH:MM format
    departure_time: str  # HH:MM format
    cumulative_load_kg: float


class VehicleRoute(BaseModel):
    """Route for a single vehicle."""
    vehicle_id: str
    stops: List[Stop]
    total_distance_km: float
    total_duration_minutes: int
    total_load_kg: float
    utilization_percent: float


class RouteOptimizationResponse(BaseModel):
    """Response schema for route optimization."""
    route_id: int
    date: date
    ward_id: Optional[str] = None
    vehicle_routes: List[VehicleRoute]
    total_distance_km: float
    total_duration_minutes: int
    optimizer_score: float
    created_at: datetime
    
    class Config:
        from_attributes = True


class RouteResponse(BaseModel):
    """Response schema for route retrieval."""
    id: int
    date: datetime
    ward_id: Optional[str] = None
    vehicle_id: Optional[str] = None
    route_plan_json: Dict[str, Any]
    optimizer_score: Optional[float] = None
    total_distance_km: Optional[float] = None
    estimated_duration_minutes: Optional[int] = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
