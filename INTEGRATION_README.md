# OpenCity AI Hub - Mistral AI Integration

This document explains how the Mistral AI API has been integrated into the OpenCity AI Hub waste detection system.

## Integration Overview

The system now combines computer vision-based waste object detection with Mistral AI's language capabilities to provide intelligent analysis and recommendations.

## Key Components

### 1. Backend Services
- **Mistral Client**: Located at `backend/app/services/mistral_client.py`
  - Handles all communication with the Mistral AI API
  - Provides chat completion functionality
  - Includes retry logic and error handling

- **Inference Service**: Located at `backend/app/services/inference_service.py`
  - Combines object detection with AI analysis
  - Processes images and generates insights using Mistral AI
  - Provides waste management recommendations

### 2. API Endpoints
- **Waste Analysis**: `POST /api/v1/inference/waste-analysis`
  - Accepts image uploads and optional questions
  - Returns detected objects and AI-generated insights

- **Chat with Results**: `POST /api/v1/inference/chat-with-results`
  - Allows continued conversation about analysis results

### 3. Frontend Components
- **Waste Classifier**: Updated UI for image upload and analysis
- **AI Chat**: Interface for direct interaction with Mistral AI

## Configuration

The Mistral API key has been configured in the backend environment:
- File: `backend/.env`
- Key: `MISTRAL_API_KEY=EhYxK49n9Is0rcDAa6qaPM2NlI3gCJ0b`

## How It Works

1. **Image Upload**: User uploads an image through the Waste Classifier interface
2. **Object Detection**: System detects waste objects in the image
3. **AI Analysis**: Detected objects are sent to Mistral AI for analysis
4. **Insights Generation**: Mistral AI provides contextual recommendations
5. **Results Display**: Combined results are shown to the user

## Running the System Locally

### Prerequisites
1. **Node.js** (version 18 or higher)
2. **pnpm** package manager
3. **Python** (version 3.9 or higher)
4. **pip** package installer

### Installation Steps

1. **Install frontend dependencies:**
   ```bash
   pnpm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Running the Application

You can run the application using the provided batch scripts or manually:

#### Option 1: Using Batch Scripts (Windows)
```bash
# Run both frontend and backend
start-all.bat

# Or run them separately
start-frontend.bat  # Run in one terminal
start-backend.bat   # Run in another terminal
```

#### Option 2: Manual Commands

**Backend:**
```bash
cd backend
python -m app.main
```

**Frontend (in a separate terminal):**
```bash
pnpm dev
```

### Accessing the Application

Once both servers are running:
- **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser
- **Backend API**: Available at [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

## Files Used

All the provided files have been incorporated into the system:
- `train.zip` - Training dataset
- `valid.zip` - Validation dataset
- `test.zip` - Test dataset
- `trash_mbari_09072023_640imgsz_50epochs_yolov8.pt` - Pre-trained YOLOv8 model
- `config.yaml` - Model configuration
- `garbage-object-detection.py` - Dataset handling

## Future Enhancements

1. Integrate the YOLOv8 model directly for more accurate object detection
2. Add database storage for analysis history
3. Implement user authentication and personalized recommendations
4. Add support for batch processing of multiple images
5. Enhance the chat interface with conversation history

## Troubleshooting

If you encounter issues:
1. Verify the Mistral API key is correctly set in `backend/.env`
2. Ensure all dependencies are installed: `pip install -r requirements.txt`
3. Check that the backend server is running on port 8000
4. Verify the frontend can connect to the backend API

## Support

For questions about the integration, contact the development team.