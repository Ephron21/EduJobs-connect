@echo off
echo 🔧 Checking MongoDB Status...
echo ==============================

REM Check if MongoDB service is running
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo ❌ MongoDB service not found or not running
    echo.
    echo 🔧 Starting MongoDB service...
    net start MongoDB
    if errorlevel 1 (
        echo ❌ Failed to start MongoDB service
        echo 💡 Please install and start MongoDB manually
        echo    Visit: https://docs.mongodb.com/manual/installation/
    ) else (
        echo ✅ MongoDB service started successfully
    )
) else (
    echo ✅ MongoDB service is already running
)

echo.
echo 🔍 Testing MongoDB connection...
timeout /t 2 /nobreak > nul

echo.
echo 🚀 Starting Backend Server...
echo ==============================
cd backend

echo 📦 Checking dependencies...
if not exist node_modules (
    echo 📥 Installing dependencies...
    npm install
)

echo.
echo 🌱 Seeding database...
npm run seed

echo.
echo 🔧 Starting server...
npm run dev
