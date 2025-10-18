# WasteIQ Backend - Showcase Version

This is a simplified version of the WasteIQ backend for demonstration purposes.

## Quick Start (Local Development)

1. **Install Python dependencies**:
```bash
pip install -r requirements.showcase.txt
```

2. **Run the application**:
```bash
# Option 1: Using the run script
python run_local.py

# Option 2: Direct uvicorn command
uvicorn app.main_showcase:app --host 0.0.0.0 --port 8000 --reload
```

3. **Access the application**:
- API Documentation: http://localhost:8000/docs
- Health Check: http://localhost:8000/health
- Root Endpoint: http://localhost:8000/

## Features in Showcase Version

- Simplified FastAPI backend
- SQLite database (no PostgreSQL required)
- Basic authentication endpoints
- Health check endpoint
- API documentation

## Removed Components

For simplicity, the following components have been removed:
- Prophet (time series forecasting)
- OR-Tools (optimization algorithms)
- Redis/Celery (background tasks)
- Complex AI/ML dependencies
- MinIO/S3 storage
- Advanced analytics

## Environment Variables

For showcase purposes, the application will use default values:
- `DATABASE_URL`: sqlite:///./wasteiq.db
- `SECRET_KEY`: showcase-secret-key-for-demo-purposes-only-change-in-production
- `DEBUG`: True

## API Endpoints

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /health` - Health check
- `GET /` - API information

## Docker Deployment

For Docker deployment, use the showcase Dockerfile:
```bash
docker build -f Dockerfile.showcase -t wasteiq-showcase .
docker run -p 8000:8000 wasteiq-showcase
```

## Note

This showcase version is intended for demonstration purposes only and lacks the full functionality of the production version. It uses SQLite instead of PostgreSQL and removes complex dependencies to make deployment easier.