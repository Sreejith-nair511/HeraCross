"""API routes for inference operations."""
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Body
from typing import Optional, List
import logging

from app.services.inference_service import inference_service
from app.services.mistral_client import mistral_client
from app.schemas.inference import ImageInferenceResponse, ImageJobStatusResponse, ChatMessage
from app.db.models import JobStatus
from app.api.v1.deps import get_optional_user  # Changed from get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/waste-analysis", response_model=ImageInferenceResponse)
async def analyze_waste_image(
    image: UploadFile = File(...),
    question: Optional[str] = Form(None),
    current_user: dict = Depends(get_optional_user)  # Changed to optional
):
    """
    Analyze a waste image using object detection and Mistral AI.
    
    Args:
        image: Uploaded image file
        question: Optional user question about the image
        current_user: Current authenticated user (optional)
        
    Returns:
        Analysis results including detected objects and AI insights
    """
    try:
        # Read image bytes
        image_bytes = await image.read()
        
        # Validate file type
        if image.content_type not in ["image/jpeg", "image/png", "image/webp"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only JPEG, PNG, and WebP images are supported."
            )
        
        # Process image with detection and analysis
        results = await inference_service.detect_and_analyze_waste(image_bytes, question)
        
        # Return results
        return ImageInferenceResponse(
            job_id="immediate_result",  # For immediate results, no job queuing
            status=JobStatus.COMPLETED
        )
        
    except Exception as e:
        logger.error(f"Error analyzing waste image: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing image: {str(e)}"
        )


@router.post("/chat-with-results")
async def chat_with_waste_analysis(
    image_job_id: str = Form(...),
    question: str = Form(...),
    current_user: dict = Depends(get_optional_user)  # Changed to optional
):
    """
    Continue conversation about previous waste analysis results.
    
    Args:
        image_job_id: ID of previous image analysis job
        question: User's follow-up question
        current_user: Current authenticated user (optional)
        
    Returns:
        AI response to the question
    """
    # This would typically retrieve previous results from a database
    # For now, we'll return a placeholder response
    return {
        "response": f"This is a simulated response to your question: {question}. "
                   "In a full implementation, this would use the context from job {image_job_id}.",
        "model_used": "mistral-tiny"
    }


@router.post("/chat")
async def chat_with_mistral(
    messages: List[ChatMessage] = Body(...),
    current_user: dict = Depends(get_optional_user)  # Changed to optional
):
    """
    Chat with Mistral AI directly.
    
    Args:
        messages: List of chat messages with role and content
        current_user: Current authenticated user (optional)
        
    Returns:
        AI response to the conversation
    """
    try:
        # Convert messages to the format expected by Mistral client
        mistral_messages = [{"role": msg.role, "content": msg.content} for msg in messages]
        
        # Get response from Mistral
        response = await mistral_client.chat_completion(mistral_messages)
        
        return {
            "response": response["response"],
            "model_used": response["model"]
        }
        
    except Exception as e:
        logger.error(f"Error chatting with Mistral: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error chatting with AI: {str(e)}"
        )


@router.post("/waste-analysis-result", response_model=ImageJobStatusResponse)
async def get_waste_analysis_result(
    image: UploadFile = File(...),
    question: Optional[str] = Form(None),
    current_user: dict = Depends(get_optional_user)  # Changed to optional
):
    """
    Analyze a waste image and return detailed results.
    
    Args:
        image: Uploaded image file
        question: Optional user question about the image
        current_user: Current authenticated user (optional)
        
    Returns:
        Detailed analysis results including detected objects and AI insights
    """
    try:
        # Read image bytes
        image_bytes = await image.read()
        
        # Validate file type
        if image.content_type not in ["image/jpeg", "image/png", "image/webp"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only JPEG, PNG, and WebP images are supported."
            )
        
        # Process image with detection and analysis
        results = await inference_service.detect_and_analyze_waste(image_bytes, question)
        
        # Return detailed results
        return ImageJobStatusResponse(
            job_id="immediate_result",
            status=JobStatus.COMPLETED,
            result=results.get("combined_insights", results)
        )
        
    except Exception as e:
        logger.error(f"Error analyzing waste image: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing image: {str(e)}"
        )