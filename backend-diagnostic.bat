@echo off
echo 🔧 EduJobs Connect - Backend Diagnostic Tool
echo ============================================
echo.

echo [1/5] Checking MongoDB connection...
mongosh --eval "db.adminCommand('ismaster')" >nul 2>&1
if errorlevel 1 (
    echo ❌ MongoDB not accessible
    echo 💡 Check if MongoDB is installed and running
    echo    Command: net start MongoDB
    echo.
) else (
    echo ✅ MongoDB is accessible
)

echo.
echo [2/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found
    echo 💡 Please install Node.js from https://nodejs.org/
    echo.
) else (
    echo ✅ Node.js is installed
    node --version
)

echo.
echo [3/5] Checking backend dependencies...
cd backend
if exist package.json (
    echo ✅ package.json found
) else (
    echo ❌ package.json not found
    exit /b 1
)

if exist node_modules (
    echo ✅ Dependencies already installed
) else (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        exit /b 1
    ) else (
        echo ✅ Dependencies installed successfully
    )
)

echo.
echo [4/5] Testing database seeding...
npm run seed
if errorlevel 1 (
    echo ⚠️  Database seeding had issues (might be normal if already seeded)
) else (
    echo ✅ Database seeded successfully
)

echo.
echo [5/5] Testing server startup...
echo 🔧 Starting server in background...
start /B npm run dev > server.log 2>&1

echo ⏳ Waiting for server to start...
timeout /t 5 /nobreak > nul

echo 🔍 Checking if server is responding...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Server not responding
    echo 💡 Check server.log for errors
    type server.log
    echo.
    echo 🔧 Manual start command: cd backend && npm run dev
) else (
    echo ✅ Server is responding!
    echo 🌐 Access your API at: http://localhost:5000
    echo 🔑 Test login: http://localhost:5000/api/auth/login
)

echo.
echo 📋 Quick Actions:
echo 1. If server failed, check the error messages above
echo 2. Make sure MongoDB is running: net start MongoDB
echo 3. Clear node_modules and reinstall if needed: rm -rf node_modules && npm install
echo 4. Check firewall settings if ports are blocked
echo.
pause
