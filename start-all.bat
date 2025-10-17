@echo off
echo Starting OpenCity AI Hub (Frontend and Backend)...
echo.

echo Please make sure you have:
echo 1. Installed frontend dependencies with: pnpm install
echo 2. Installed backend dependencies with: pip install -r backend/requirements.txt
echo.

echo The frontend will be available at: http://localhost:3000
echo The backend API will be available at: http://localhost:8000
echo Backend API docs: http://localhost:8000/docs
echo.

echo Starting backend in a new window...
start "Backend Server" /D "%cd%" cmd /c "start-backend.bat"

echo Starting frontend in this window...
call start-frontend.bat

echo.
echo To stop both servers, close both command prompt windows.
pause