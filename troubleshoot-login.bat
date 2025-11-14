@echo off
echo 🔧 EduJobs Connect - Login Troubleshooting Guide
echo ===================================================
echo.

echo This script will help diagnose and fix common login issues.
echo.

REM Test 1: Check if MongoDB is running
echo [1/6] Checking MongoDB connection...
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo ❌ MongoDB service not found or not running
    echo 💡 Solution: Install and start MongoDB
    echo    Visit: https://docs.mongodb.com/manual/installation/
    echo    Command: net start MongoDB
    echo.
) else (
    echo ✅ MongoDB is running
)

REM Test 2: Check backend server
echo.
echo [2/6] Testing backend server...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend server not responding
    echo 💡 Solution: Start the backend server
    echo    Command: cd backend ^&^& npm run dev
    echo.
) else (
    echo ✅ Backend server is responding
)

REM Test 3: Check database seeding
echo.
echo [3/6] Checking database seeding...
cd backend
call npm run seed >nul 2>&1
if errorlevel 1 (
    echo ❌ Database seeding failed
    echo 💡 This might be normal if data already exists
    echo.
) else (
    echo ✅ Database seeded successfully
)

REM Test 4: Test authentication
echo.
echo [4/6] Testing authentication system...
call npm run test-auth >nul 2>&1
if errorlevel 1 (
    echo ❌ Authentication tests failed
    echo 💡 Check the error messages above
    echo.
) else (
    echo ✅ Authentication system working
)

REM Test 5: Check frontend server
echo.
echo [5/6] Testing frontend server...
curl -s http://localhost:3001 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend server not responding
    echo 💡 Solution: Start the frontend server
    echo    Command: cd frontend ^&^& npm run dev
    echo.
) else (
    echo ✅ Frontend server is responding
)

REM Test 6: Clear browser cache recommendation
echo.
echo [6/6] Browser cache cleanup (RECOMMENDED)...
echo 💡 For best results, clear your browser data:
echo    1. Open browser DevTools (F12)
echo    2. Go to Application/Storage tab
echo    3. Click "Clear storage" or run: localStorage.clear()
echo    4. Hard refresh the page (Ctrl+Shift+R)
echo.

echo ===================================================
echo 🔑 TEST LOGIN CREDENTIALS:
echo ===================================================
echo 👤 Admin:    admin@edujobsconnect.rw / Admin123!
echo 🎓 Student:  jean@example.com / Student123!
echo 💼 Employer: employer@company.com / Employer123!
echo.
echo ===================================================
echo 🚀 QUICK START:
echo ===================================================
echo 1. Run: start-full-system.bat
echo 2. Open: http://localhost:3001
echo 3. Login with test credentials above
echo 4. Clear browser cache if needed
echo.
echo ===================================================
echo 📞 NEED HELP?
echo ===================================================
echo Check the README.md file for detailed instructions
echo or visit our documentation for troubleshooting guides.
echo.

pause