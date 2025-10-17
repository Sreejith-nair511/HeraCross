@echo off
echo Starting OpenCity AI Hub Backend...
echo.
echo Make sure you have installed Python dependencies with: pip install -r requirements.txt
echo.
echo Navigate to http://localhost:8000/docs for API documentation
echo Press Ctrl+C to stop the backend server.
echo.
cd backend
python -m app.main
pause