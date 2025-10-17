"""
Seed demo data for WasteIQ Backend.
Creates demo users, models, and sample listings.
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.security import get_password_hash
from app.db.models import User, UserRole, ModelRegistry, IndustrialListing, ExchangeStatus
from app.db.session import SessionLocal
from datetime import datetime


def seed_users(db):
    """Create demo users."""
    print("Creating demo users...")
    
    users = [
        {
            "name": "Admin User",
            "email": "admin@wasteiq.local",
            "password": "Admin@123",
            "role": UserRole.ADMIN
        },
        {
            "name": "Municipal Officer",
            "email": "officer@wasteiq.local",
            "password": "Officer@123",
            "role": UserRole.MUNICIPAL_OFFICER
        },
        {
            "name": "Waste Collector",
            "email": "collector@wasteiq.local",
            "password": "Collector@123",
            "role": UserRole.COLLECTOR
        },
        {
            "name": "Recycler Company",
            "email": "recycler@wasteiq.local",
            "password": "Recycler@123",
            "role": UserRole.RECYCLER
        },
        {
            "name": "Citizen User",
            "email": "citizen@wasteiq.local",
            "password": "Citizen@123",
            "role": UserRole.CITIZEN
        }
    ]
    
    for user_data in users:
        # Check if user exists
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if existing:
            print(f"  ⚠️  User already exists: {user_data['email']}")
            continue
        
        user = User(
            name=user_data["name"],
            email=user_data["email"],
            hashed_password=get_password_hash(user_data["password"]),
            role=user_data["role"],
            is_active=True
        )
        db.add(user)
        print(f"  ✅ Created user: {user_data['email']}")
    
    db.commit()


def seed_models(db):
    """Create model registry entries."""
    print("Creating model registry...")
    
    models = [
        {
            "name": "google/vit-base-patch16-224",
            "model_type": "classification",
            "provider": "huggingface",
            "description": "Vision Transformer for image classification",
            "tags": ["vision", "classification", "waste"],
            "is_active": True
        },
        {
            "name": "hustvl/yolos-tiny",
            "model_type": "detection",
            "provider": "huggingface",
            "description": "YOLO-based object detection model",
            "tags": ["vision", "detection", "cctv"],
            "is_active": True
        },
        {
            "name": "sentence-transformers/all-MiniLM-L6-v2",
            "model_type": "embedding",
            "provider": "huggingface",
            "description": "Sentence embeddings for semantic matching",
            "tags": ["nlp", "embedding", "matching"],
            "is_active": True
        },
        {
            "name": "mistral-tiny",
            "model_type": "chat",
            "provider": "mistral",
            "description": "Mistral AI chat model for TrashGPT",
            "tags": ["chat", "nlp", "assistant"],
            "is_active": True
        }
    ]
    
    for model_data in models:
        # Check if model exists
        existing = db.query(ModelRegistry).filter(ModelRegistry.name == model_data["name"]).first()
        if existing:
            print(f"  ⚠️  Model already exists: {model_data['name']}")
            continue
        
        model = ModelRegistry(**model_data)
        db.add(model)
        print(f"  ✅ Created model: {model_data['name']}")
    
    db.commit()


def seed_industrial_listings(db):
    """Create sample industrial listings."""
    print("Creating sample industrial listings...")
    
    listings = [
        {
            "company_name": "ABC Plastics Manufacturing",
            "waste_type": "plastic_scraps",
            "quantity": 500,
            "unit": "kg",
            "location": "Industrial Area Phase 1, Mumbai",
            "location_coords": {"lat": 19.0760, "lon": 72.8777},
            "contact_info": {
                "email": "contact@abcplastics.com",
                "phone": "+91-9876543210",
                "person": "Ramesh Kumar"
            },
            "description": "Clean PET plastic scraps from bottle manufacturing",
            "status": ExchangeStatus.AVAILABLE
        },
        {
            "company_name": "XYZ Electronics",
            "waste_type": "e_waste",
            "quantity": 200,
            "unit": "kg",
            "location": "Tech Park, Bangalore",
            "location_coords": {"lat": 12.9716, "lon": 77.5946},
            "contact_info": {
                "email": "waste@xyzelectronics.com",
                "phone": "+91-9876543211",
                "person": "Priya Sharma"
            },
            "description": "PCB boards and electronic components for recycling",
            "status": ExchangeStatus.AVAILABLE
        },
        {
            "company_name": "Green Metals Ltd",
            "waste_type": "metal_scraps",
            "quantity": 1000,
            "unit": "kg",
            "location": "Industrial Estate, Delhi",
            "location_coords": {"lat": 28.7041, "lon": 77.1025},
            "contact_info": {
                "email": "info@greenmetals.com",
                "phone": "+91-9876543212",
                "person": "Amit Patel"
            },
            "description": "Mixed metal scraps - aluminum and steel",
            "status": ExchangeStatus.AVAILABLE
        }
    ]
    
    for listing_data in listings:
        # Check if listing exists
        existing = db.query(IndustrialListing).filter(
            IndustrialListing.company_name == listing_data["company_name"]
        ).first()
        if existing:
            print(f"  ⚠️  Listing already exists: {listing_data['company_name']}")
            continue
        
        listing = IndustrialListing(**listing_data)
        db.add(listing)
        print(f"  ✅ Created listing: {listing_data['company_name']}")
    
    db.commit()


def main():
    """Main seeding function."""
    print("\n🌱 WasteIQ Backend - Database Seeding")
    print("=" * 40)
    
    db = SessionLocal()
    
    try:
        seed_users(db)
        seed_models(db)
        seed_industrial_listings(db)
        
        print("\n✨ Database seeding complete!")
        print("\nDemo credentials:")
        print("  Admin: admin@wasteiq.local / Admin@123")
        print("  Officer: officer@wasteiq.local / Officer@123")
        print("  Collector: collector@wasteiq.local / Collector@123")
        print("  Recycler: recycler@wasteiq.local / Recycler@123")
        print("  Citizen: citizen@wasteiq.local / Citizen@123")
        print()
    
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        db.rollback()
        sys.exit(1)
    
    finally:
        db.close()


if __name__ == "__main__":
    main()
