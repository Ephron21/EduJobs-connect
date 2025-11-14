@echo off
echo 🔧 MongoDB Connection Test
echo =========================
echo.

echo Testing MongoDB service status...
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo ❌ MongoDB service not installed or not found
    echo 💡 Install MongoDB Community Edition for Windows
    echo    https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
    echo.
    echo 🔧 Alternative: Use MongoDB Atlas (cloud database)
    echo    Update MONGODB_URI in .env file
    pause
    exit /b 1
) else (
    echo ✅ MongoDB service found
)

echo.
echo Testing if MongoDB service is running...
sc query MongoDB | find "RUNNING" >nul 2>&1
if errorlevel 1 (
    echo 🔧 Starting MongoDB service...
    net start MongoDB >nul 2>&1
    if errorlevel 1 (
        echo ❌ Failed to start MongoDB service
        echo 💡 Check MongoDB installation and configuration
        pause
        exit /b 1
    ) else (
        echo ✅ MongoDB service started successfully
        timeout /t 3 >nul
    )
) else (
    echo ✅ MongoDB service is already running
)

echo.
echo Testing MongoDB connectivity...
mongosh --eval "db.adminCommand('ismaster')" --quiet >nul 2>&1
if errorlevel 1 (
    echo ❌ Cannot connect to MongoDB
    echo 💡 Check MongoDB configuration and firewall settings
    echo.
    echo 🔧 Troubleshooting steps:
    echo 1. Check if MongoDB is listening on port 27017
    echo 2. Verify MongoDB configuration file
    echo 3. Check Windows firewall settings
    echo 4. Try connecting manually: mongosh
    echo.
    echo 💡 Alternative solution:
    echo    Use MongoDB Atlas cloud database instead
    pause
    exit /b 1
) else (
    echo ✅ MongoDB is accessible and responding
)

echo.
echo Testing database creation/access...
mongosh --eval "use edujobsconnect; db.users.countDocuments()" --quiet >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Could not access edujobsconnect database
    echo 💡 This might be normal if database doesn't exist yet
) else (
    echo ✅ Database edujobsconnect is accessible
)

echo.
echo =====================================
echo ✅ MongoDB is ready for EduJobs Connect!
echo =====================================
echo.
echo 📋 Next steps:
echo - Run backend server: cd backend && npm run dev
echo - Or run complete system: start-full-system.bat
echo.
pause
