import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = os.path.join(os.path.dirname(__file__), 'backend', '.env')
load_dotenv(env_path)

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

try:
    from app.core.config import settings
    print("Configuration loaded successfully!")
    print(f"Mistral API Key: '{settings.MISTRAL_API_KEY}'")
    print(f"API Key length: {len(settings.MISTRAL_API_KEY)}")
    
    # Also check the environment variable directly
    env_key = os.getenv('MISTRAL_API_KEY')
    print(f"Environment variable MISTRAL_API_KEY: '{env_key}'")
    print(f"Environment key length: {len(env_key) if env_key else 0}")
    
except Exception as e:
    print(f"Error loading configuration: {e}")
    import traceback
    traceback.print_exc()