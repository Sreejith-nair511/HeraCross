"""Inference service combining object detection with Mistral AI analysis."""
import logging
import random
from typing import Dict, List, Any, Optional
import asyncio
import base64
from PIL import Image
import io

from app.services.mistral_client import mistral_client
from app.services.hf_client import hf_client
from app.core.config import settings

logger = logging.getLogger(__name__)


class InferenceService:
    """Service for combining object detection with AI analysis."""
    
    def __init__(self):
        """Initialize inference service."""
        self.mistral_client = mistral_client
        self.hf_client = hf_client
        # Waste categories for Bangalore context
        self.waste_categories = [
            "plastic", "organic", "paper", "glass", "metal", 
            "electronic", "hazardous", "textile", "construction"
        ]
    
    async def detect_and_analyze_waste(
        self,
        image_bytes: bytes,
        user_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Detect waste objects in an image and provide AI analysis.
        
        Args:
            image_bytes: Image file bytes
            user_prompt: Optional user question about the image
            
        Returns:
            Combined detection and analysis results
        """
        # Step 1: Detect objects in the image
        detection_results = await self._detect_objects(image_bytes)
        
        # Step 2: Analyze results with Mistral AI
        analysis_results = await self._analyze_with_mistral(detection_results, user_prompt)
        
        return {
            "detection_results": detection_results,
            "analysis_results": analysis_results,
            "combined_insights": self._combine_results(detection_results, analysis_results)
        }
    
    async def _detect_objects(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Detect objects in an image using the YOLO model.
        
        Args:
            image_bytes: Image file bytes
            
        Returns:
            Object detection results
        """
        try:
            # For now, we'll use a placeholder - in a real implementation,
            # this would call the actual YOLO model
            # This is where we would integrate the provided YOLO model file
            
            # As a placeholder, let's use HuggingFace detection
            # In a real implementation, we would load and use the YOLO model directly
            results = await self.hf_client.detect_objects(
                image_bytes, 
                model_name=settings.DEFAULT_DETECTION_MODEL
            )
            
            return {
                "objects": results,
                "model_used": settings.DEFAULT_DETECTION_MODEL,
                "status": "success"
            }
        except Exception as e:
            logger.error(f"Object detection failed: {str(e)}")
            return {
                "objects": [],
                "model_used": settings.DEFAULT_DETECTION_MODEL,
                "status": "error",
                "error": str(e)
            }
    
    async def _analyze_with_mistral(
        self, 
        detection_results: Dict[str, Any], 
        user_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyze detection results with Mistral AI.
        
        Args:
            detection_results: Results from object detection
            user_prompt: Optional user question
            
        Returns:
            AI analysis results
        """
        try:
            # Extract detected objects
            objects = detection_results.get("objects", [])
            object_labels = [obj.get("label", "unknown") for obj in objects]
            
            # Create system prompt for waste analysis
            system_prompt = self._get_waste_analysis_prompt()
            
            # Create user message
            if user_prompt:
                user_message = f"{user_prompt}\n\nDetected objects: {', '.join(object_labels) if object_labels else 'None'}"
            else:
                user_message = f"Analyze this waste classification result. Detected objects: {', '.join(object_labels) if object_labels else 'None'}"
            
            # Get analysis from Mistral
            response = await self.mistral_client.chat_completion_with_context(
                user_message=user_message,
                system_prompt=system_prompt,
                temperature=0.7
            )
            
            return {
                "analysis": response.get("response", ""),
                "model_used": response.get("model", "mistral-tiny"),
                "status": "success"
            }
        except Exception as e:
            logger.error(f"Mistral analysis failed: {str(e)}")
            return {
                "analysis": "",
                "model_used": "mistral-tiny",
                "status": "error",
                "error": str(e)
            }
    
    def _get_waste_analysis_prompt(self) -> str:
        """
        Get the system prompt for waste analysis.
        
        Returns:
            System prompt string
        """
        return """You are TrashGPT, an AI assistant specializing in waste management and environmental sustainability, particularly for Bangalore, India. 
You analyze images of waste and provide insights about:

1. Waste classification and proper disposal methods (specific to Bangalore's waste management system)
2. Recycling opportunities and best practices
3. Environmental impact assessment
4. Waste reduction suggestions
5. Circular economy principles

When analyzing waste detection results:
1. Identify the types of waste detected
2. Recommend appropriate disposal methods for each type according to Bangalore's waste management guidelines
3. Suggest recycling or reuse opportunities
4. Highlight any potentially hazardous materials
5. Provide actionable advice for waste reduction

Keep responses concise but informative, and maintain a professional yet friendly tone.
Include specific information about Bangalore's waste management system when relevant."""

    def _combine_results(
        self, 
        detection_results: Dict[str, Any], 
        analysis_results: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Combine detection and analysis results into actionable insights.
        
        Args:
            detection_results: Object detection results
            analysis_results: AI analysis results
            
        Returns:
            Combined insights
        """
        objects = detection_results.get("objects", [])
        analysis = analysis_results.get("analysis", "")
        
        # Extract key information
        object_types = list(set([obj.get("label", "unknown") for obj in objects]))
        
        # Add Bangalore-specific waste categories
        waste_type = self._predict_waste_type(object_types)
        
        return {
            "detected_objects": object_types,
            "total_objects": len(objects),
            "ai_insights": analysis,
            "recommendations": self._generate_recommendations(object_types),
            "waste_type": waste_type,
            "confidence": round(random.uniform(0.7, 0.95), 2)  # Simulated confidence
        }
    
    def _predict_waste_type(self, object_types: List[str]) -> str:
        """
        Predict the primary waste type based on detected objects.
        
        Args:
            object_types: List of detected object types
            
        Returns:
            Predicted waste type
        """
        # Simple rule-based prediction (in a real implementation, this would use ML)
        type_counts = {category: 0 for category in self.waste_categories}
        
        for obj_type in object_types:
            obj_type_lower = obj_type.lower()
            if "plastic" in obj_type_lower or "bottle" in obj_type_lower or "bag" in obj_type_lower:
                type_counts["plastic"] += 1
            elif "food" in obj_type_lower or "organic" in obj_type_lower or "fruit" in obj_type_lower or "vegetable" in obj_type_lower:
                type_counts["organic"] += 1
            elif "paper" in obj_type_lower or "cardboard" in obj_type_lower or "newspaper" in obj_type_lower:
                type_counts["paper"] += 1
            elif "glass" in obj_type_lower or "bottle" in obj_type_lower:
                type_counts["glass"] += 1
            elif "metal" in obj_type_lower or "can" in obj_type_lower or "aluminum" in obj_type_lower:
                type_counts["metal"] += 1
            elif "electronic" in obj_type_lower or "phone" in obj_type_lower or "battery" in obj_type_lower:
                type_counts["electronic"] += 1
            elif "hazardous" in obj_type_lower or "chemical" in obj_type_lower or "paint" in obj_type_lower:
                type_counts["hazardous"] += 1
            elif "cloth" in obj_type_lower or "textile" in obj_type_lower or "fabric" in obj_type_lower:
                type_counts["textile"] += 1
            elif "construction" in obj_type_lower or "wood" in obj_type_lower or "brick" in obj_type_lower:
                type_counts["construction"] += 1
        
        # Return the category with the highest count, or a random category if all are zero
        max_count = 0
        max_category = self.waste_categories[0]
        
        for category, count in type_counts.items():
            if count > max_count:
                max_count = count
                max_category = category
                
        if max_count > 0:
            return max_category
        else:
            return random.choice(self.waste_categories)
    
    def _generate_recommendations(self, object_types: List[str]) -> List[str]:
        """
        Generate waste management recommendations based on detected objects.
        
        Args:
            object_types: List of detected object types
            
        Returns:
            List of recommendations
        """
        recommendations = []
        
        # Bangalore-specific recommendations
        for obj_type in object_types:
            obj_type_lower = obj_type.lower()
            if "plastic" in obj_type_lower:
                recommendations.append("Plastic items: Clean and dry before placing in blue recycling bins. For Bangalore: Check BBMP guidelines for plastic waste segregation.")
            elif "food" in obj_type_lower or "organic" in obj_type_lower:
                recommendations.append("Organic waste: Can be composted at home or given to local waste pickers. In Bangalore: Use green bins for wet waste.")
            elif "paper" in obj_type_lower:
                recommendations.append("Paper products: Keep dry and place in blue recycling bins. In Bangalore: Ensure paper is not contaminated with food.")
            elif "glass" in obj_type_lower:
                recommendations.append("Glass items: Place carefully in recycling bins. In Bangalore: Some areas have special glass collection points.")
            elif "metal" in obj_type_lower:
                recommendations.append("Metal items: Highly recyclable. In Bangalore: Can be sold to local scrap dealers or placed in recycling bins.")
            elif "electronic" in obj_type_lower:
                recommendations.append("Electronic waste: Do not dispose in regular bins. In Bangalore: Take to authorized e-waste collection centers.")
            elif "hazardous" in obj_type_lower:
                recommendations.append("Hazardous waste: Handle with care. In Bangalore: Contact BBMP for proper disposal guidelines.")
            elif "cloth" in obj_type_lower or "textile" in obj_type_lower:
                recommendations.append("Textile waste: Can be donated or sold. In Bangalore: Some NGOs accept used clothing.")
            else:
                recommendations.append(f"{obj_type}: Please check local recycling guidelines. In Bangalore: Segregate as dry waste if recyclable.")
        
        if not recommendations:
            recommendations.append("Please sort waste according to BBMP guidelines: Wet waste (organic) in green bins, Dry waste in blue bins, and Hazardous waste separately.")
        
        return recommendations


# Global service instance
inference_service = InferenceService()