# WasteIQ API Reference

Complete API endpoint reference for WasteIQ Backend.

## Base URL

```
http://localhost:8000
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer {your_jwt_token}
```

---

## 🔐 Authentication Endpoints

### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "citizen"  // admin | municipal_officer | collector | recycler | citizen
}

Response: 201 Created
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "citizen",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  },
  "token": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer"
  }
}
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "user": { ... },
  "token": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer"
  }
}
```

### Refresh Token

```http
POST /api/v1/auth/refresh
Authorization: Bearer {current_token}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

---

## 🖼️ Image Inference Endpoints

### Upload Image for Classification

```http
POST /api/v1/inference/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: (binary file)
location: "Ward 5, Mumbai"
source: "mobile_app"
metadata: {} (optional JSON)

Response: 202 Accepted
{
  "job_id": "img_abc123def456",
  "status": "queued",
  "message": "Image uploaded and queued for processing"
}
```

### Get Image Classification Result

```http
GET /api/v1/inference/image/{job_id}
Authorization: Bearer {token}

Response: 200 OK
{
  "job_id": "img_abc123def456",
  "status": "completed",  // queued | processing | completed | failed
  "image_url": "http://minio:9000/wasteiq/uploads/img_abc123def456.jpg",
  "filename": "waste_image.jpg",
  "created_at": "2024-01-15T10:30:00",
  "result": {
    "predictions": [
      {"label": "plastic_bottle", "score": 0.95},
      {"label": "recyclable_plastic", "score": 0.89}
    ]
  },
  "predicted_label": "plastic_bottle",
  "confidence": 0.95,
  "model_used": "google/vit-base-patch16-224",
  "processing_time": 1.234,
  "error_message": null
}
```

---

## 💬 Chat Endpoints (TrashGPT)

### Send Chat Message

```http
POST /api/v1/inference/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "model": "mistral-tiny",
  "messages": [
    {"role": "user", "content": "How do I properly recycle batteries?"}
  ],
  "user_id": 1,
  "temperature": 0.7,
  "max_tokens": 500,
  "stream": false
}

Response: 200 OK
{
  "id": "chat_xyz789",
  "model": "mistral-tiny",
  "response": "Batteries should be recycled at designated collection points...",
  "finish_reason": "stop",
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 85,
    "total_tokens": 100
  },
  "created_at": "2024-01-15T10:30:00"
}
```

---

## 📹 CCTV Video Audit Endpoints

### Upload CCTV Video

```http
POST /api/v1/cctv/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: (video file binary)
ward_id: "ward_5"
location: {"lat": 19.0760, "lon": 72.8777, "address": "Main Street"}
uploader_id: 1

Response: 202 Accepted
{
  "job_id": "cctv_def456ghi789",
  "status": "queued",
  "message": "Video uploaded and queued for processing"
}
```

### Upload from RTSP Stream

```http
POST /api/v1/cctv/upload
Authorization: Bearer {token}
Content-Type: application/json

{
  "rtsp_url": "rtsp://camera.example.com/stream1",
  "start_time": "2024-01-15T08:00:00",
  "end_time": "2024-01-15T09:00:00",
  "ward_id": "ward_5",
  "location": {"lat": 19.0760, "lon": 72.8777}
}

Response: 202 Accepted
{
  "job_id": "cctv_def456ghi789",
  "status": "queued"
}
```

### Check Video Processing Status

```http
GET /api/v1/cctv/status/{job_id}
Authorization: Bearer {token}

Response: 200 OK
{
  "job_id": "cctv_def456ghi789",
  "status": "processing",  // queued | processing | completed | failed
  "processed": false,
  "frames_processed": 245,
  "progress_percent": 45.5,
  "source_url": "http://minio:9000/wasteiq/videos/cctv_def456ghi789.mp4",
  "annotated_video_url": null,
  "events_detected": [
    {
      "id": 1,
      "timestamp": "2024-01-15T08:15:30",
      "event_type": "illegal_dumping",
      "confidence": 0.89,
      "frame_number": 915,
      "metadata": {
        "bounding_box": [120, 340, 250, 480],
        "objects_detected": ["person", "garbage_bag"]
      }
    },
    {
      "id": 2,
      "timestamp": "2024-01-15T08:32:10",
      "event_type": "overflow",
      "confidence": 0.92,
      "frame_number": 1930
    }
  ],
  "summary_report_id": null,
  "error_message": null,
  "created_at": "2024-01-15T08:00:00"
}
```

### Get Audit Report

```http
GET /api/v1/cctv/report/{job_id}
Authorization: Bearer {token}

Response: 200 OK
{
  "report_id": 5,
  "report_type": "cctv_audit",
  "summary": {
    "total_events": 12,
    "event_types": {
      "illegal_dumping": 3,
      "overflow": 5,
      "mixing": 4
    },
    "avg_confidence": 0.87,
    "duration_analyzed": 3600.0,
    "violations_detected": 8
  },
  "pdf_url": "http://minio:9000/wasteiq/reports/cctv_report_5.pdf",
  "json_data": { ... },
  "created_at": "2024-01-15T10:30:00"
}
```

---

## 🏭 Industrial Exchange Endpoints

### Create Industrial Listing

```http
POST /api/v1/industrial/listings
Authorization: Bearer {token}
Content-Type: application/json

{
  "company_name": "ABC Manufacturing",
  "waste_type": "plastic_scraps",
  "quantity": 500,
  "unit": "kg",
  "location": "Industrial Area, Phase 2",
  "location_coords": {"lat": 28.7041, "lon": 77.1025},
  "contact_info": {
    "email": "contact@abc.com",
    "phone": "+91-1234567890",
    "person": "Ramesh Kumar"
  },
  "description": "Clean PET plastic scraps from bottle production"
}

Response: 201 Created
{
  "id": 123,
  "company_name": "ABC Manufacturing",
  "waste_type": "plastic_scraps",
  "quantity": 500,
  "unit": "kg",
  "location": "Industrial Area, Phase 2",
  "location_coords": {"lat": 28.7041, "lon": 77.1025},
  "contact_info": {...},
  "description": "Clean PET plastic scraps from bottle production",
  "status": "available",
  "created_at": "2024-01-15T10:30:00"
}
```

### Get All Listings

```http
GET /api/v1/industrial/listings?page=1&size=20&status=available
Authorization: Bearer {token}

Response: 200 OK
{
  "items": [
    {
      "id": 123,
      "company_name": "ABC Manufacturing",
      ...
    }
  ],
  "total": 45,
  "page": 1,
  "size": 20,
  "pages": 3
}
```

### Find Matches for a Listing

```http
GET /api/v1/industrial/match?listing_id=123&max_results=10&min_similarity=0.3
Authorization: Bearer {token}

Response: 200 OK
{
  "source_listing_id": 123,
  "matches": [
    {
      "listing_id": 456,
      "similarity_score": 0.92,
      "distance_km": 5.2,
      "combined_score": 0.89,
      "listing": {
        "id": 456,
        "company_name": "XYZ Recyclers",
        "waste_type": "plastic_recycling",
        ...
      }
    },
    {
      "listing_id": 789,
      "similarity_score": 0.85,
      "distance_km": 12.5,
      "combined_score": 0.78,
      "listing": {...}
    }
  ],
  "total_matches": 8
}
```

### Create Exchange Transaction

```http
POST /api/v1/industrial/exchange
Authorization: Bearer {token}
Content-Type: application/json

{
  "listing_id": 123,
  "buyer_id": 5,
  "quantity": 500,
  "notes": "Pickup scheduled for next week"
}

Response: 201 Created
{
  "id": 50,
  "listing_id": 123,
  "buyer_id": 5,
  "seller_id": 2,
  "batch_id": null,
  "status": "reserved",
  "quantity": 500,
  "notes": "Pickup scheduled for next week",
  "created_at": "2024-01-15T10:30:00"
}
```

---

## 📊 Municipal Analytics Endpoints

### Get Analytics Summary

```http
GET /api/v1/analytics/summary?start=2024-01-01&end=2024-01-31&ward=ward_5
Authorization: Bearer {token}

Response: 200 OK
{
  "period_start": "2024-01-01",
  "period_end": "2024-01-31",
  "ward_id": "ward_5",
  "total_collected_kg": 125000.5,
  "segregation_rate": 78.5,
  "recycling_rate": 45.2,
  "overflow_events": 12,
  "illegal_dumping_events": 3,
  "top_waste_types": [
    {"waste_type": "organic", "count": 450, "percentage": 45.0},
    {"waste_type": "plastic", "count": 320, "percentage": 32.0},
    {"waste_type": "paper", "count": 230, "percentage": 23.0}
  ],
  "daily_average_kg": 4032.25
}
```

### Create Forecast

```http
POST /api/v1/analytics/forecast
Authorization: Bearer {token}
Content-Type: application/json

{
  "ward_id": "ward_5",
  "forecast_type": "waste_generation",
  "forecast_horizon_days": 30,
  "historical_data": [
    {"date": "2024-01-01", "value": 4100},
    {"date": "2024-01-02", "value": 3950}
  ]
}

Response: 201 Created
{
  "id": 789,
  "ward_id": "ward_5",
  "forecast_type": "waste_generation",
  "forecast_horizon_days": 30,
  "forecasts": [
    {
      "date": "2024-02-01",
      "predicted_value": 4100,
      "lower_bound": 3900,
      "upper_bound": 4300,
      "confidence": 0.95
    },
    {
      "date": "2024-02-02",
      "predicted_value": 4050,
      "lower_bound": 3850,
      "upper_bound": 4250,
      "confidence": 0.95
    }
  ],
  "model_used": "prophet",
  "accuracy_metrics": {
    "mae": 120.5,
    "rmse": 150.2,
    "mape": 3.5
  },
  "created_at": "2024-01-15T10:30:00"
}
```

### Get Latest Forecast

```http
GET /api/v1/analytics/forecast/{ward_id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 789,
  "ward_id": "ward_5",
  ...
}
```

---

## 🚛 Route Optimization Endpoints

### Optimize Collection Route

```http
POST /api/v1/routes/optimize
Authorization: Bearer {token}
Content-Type: application/json

{
  "date": "2024-02-01",
  "ward_id": "ward_5",
  "pickups": [
    {
      "id": "p1",
      "lat": 19.0760,
      "lon": 72.8777,
      "estimated_weight_kg": 150,
      "time_window_start": "08:00",
      "time_window_end": "12:00",
      "service_time_minutes": 5
    },
    {
      "id": "p2",
      "lat": 19.0820,
      "lon": 72.8820,
      "estimated_weight_kg": 200,
      "time_window_start": "08:00",
      "time_window_end": "14:00",
      "service_time_minutes": 5
    }
  ],
  "vehicle_capacity_kg": 5000,
  "depot_location": {"lat": 19.0700, "lon": 72.8700},
  "num_vehicles": 2
}

Response: 200 OK
{
  "route_id": 101,
  "date": "2024-02-01",
  "ward_id": "ward_5",
  "vehicle_routes": [
    {
      "vehicle_id": "V1",
      "stops": [
        {
          "stop_number": 1,
          "pickup_id": "p1",
          "lat": 19.0760,
          "lon": 72.8777,
          "estimated_weight_kg": 150,
          "arrival_time": "08:15",
          "departure_time": "08:20",
          "cumulative_load_kg": 150
        },
        {
          "stop_number": 2,
          "pickup_id": "p3",
          "lat": 19.0800,
          "lon": 72.8800,
          "estimated_weight_kg": 180,
          "arrival_time": "08:35",
          "departure_time": "08:40",
          "cumulative_load_kg": 330
        }
      ],
      "total_distance_km": 25.5,
      "total_duration_minutes": 145,
      "total_load_kg": 2400,
      "utilization_percent": 48.0
    },
    {
      "vehicle_id": "V2",
      "stops": [...],
      "total_distance_km": 19.7,
      "total_duration_minutes": 120,
      "total_load_kg": 1800,
      "utilization_percent": 36.0
    }
  ],
  "total_distance_km": 45.2,
  "total_duration_minutes": 265,
  "optimizer_score": 45.2,
  "created_at": "2024-01-15T10:30:00"
}
```

### Get Route by ID

```http
GET /api/v1/routes/{route_id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 101,
  "date": "2024-02-01T00:00:00",
  "ward_id": "ward_5",
  "vehicle_id": "V1",
  "route_plan_json": {...},
  "optimizer_score": 45.2,
  "total_distance_km": 45.2,
  "estimated_duration_minutes": 265,
  "status": "planned",
  "created_at": "2024-01-15T10:30:00"
}
```

---

## 🎛️ Model Registry Endpoints

### Get Available Models

```http
GET /api/v1/models
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "name": "google/vit-base-patch16-224",
    "model_type": "classification",
    "provider": "huggingface",
    "endpoint": null,
    "description": "Vision Transformer for image classification",
    "tags": ["vision", "classification", "waste"],
    "is_active": true
  },
  {
    "id": 2,
    "name": "mistral-tiny",
    "model_type": "chat",
    "provider": "mistral",
    "description": "Mistral AI chat model",
    "tags": ["chat", "nlp"],
    "is_active": true
  }
]
```

### Register New Model (Admin Only)

```http
POST /api/v1/models
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "custom-waste-classifier-v2",
  "model_type": "classification",
  "provider": "huggingface",
  "endpoint": "https://api.example.com/model",
  "description": "Custom fine-tuned waste classifier",
  "tags": ["waste", "custom"],
  "config": {"threshold": 0.7}
}

Response: 201 Created
{
  "id": 5,
  "name": "custom-waste-classifier-v2",
  ...
}
```

---

## 🔧 Admin Endpoints

### Get Logs

```http
GET /api/v1/logs?model=&start=2024-01-01&end=2024-01-31&level=error&page=1&size=50
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "items": [
    {
      "id": 1234,
      "service": "hf_client",
      "message": "API rate limit exceeded",
      "level": "error",
      "metadata": {...},
      "timestamp": "2024-01-15T10:30:00",
      "user_id": 5
    }
  ],
  "total": 125,
  "page": 1,
  "size": 50
}
```

### Export Data

```http
GET /api/v1/export/csv?start=2024-01-01&end=2024-01-31&type=images
Authorization: Bearer {admin_token}

Response: 200 OK
Content-Type: text/csv

id,filename,predicted_label,confidence,created_at
1,waste1.jpg,plastic_bottle,0.95,2024-01-15T10:30:00
2,waste2.jpg,organic_waste,0.88,2024-01-15T11:00:00
```

---

## ❤️ Health & Monitoring

### Health Check

```http
GET /health

Response: 200 OK
{
  "status": "healthy",  // healthy | degraded
  "service": "WasteIQ API",
  "version": "1.0.0",
  "database": "connected",
  "redis": "connected"
}
```

### Root Endpoint

```http
GET /

Response: 200 OK
{
  "service": "WasteIQ API",
  "version": "1.0.0",
  "docs": "/docs",
  "redoc": "/redoc",
  "health": "/health"
}
```

---

## 📡 Error Responses

### Standard Error Format

```json
{
  "detail": "Error message",
  "status_code": 400
}
```

### Common Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST creating resource
- `202 Accepted` - Async job accepted
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

### Validation Error Format

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ],
  "status_code": 422
}
```

---

## 🔗 Related Resources

- Interactive API Docs: http://localhost:8000/docs
- ReDoc Documentation: http://localhost:8000/redoc
- Celery Monitor (Flower): http://localhost:5555
- MinIO Console: http://localhost:9001

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-17
