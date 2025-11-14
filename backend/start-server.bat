@echo off
title EduJobs Backend Server
color 0A

echo ==========================================
echo   EDUJOBS CONNECT - BACKEND SERVER
echo ==========================================
echo.

REM Check if MongoDB is running
echo [1/4] Checking MongoDB status...
sc query MongoDB | find "RUNNING" > nul
if errorlevel 1 (
    echo MongoDB is not running. Starting MongoDB...
    net start MongoDB
    if errorlevel 1 (
        echo ERROR: Failed to start MongoDB!
        echo Please ensure MongoDB is installed and configured.
        pause
        exit /b 1
    )
    echo MongoDB started successfully!
) else (
    echo MongoDB is running.
)
echo.

REM Install dependencies if node_modules doesn't exist
echo [2/4] Checking dependencies...
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
) else (
    echo Dependencies already installed.
)
echo.

REM Seed the database
echo [3/4] Seeding database...
echo This will clear existing data and create sample data.
call npm run seed
if errorlevel 1 (
    echo WARNING: Seeding may have failed. Continuing anyway...
)
echo.

REM Start the development server
echo [4/4] Starting backend server...
echo.
echo ==========================================
echo   SERVER INFORMATION
echo ==========================================
echo API:    http://localhost:5000
echo Health: http://localhost:5000/api/health
echo.
echo LOGIN CREDENTIALS:
echo   Admin:    admin@edujobsconnect.rw / Admin123!
echo   Student:  jean@example.com / Student123!
echo   Employer: employer@company.com / Employer123!
echo ==========================================
echo.

call npm run dev
