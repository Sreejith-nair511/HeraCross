# WasteIQ Backend — OpenCity AI Hub Server

Production-ready Python backend API for WasteIQ that integrates Hugging Face inference APIs for vision/NLP, Mistral for chat, CCTV video auditing, industrial waste exchange matching via embeddings, municipal analytics & forecasting, route optimization, and authentication with role-based access control.

## 🚀 Features

- **Image Classification**: Waste classification using HuggingFace vision models
- **TrashGPT Chat**: AI-powered waste management assistant using Mistral AI
- **CCTV Audit**: Automated video analysis for illegal dumping and overflow detection
- **Industrial Exchange**: AI-powered marketplace matching for industrial waste recycling
- **Municipal Analytics**: Waste generation forecasting and collection insights
- **Route Optimization**: OR-Tools powered collection route planning
- **Authentication**: JWT-based auth with role-based access control
- **Background Processing**: Celery-powered async task processing
- **WebSocket Support**: Real-time notifications for job completion

## 📋 Tech Stack

- **Framework**: FastAPI (async) + Uvicorn ASGI server
- **Database**: PostgreSQL with SQLAlchemy ORM + Alembic migrations
- **Cache & Queue**: Redis + Celery for background tasks
- **AI/ML**: HuggingFace API, Mistral AI, sentence-transformers, Prophet, OR-Tools
- **Storage**: MinIO (S3-compatible) for file storage
- **Container**: Docker + docker-compose
- **Testing**: pytest with async support
- **Code Quality**: Black, isort, flake8

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── routes/          # API route handlers
│   │       │   ├── auth.py
│   │       │   ├── inference.py
│   │       │   ├── cctv.py
│   │       │   ├── industrial.py
│   │       │   ├── analytics.py
│   │       │   ├── models.py
│   │       │   └── admin.py
│   │       └── deps.py          # Shared dependencies
│   ├── core/
│   │   ├── config.py            # Configuration management
│   │   ├── logging.py           # Logging setup
│   │   └── security.py          # Auth utilities
│   ├── db/
│   │   ├── base.py             # SQLAlchemy base
│   │   ├── models.py           # Database models
│   │   └── session.py          # DB session factory
│   ├── services/
│   │   ├── hf_client.py        # HuggingFace API client
│   │   ├── mistral_client.py   # Mistral AI client
│   │   ├── classifier.py       # Image classification
│   │   ├── embeddings.py       # Semantic matching
│   │   ├── cctv_processor.py   # Video processing
│   │   ├── forecast.py         # Forecasting service
│   │   ├── optimizer.py        # Route optimization
│   │   └── audit_report.py     # Report generation
│   ├── tasks/
│   │   ├── celery_app.py       # Celery configuration
│   │   └── tasks.py            # Background tasks
│   ├── schemas/                # Pydantic models
│   └── main.py                 # FastAPI app entry
├── migrations/                 # Alembic migrations
├── scripts/
│   ├── seed_data.py           # Database seeding
│   ├── import_dataset.py      # Dataset import
│   └── demo_setup.sh          # Quick demo setup
├── tests/
│   ├── unit/                  # Unit tests
│   └── integration/           # Integration tests
├── storage/                   # Local file storage
├── logs/                      # Application logs
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites

- Docker & Docker Compose
- Python 3.11+ (for local development)
- HuggingFace API token
- Mistral AI API key

### 1. Clone and Configure

```bash
# Clone the repository
cd opencity-ai-hub/backend

# Copy environment example
cp .env.example .env

# Edit .env and add your API keys
nano .env
```

**Required Environment Variables:**
```env
HF_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MISTRAL_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
```

### 2. Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

**Services Started:**
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Flower (Celery Monitor)**: http://localhost:5555
- **MinIO Console**: http://localhost:9001
- **PgAdmin** (optional): http://localhost:5050

### 3. Initialize Database

```bash
# Run migrations
docker-compose exec api alembic upgrade head

# Seed demo data
docker-compose exec api python scripts/seed_data.py

# Or use the quick demo setup
docker-compose exec api bash scripts/demo_setup.sh
```

### 4. Local Development (Without Docker)

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Start PostgreSQL and Redis (required)
# Then run migrations
alembic upgrade head

# Start Celery worker (in separate terminal)
celery -A app.tasks.celery_app worker --loglevel=info

# Start API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 API Documentation

### Authentication

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "citizen"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "user": { "id": 1, "name": "John Doe", ...},
  "token": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer"
  }
}
```

### Image Inference (Waste Classifier)

#### Upload Image for Classification
```http
POST /api/v1/inference/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: (binary)
location: "Ward 5, Mumbai"
source: "mobile_app"

Response:
{
  "job_id": "img_abc123",
  "status": "queued",
  "message": "Image uploaded and queued for processing"
}
```

#### Check Classification Status
```http
GET /api/v1/inference/image/{job_id}
Authorization: Bearer {token}

Response:
{
  "job_id": "img_abc123",
  "status": "completed",
  "predicted_label": "plastic_bottle",
  "confidence": 0.95,
  "result": {
    "label": "plastic_bottle",
    "score": 0.95,
    "bounding_boxes": [...]
  },
  "image_url": "http://minio:9000/wasteiq/img_abc123.jpg",
  "processing_time": 1.23
}
```

### Chat (TrashGPT)

```http
POST /api/v1/inference/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "model": "mistral-tiny",
  "messages": [
    {"role": "user", "content": "How do I recycle batteries?"}
  ],
  "user_id": 1
}

Response:
{
  "id": "chat_xyz789",
  "model": "mistral-tiny",
  "response": "Batteries should be recycled at designated collection points...",
  "finish_reason": "stop"
}
```

### CCTV Video Audit

#### Upload Video
```http
POST /api/v1/cctv/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: (video binary)
ward_id: "ward_5"
location: {"lat": 19.0760, "lon": 72.8777}

Response:
{
  "job_id": "cctv_def456",
  "status": "queued"
}
```

#### Check Processing Status
```http
GET /api/v1/cctv/status/{job_id}

Response:
{
  "job_id": "cctv_def456",
  "status": "processing",
  "processed": false,
  "frames_processed": 45,
  "progress_percent": 30.5,
  "events_detected": [
    {
      "timestamp": "2024-01-15T10:30:45",
      "event_type": "illegal_dumping",
      "confidence": 0.89
    }
  ]
}
```

### Industrial Exchange

#### Create Listing
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
    "person": "Manager"
  },
  "description": "Clean PET plastic scraps from production"
}
```

#### Find Matches
```http
GET /api/v1/industrial/match?listing_id=123

Response:
{
  "source_listing_id": 123,
  "matches": [
    {
      "listing_id": 456,
      "similarity_score": 0.92,
      "distance_km": 5.2,
      "combined_score": 0.89,
      "listing": {...}
    }
  ],
  "total_matches": 5
}
```

### Municipal Analytics

#### Get Summary
```http
GET /api/v1/analytics/summary?start=2024-01-01&end=2024-01-31&ward=ward_5

Response:
{
  "period_start": "2024-01-01",
  "period_end": "2024-01-31",
  "ward_id": "ward_5",
  "total_collected_kg": 125000,
  "segregation_rate": 78.5,
  "recycling_rate": 45.2,
  "overflow_events": 12,
  "illegal_dumping_events": 3,
  "top_waste_types": [
    {"waste_type": "organic", "count": 450, "percentage": 45.0}
  ],
  "daily_average_kg": 4032.25
}
```

#### Create Forecast
```http
POST /api/v1/analytics/forecast
Content-Type: application/json

{
  "ward_id": "ward_5",
  "forecast_type": "waste_generation",
  "forecast_horizon_days": 30
}

Response:
{
  "id": 789,
  "ward_id": "ward_5",
  "forecasts": [
    {
      "date": "2024-02-01",
      "predicted_value": 4100,
      "lower_bound": 3900,
      "upper_bound": 4300
    }
  ],
  "model_used": "prophet"
}
```

### Route Optimization

```http
POST /api/v1/routes/optimize
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
      "time_window_end": "12:00"
    }
  ],
  "vehicle_capacity_kg": 5000,
  "num_vehicles": 2
}

Response:
{
  "route_id": 101,
  "vehicle_routes": [
    {
      "vehicle_id": "V1",
      "stops": [...],
      "total_distance_km": 25.5,
      "total_duration_minutes": 145,
      "total_load_kg": 2400,
      "utilization_percent": 48.0
    }
  ],
  "total_distance_km": 45.2
}
```

## 🔐 Authentication & Roles

The API uses JWT bearer tokens. All protected endpoints require an `Authorization: Bearer {token}` header.

**User Roles:**
- `admin`: Full system access
- `municipal_officer`: Analytics, reports, system monitoring
- `collector`: Route access, collection updates
- `recycler`: Industrial exchange participation
- `citizen`: Basic waste reporting and chat

## 🧪 Running Tests

```bash
# Run all tests with coverage
pytest

# Run specific test file
pytest tests/unit/test_hf_client.py

# Run with verbose output
pytest -v

# Generate coverage report
pytest --cov=app --cov-report=html
```

## 📊 Monitoring

### Celery Tasks (Flower)
- URL: http://localhost:5555
- Monitor background task processing, failures, and performance

### Database (PgAdmin)
```bash
# Start PgAdmin (optional profile)
docker-compose --profile tools up pgadmin

# Access at http://localhost:5050
# Email: admin@wasteiq.local
# Password: admin
```

### Application Logs
```bash
# View API logs
docker-compose logs -f api

# View Celery worker logs
docker-compose logs -f celery-worker

# View all logs
docker-compose logs -f
```

## 🔄 Background Tasks

**Celery Tasks:**
- `process_image`: Image classification with HuggingFace
- `process_video`: CCTV frame extraction and event detection
- `run_forecast`: Generate waste forecasts using Prophet
- `generate_route_plans`: Optimize collection routes
- `generate_audit_report`: Create PDF/JSON audit reports

## 🚢 Deployment

### Production Considerations

1. **Security**:
   - Change `SECRET_KEY` to a strong random value
   - Use strong database passwords
   - Enable HTTPS/TLS
   - Set `DEBUG=False`

2. **Scaling**:
   - Increase Celery worker concurrency
   - Add Redis sentinel for HA
   - Use managed PostgreSQL (RDS, Cloud SQL)
   - Deploy behind load balancer

3. **Monitoring**:
   - Configure Sentry DSN for error tracking
   - Set up Prometheus metrics
   - Enable structured logging

### Docker Image Build

```bash
# Build production image
docker build -t wasteiq-api:latest .

# Push to registry
docker tag wasteiq-api:latest registry.example.com/wasteiq-api:latest
docker push registry.example.com/wasteiq-api:latest
```

## 🤝 Contributing

```bash
# Format code
black app/
isort app/

# Lint
flake8 app/

# Type check
mypy app/
```

## 📄 License

[Your License Here]

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps db

# View database logs
docker-compose logs db

# Reset database
docker-compose down -v
docker-compose up -d db
docker-compose exec api alembic upgrade head
```

### Celery Worker Not Processing
```bash
# Check worker logs
docker-compose logs celery-worker

# Restart worker
docker-compose restart celery-worker

# Check Redis connection
docker-compose exec redis redis-cli ping
```

### API Errors
```bash
# View detailed logs
docker-compose logs -f api

# Check environment variables
docker-compose exec api env | grep HF_API_TOKEN

# Restart API
docker-compose restart api
```

## 📞 Support

For issues and questions:
- GitHub Issues: [repository-url]
- Email: support@wasteiq.local
- Docs: http://localhost:8000/docs

---

Built with ❤️ for sustainable cities
