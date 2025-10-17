#!/bin/bash
# Demo setup script for WasteIQ Backend

set -e

echo "🚀 WasteIQ Backend - Demo Setup"
echo "================================"

# Wait for database to be ready
echo "⏳ Waiting for database..."
python -c "
import time
from sqlalchemy import create_engine
from app.core.config import settings

max_retries = 30
for i in range(max_retries):
    try:
        engine = create_engine(settings.DATABASE_URL)
        conn = engine.connect()
        conn.close()
        print('✅ Database is ready!')
        break
    except Exception as e:
        if i == max_retries - 1:
            print(f'❌ Database connection failed: {e}')
            exit(1)
        print(f'Waiting... ({i+1}/{max_retries})')
        time.sleep(2)
"

# Run migrations
echo "📦 Running database migrations..."
alembic upgrade head

# Seed data
echo "🌱 Seeding demo data..."
python scripts/seed_data.py

# Create MinIO bucket
echo "🪣 Setting up storage bucket..."
python -c "
try:
    from minio import Minio
    from app.core.config import settings
    
    client = Minio(
        settings.MINIO_ENDPOINT,
        access_key=settings.MINIO_ACCESS_KEY,
        secret_key=settings.MINIO_SECRET_KEY,
        secure=settings.MINIO_SECURE
    )
    
    if not client.bucket_exists(settings.MINIO_BUCKET):
        client.make_bucket(settings.MINIO_BUCKET)
        print(f'✅ Created bucket: {settings.MINIO_BUCKET}')
    else:
        print(f'✅ Bucket already exists: {settings.MINIO_BUCKET}')
except Exception as e:
    print(f'⚠️  MinIO setup skipped: {e}')
"

echo ""
echo "✨ Demo setup complete!"
echo ""
echo "📍 API: http://localhost:8000"
echo "📖 Docs: http://localhost:8000/docs"
echo "🌸 Flower: http://localhost:5555"
echo "🗄️  MinIO: http://localhost:9001"
echo ""
echo "Demo Credentials:"
echo "  Admin: admin@wasteiq.local / Admin@123"
echo "  Officer: officer@wasteiq.local / Officer@123"
echo "  Citizen: citizen@wasteiq.local / Citizen@123"
echo ""
