@echo off
echo ========================================
echo    EduJobs Connect - Quick Fix
echo ========================================
echo.

echo [1/4] Installing backend dependencies (including axios)...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Seeding database...
cd ..\backend
call npm run seed
if %errorlevel% neq 0 (
    echo Database seeding failed - make sure MongoDB is running
    echo Run: net start MongoDB
    pause
    exit /b 1
)

echo.
echo [4/4] Testing authentication...
call npm run test-auth
if %errorlevel% neq 0 (
    echo Authentication test failed
    echo Check the errors above
    pause
    exit /b 1
)

echo.
echo ========================================
echo    ✅ QUICK FIX COMPLETE!
echo ========================================
echo.
echo Now you can:
echo 1. Start backend: cd backend && npm run dev
echo 2. Start frontend: cd frontend && npm run dev
echo 3. Visit: http://localhost:3001
echo.
echo Test credentials:
echo   Admin: admin@edujobsconnect.rw / Admin123!
echo   Student: jean@example.com / Student123!
echo   Employer: employer@company.com / Employer123!
echo.
pause
