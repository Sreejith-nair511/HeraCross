"""
Mistral AI API Client.
Async wrapper for calling Mistral AI chat completion API.
"""
import asyncio
import logging
from typing import Any, AsyncIterator, Dict, List, Optional

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


class MistralClient:
    """Async client for Mistral AI API."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Mistral client.
        
        Args:
            api_key: Mistral API key (defaults to settings.MISTRAL_API_KEY)
        """
        self.api_key = api_key or settings.MISTRAL_API_KEY
        self.base_url = settings.MISTRAL_API_BASE_URL
        self.timeout = settings.MISTRAL_TIMEOUT
        self.max_retries = settings.MISTRAL_MAX_RETRIES
        
        if not self.api_key:
            logger.warning("Mistral API key not configured")
    
    async def _make_request(
        self,
        endpoint: str,
        payload: Dict[str, Any],
        retry_count: int = 0,
        stream: bool = False
    ) -> Any:
        """
        Make an async request to Mistral API with retry logic.
        
        Args:
            endpoint: API endpoint
            payload: Request payload
            retry_count: Current retry attempt
            stream: Whether to stream the response
        
        Returns:
            Response JSON or async iterator for streaming
        """
        url = f"{self.base_url}/{endpoint}"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        if stream:
            return self._stream_request(url, payload, headers)
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                return response.json()
            
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 429 or e.response.status_code >= 500:
                    if retry_count < self.max_retries:
                        wait_time = 2 ** retry_count
                        logger.warning(
                            f"Request failed with status {e.response.status_code}. "
                            f"Retrying in {wait_time}s... (attempt {retry_count + 1}/{self.max_retries})"
                        )
                        await asyncio.sleep(wait_time)
                        return await self._make_request(endpoint, payload, retry_count + 1, stream)
                
                logger.error(f"Mistral API error: {e.response.text}")
                raise
            
            except httpx.RequestError as e:
                logger.error(f"Request error: {str(e)}")
                raise
    
    async def _stream_request(
        self,
        url: str,
        payload: Dict[str, Any],
        headers: Dict[str, str]
    ) -> AsyncIterator[str]:
        """
        Stream chat completion response.
        
        Args:
            url: Request URL
            payload: Request payload
            headers: Request headers
        
        Yields:
            Response chunks
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            async with client.stream("POST", url, json=payload, headers=headers) as response:
                response.raise_for_status()
                async for chunk in response.aiter_text():
                    if chunk.strip():
                        yield chunk
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        stream: bool = False
    ) -> Dict[str, Any]:
        """
        Create a chat completion.
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            model: Model name (defaults to settings.DEFAULT_CHAT_MODEL)
            temperature: Sampling temperature (0.0 to 2.0)
            max_tokens: Maximum tokens to generate
            stream: Whether to stream the response
        
        Returns:
            Chat completion response
        """
        model_name = model or settings.DEFAULT_CHAT_MODEL
        
        payload = {
            "model": model_name,
            "messages": messages,
            "temperature": temperature
        }
        
        if max_tokens:
            payload["max_tokens"] = max_tokens
        
        if stream:
            payload["stream"] = True
        
        logger.info(f"Creating chat completion with model: {model_name}")
        
        result = await self._make_request("chat/completions", payload, stream=stream)
        
        if stream:
            return result  # Return async iterator
        
        # Extract response content
        if "choices" in result and len(result["choices"]) > 0:
            return {
                "id": result.get("id"),
                "model": result.get("model"),
                "response": result["choices"][0]["message"]["content"],
                "finish_reason": result["choices"][0].get("finish_reason", "stop"),
                "usage": result.get("usage")
            }
        
        logger.warning(f"Unexpected response format: {result}")
        return {
            "id": None,
            "model": model_name,
            "response": "",
            "finish_reason": "error",
            "usage": None
        }
    
    async def chat_completion_with_context(
        self,
        user_message: str,
        system_prompt: Optional[str] = None,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Create a chat completion with automatic context handling.
        
        Args:
            user_message: User's message
            system_prompt: Optional system prompt
            conversation_history: Optional previous messages
            **kwargs: Additional arguments for chat_completion
        
        Returns:
            Chat completion response
        """
        messages = []
        
        # Add system prompt if provided
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        # Add conversation history
        if conversation_history:
            messages.extend(conversation_history)
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        return await self.chat_completion(messages, **kwargs)
    
    def get_trashgpt_prompt(self) -> str:
        """
        Get the system prompt for TrashGPT assistant.
        
        Returns:
            System prompt string
        """
        return """You are TrashGPT, an AI assistant specializing in municipal waste management, 
recycling, and environmental sustainability. You provide helpful, accurate information about:

- Waste classification and segregation
- Recycling processes and best practices
- Municipal waste management systems
- Environmental impact and sustainability
- Waste-to-energy technologies
- Circular economy principles

You maintain a professional yet friendly tone, and can communicate in multiple languages. 
When answering questions:
1. Be concise but informative
2. Use simple language for complex concepts
3. Provide actionable advice when appropriate
4. Cite specific examples when relevant
5. Encourage sustainable practices

Always prioritize accuracy and practical applicability in your responses."""


# Global client instance
mistral_client = MistralClient()
