#!/usr/bin/env python3
"""
Simple script to run the backend locally for showcasing purposes.
This avoids Docker complications and runs the service directly.
"""

import os
import sys
import subprocess

def main():
    # Change to backend directory
    backend_dir = os.path.join(os.path.dirname(__file__))
    os.chdir(backend_dir)
    
    # Set environment variables for local development
    os.environ.setdefault("DATABASE_URL", "sqlite:///./wasteiq.db")
    os.environ.setdefault("SECRET_KEY", "showcase-secret-key-for-demo-purposes-only-change-in-production")
    os.environ.setdefault("DEBUG", "True")
    
    print("Starting WasteIQ Backend for showcase...")
    print("Database: SQLite (local file)")
    print("API Docs: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    print("Press CTRL+C to stop\n")
    
    # Run the FastAPI application with showcase configuration
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app.main_showcase:app", 
            "--host", "0.0.0.0", 
            "--port", "8000",
            "--reload"
        ], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running the application: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nShutting down...")
        sys.exit(0)

if __name__ == "__main__":
    main()