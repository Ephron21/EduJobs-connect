@echo off
echo 🚀 Starting EduJobs Connect Backend Server...
echo.

REM Check if MongoDB is running
echo 📊 Checking MongoDB connection...
timeout /t 2 /nobreak > nul

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

REM Seed the database
echo 🌱 Seeding database with sample data...
npm run seed
echo.

REM Start the development server
echo 🚀 Starting backend server on http://localhost:5000...
echo 🔑 Admin Login: admin@edujobsconnect.rw / Admin123!
echo.
npm run dev
