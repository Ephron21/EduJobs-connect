@echo off
echo 🔧 EduJobs Connect - Backend Server Diagnostic
echo ============================================
echo.

echo [1/6] Checking prerequisites...
echo.

REM Check MongoDB
echo Checking MongoDB...
mongosh --eval "db.adminCommand('ismaster')" >nul 2>&1
if errorlevel 1 (
    echo ❌ MongoDB not accessible
    echo 🔧 Starting MongoDB service...
    net start MongoDB >nul 2>&1
    if errorlevel 1 (
        echo ❌ Failed to start MongoDB
        echo 💡 Please install MongoDB: https://docs.mongodb.com/manual/installation/
        pause
        exit /b 1
    ) else (
        echo ✅ MongoDB started
        timeout /t 3 >nul
    )
) else (
    echo ✅ MongoDB is running
)

echo.

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not installed
    echo 💡 Install Node.js: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

echo.

REM Navigate to backend
cd backend

echo [2/6] Checking backend setup...
echo.

REM Check package.json
if not exist package.json (
    echo ❌ package.json not found
    pause
    exit /b 1
) else (
    echo ✅ package.json found
)

REM Check node_modules
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    ) else (
        echo ✅ Dependencies installed
    )
) else (
    echo ✅ Dependencies already installed
)

echo.

echo [3/6] Testing database connection...
echo.

REM Test MongoDB connection in Node.js
echo Testing MongoDB connection...
node -e "
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edujobsconnect';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
" > db_test.log 2>&1

if errorlevel 1 (
    echo ❌ Database connection failed
    type db_test.log
    echo.
    echo 💡 Check your .env file and MongoDB configuration
    pause
    exit /b 1
) else (
    echo ✅ Database connection successful
    del db_test.log >nul 2>&1
)

echo.

echo [4/6] Testing server startup...
echo.

REM Start server and capture output
echo Starting server in background...
start /B npm run dev > server.log 2>&1

echo ⏳ Waiting for server to start...
timeout /t 8 >nul

REM Check if server is responding
echo Testing server response...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Server not responding
    echo 💡 Server startup failed. Checking logs...
    echo.
    echo Server log output:
    type server.log 2>nul
    echo.
    echo 🔧 Manual start: cd backend ^&^& npm run dev
    pause
    exit /b 1
) else (
    echo ✅ Server is responding!
)

echo.

echo [5/6] Testing API endpoints...
echo.

REM Test login endpoint
echo Testing login endpoint...
curl -s -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"test\"}" ^
  > login_test.log 2>&1

findstr /C:"500" login_test.log >nul 2>&1
if errorlevel 1 (
    echo ✅ Login endpoint accessible (returned expected error for invalid credentials)
) else (
    echo ❌ Login endpoint returning 500 error
    echo Response:
    type login_test.log
    echo.
    echo 💡 Check server logs for detailed error information
)

del login_test.log >nul 2>&1
echo.

echo [6/6] Final status check...
echo.

echo Backend server status:
curl -s http://localhost:5000/api/health | findstr /C:"status" || echo ❌ Health check failed

echo.
echo ============================================
echo 🎯 READY FOR LOGIN TESTING!
echo ============================================
echo.
echo 📋 Next steps:
echo 1. Open http://localhost:3001 in your browser
echo 2. Use these test credentials:
echo    Admin: admin@edujobsconnect.rw / Admin123!
echo    Student: jean@example.com / Student123!
echo    Employer: employer@company.com / Employer123!
echo.
echo 🔧 If login still fails:
echo - Clear browser cache (Ctrl+Shift+R)
echo - Check browser console for errors
echo - Run troubleshoot-login.bat for full diagnostics
echo.
echo 🚀 Server is running on http://localhost:5000
echo.

pause
