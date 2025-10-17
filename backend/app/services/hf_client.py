"""
HuggingFace Inference API Client.
Async wrapper for calling HuggingFace models via their inference API.
"""
import asyncio
import base64
import logging
from typing import Any, Dict, List, Optional

import httpx
from PIL import Image

from app.core.config import settings

logger = logging.getLogger(__name__)


class HuggingFaceClient:
    """Async client for HuggingFace Inference API."""
    
    def __init__(self, api_token: Optional[str] = None):
        """
        Initialize HuggingFace client.
        
        Args:
            api_token: HuggingFace API token (defaults to settings.HF_API_TOKEN)
        """
        self.api_token = api_token or settings.HF_API_TOKEN
        self.base_url = settings.HF_API_BASE_URL
        self.timeout = settings.HF_TIMEOUT
        self.max_retries = settings.HF_MAX_RETRIES
        
        if not self.api_token:
            logger.warning("HuggingFace API token not configured")
    
    async def _make_request(
        self,
        model_name: str,
        payload: Dict[str, Any],
        retry_count: int = 0
    ) -> Dict[str, Any]:
        """
        Make an async request to HuggingFace Inference API with retry logic.
        
        Args:
            model_name: Name of the HuggingFace model
            payload: Request payload
            retry_count: Current retry attempt
        
        Returns:
            Response JSON
        
        Raises:
            httpx.HTTPStatusError: If request fails after retries
        """
        url = f"{self.base_url}/{model_name}"
        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                return response.json()
            
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 429 or e.response.status_code >= 500:
                    # Retry on rate limit or server errors
                    if retry_count < self.max_retries:
                        wait_time = 2 ** retry_count  # Exponential backoff
                        logger.warning(
                            f"Request failed with status {e.response.status_code}. "
                            f"Retrying in {wait_time}s... (attempt {retry_count + 1}/{self.max_retries})"
                        )
                        await asyncio.sleep(wait_time)
                        return await self._make_request(model_name, payload, retry_count + 1)
                
                logger.error(f"HuggingFace API error: {e.response.text}")
                raise
            
            except httpx.RequestError as e:
                logger.error(f"Request error: {str(e)}")
                raise
    
    async def classify_image(
        self,
        image_bytes: bytes,
        model_name: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Classify an image using HuggingFace image classification model.
        
        Args:
            image_bytes: Image file bytes
            model_name: Model name (defaults to settings.DEFAULT_CLASSIFICATION_MODEL)
        
        Returns:
            List of classification results with labels and scores
        """
        model = model_name or settings.DEFAULT_CLASSIFICATION_MODEL
        
        # Encode image to base64
        image_b64 = base64.b64encode(image_bytes).decode()
        
        payload = {
            "inputs": image_b64
        }
        
        logger.info(f"Classifying image with model: {model}")
        
        result = await self._make_request(model, payload)
        
        # Normalize result format
        if isinstance(result, list) and len(result) > 0:
            # Most HF classification models return list of {label, score}
            return result
        
        return []
    
    async def detect_objects(
        self,
        image_bytes: bytes,
        model_name: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Detect objects in an image using HuggingFace object detection model.
        
        Args:
            image_bytes: Image file bytes
            model_name: Model name (defaults to settings.DEFAULT_DETECTION_MODEL)
        
        Returns:
            List of detected objects with bounding boxes and labels
        """
        model = model_name or settings.DEFAULT_DETECTION_MODEL
        
        # Encode image to base64
        image_b64 = base64.b64encode(image_bytes).decode()
        
        payload = {
            "inputs": image_b64
        }
        
        logger.info(f"Detecting objects with model: {model}")
        
        result = await self._make_request(model, payload)
        
        # Normalize result format
        if isinstance(result, list):
            return result
        
        return []
    
    async def generate_embeddings(
        self,
        text: str,
        model_name: Optional[str] = None
    ) -> List[float]:
        """
        Generate embeddings for text using HuggingFace embedding model.
        
        Args:
            text: Input text
            model_name: Model name (defaults to settings.DEFAULT_EMBEDDING_MODEL)
        
        Returns:
            Embedding vector as list of floats
        """
        model = model_name or settings.DEFAULT_EMBEDDING_MODEL
        
        payload = {
            "inputs": text,
            "options": {
                "wait_for_model": True
            }
        }
        
        logger.info(f"Generating embeddings with model: {model}")
        
        result = await self._make_request(model, payload)
        
        # Handle different response formats
        if isinstance(result, list):
            # Direct embedding vector
            return result
        elif isinstance(result, dict) and "embeddings" in result:
            return result["embeddings"]
        
        logger.warning(f"Unexpected embedding response format: {type(result)}")
        return []
    
    async def check_model_status(self, model_name: str) -> Dict[str, Any]:
        """
        Check if a model is loaded and ready.
        
        Args:
            model_name: Name of the HuggingFace model
        
        Returns:
            Model status information
        """
        url = f"{self.base_url}/{model_name}"
        headers = {
            "Authorization": f"Bearer {self.api_token}"
        }
        
        async with httpx.AsyncClient(timeout=10) as client:
            try:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                return {"status": "ready", "model": model_name}
            except httpx.HTTPStatusError as e:
                return {
                    "status": "error",
                    "model": model_name,
                    "error": str(e)
                }


# Global client instance
hf_client = HuggingFaceClient()
