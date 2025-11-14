@echo off
echo ========================================
echo    Testing Frontend Startup
echo ========================================
echo.

echo Checking if backend is running...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend is not running!
    echo Please start backend first: cd backend && npm run dev
    pause
    exit /b 1
)

echo ✅ Backend is running

echo.
echo Starting frontend...
cd frontend
npm run dev

pause
