@echo off
echo Starting EduJobs Connect - Complete System
echo ================================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB status...
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo MongoDB service not found or not running.
    echo Please ensure MongoDB is installed and running on your system.
    echo    Visit: https://docs.mongodb.com/manual/installation/
    echo    Command: net start MongoDB
    echo.
    pause
    exit /b 1
) else (
    echo MongoDB is running
)

echo.

REM Navigate to backend directory
cd backend

REM Check and install backend dependencies
echo Checking backend dependencies...
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
    if errorlevel 1 (
        echo Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed
)

echo.

REM Seed the database
echo Seeding database with sample data...
call npm run seed
if errorlevel 1 (
    echo  Database seeding had issues (might be normal if already seeded)
) else (
    echo Database seeded successfully
)

echo.

REM Start backend server in new window
echo Starting backend server...
echo ================================================
start "EduJobs Backend" cmd /k "npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Test backend health
echo Testing backend health...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo Backend health check failed
    echo  Backend might still be starting up...
    echo    If it doesn't start, check for errors in the backend window
) else (
    echo Backend is responding
)

echo.

REM Navigate to frontend directory
cd ../frontend

REM Check and install frontend dependencies
echo Checking frontend dependencies...
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
    if errorlevel 1 (
        echo Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed
)

echo.

REM Start frontend server
echo Starting frontend development server...
echo ================================================
start "EduJobs Frontend" cmd /k "npm run dev"

echo.
echo EduJobs Connect is starting up!
echo ================================================
echo System Status:
echo    Backend API: http://localhost:5000
echo    Frontend App: http://localhost:3001
echo.
echo Test Login Credentials:
echo    Admin:    admin@edujobsconnect.rw / Admin123!
echo    Student:  jean@example.com / Student123!
echo    Employer: employer@company.com / Employer123!
echo.
echo Quick Actions:
echo    - Open http://localhost:3001 in your browser
echo    - Use the test credentials above to login
echo    - Check browser console for any errors
echo    - If login fails, run troubleshoot-login.bat
echo.
echo Troubleshooting:
echo    - If login fails, clear browser data and try again
echo    - Check that both servers are running
echo    - Verify MongoDB is accessible
echo    - Run troubleshoot-login.bat for detailed diagnostics
echo.
echo Both servers are starting in separate windows.
echo    Close this window or press any key to continue...
pause >nul

exit /b 0