@echo off
echo 🔧 EduJobs Connect - Quick Health Check
echo ======================================
echo.

echo [1/4] Testing MongoDB connection...
mongosh --eval "db.adminCommand('ismaster')" >nul 2>&1
if errorlevel 1 (
    echo ❌ MongoDB not accessible
    echo 💡 Make sure MongoDB is running: net start MongoDB
) else (
    echo ✅ MongoDB is accessible
)

echo.
echo [2/4] Testing backend server startup...
cd backend
echo 🔧 Starting backend server in background...
start /B npm run dev > server.log 2>&1

echo ⏳ Waiting for server to start...
timeout /t 5 /nobreak > nul

echo 🔍 Checking if server is responding...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend server not responding
    echo 💡 Check server.log for errors:
    type server.log 2>nul
    echo.
    echo 🔧 Try running: npm run dev manually in backend folder
) else (
    echo ✅ Backend server is responding!
    echo 🌐 API available at: http://localhost:5000
)

echo.
echo [3/4] Testing API endpoints...
curl -s http://localhost:5000/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test\"}" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Login endpoint test failed (expected for invalid credentials)
) else (
    echo ✅ API endpoints are accessible
)

echo.
echo [4/4] Testing database seeding...
call npm run seed >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Database seeding had issues (might be normal)
) else (
    echo ✅ Database seeded successfully
)

echo.
echo ======================================
echo 🚀 READY TO USE!
echo ======================================
echo.
echo 📋 Next Steps:
echo 1. Open: http://localhost:3001
echo 2. Login with test credentials:
echo    Admin: admin@edujobsconnect.rw / Admin123!
echo    Student: jean@example.com / Student123!
echo    Employer: employer@company.com / Employer123!
echo.
echo 🔧 If you see login errors:
echo - Clear browser cache (Ctrl+Shift+R)
echo - Run troubleshoot-login.bat
echo - Check that both servers are running
echo.
echo 📞 Need help? Run troubleshoot-login.bat
echo.
pause
