#!/usr/bin/env python3
"""
Test script to verify Mistral API integration.
"""
import asyncio
import sys
import os

# Load environment variables from .env file
env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            if line.strip() and not line.startswith('#') and '=' in line:
                key, value = line.strip().split('=', 1)
                os.environ[key] = value

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.mistral_client import mistral_client


async def test_mistral_connection():
    """Test the Mistral API connection."""
    print("Testing Mistral API connection...")
    
    # Check if API key is loaded
    api_key = os.getenv('MISTRAL_API_KEY')
    print(f"API Key loaded: {api_key is not None and len(api_key) > 0}")
    if api_key:
        print(f"API Key length: {len(api_key)}")
    
    try:
        # Test chat completion
        response = await mistral_client.chat_completion_with_context(
            user_message="What are the best practices for recycling plastic waste?",
            system_prompt="You are TrashGPT, an AI assistant specializing in waste management and environmental sustainability.",
            temperature=0.7
        )
        
        print("✅ Mistral API connection successful!")
        print(f"Model: {response.get('model', 'Unknown')}")
        print(f"Response: {response.get('response', 'No response')}")
        
    except Exception as e:
        print(f"❌ Mistral API connection failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
    return True


async def main():
    """Main test function."""
    print("OpenCity AI Hub - Mistral API Integration Test")
    print("=" * 50)
    
    success = await test_mistral_connection()
    
    if success:
        print("\n🎉 All tests passed! The Mistral API integration is working correctly.")
    else:
        print("\n💥 Tests failed. Please check your configuration and API key.")
    
    return success


if __name__ == "__main__":
    asyncio.run(main())