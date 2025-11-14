@echo off
echo 🔧 Backend Server Startup Test
echo =============================
echo.

cd backend

echo [1/4] Basic server test...
echo.

REM Test basic server startup without routes
echo Testing basic Express server...
node -e "
const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.json({ status: 'Basic server working' });
});

const server = app.listen(5000, () => {
  console.log('✅ Basic server started on port 5000');
  server.close(() => {
    console.log('✅ Basic server test passed');
    process.exit(0);
  });
});
" > basic_test.log 2>&1

if errorlevel 1 (
    echo ❌ Basic server test failed
    type basic_test.log
    echo.
    echo 💡 Node.js or Express installation issue
    pause
    exit /b 1
) else (
    echo ✅ Basic server test passed
    del basic_test.log >nul 2>&1
)

echo.

echo [2/4] Database connection test...
echo.

REM Test database connection
node -e "
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edujobsconnect';

console.log('Testing connection to:', mongoUri);

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Database connected successfully');
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('✅ Database test completed');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Database connection failed:', err.message);
    process.exit(1);
  });
" > db_test.log 2>&1

if errorlevel 1 (
    echo ❌ Database connection failed
    type db_test.log
    echo.
    echo 💡 Check MongoDB installation and .env configuration
    pause
    exit /b 1
) else (
    echo ✅ Database connection successful
    del db_test.log >nul 2>&1
)

echo.

echo [3/4] Route loading test...
echo.

REM Test route loading one by one
echo Testing route file loading...
node -e "
const fs = require('fs');
const path = require('path');

const routes = [
  './routes/auth',
  './routes/users',
  './routes/universities',
  './routes/homepage',
  './routes/contact',
  './routes/services',
  './routes/jobs',
  './routes/applications',
  './routes/admin',
  './routes/adminContent',
  './routes/notifications'
];

console.log('Testing route files...');

let failedRoutes = [];

routes.forEach(route => {
  try {
    if (fs.existsSync(path.join(__dirname, route + '.js'))) {
      require(route);
      console.log('✅', route, 'loaded successfully');
    } else {
      console.log('⚠️ ', route, 'file not found');
      failedRoutes.push(route);
    }
  } catch (err) {
    console.log('❌', route, 'failed to load:', err.message);
    failedRoutes.push(route + ': ' + err.message);
  }
});

if (failedRoutes.length > 0) {
  console.log('\\n❌ Failed routes:');
  failedRoutes.forEach(route => console.log('  -', route));
  process.exit(1);
} else {
  console.log('\\n✅ All routes loaded successfully');
  process.exit(0);
}
" > routes_test.log 2>&1

if errorlevel 1 (
    echo ❌ Route loading test failed
    type routes_test.log
    echo.
    echo 💡 Check the specific route file mentioned in the error
    pause
    exit /b 1
) else (
    echo ✅ Route loading test passed
    del routes_test.log >nul 2>&1
)

echo.

echo [4/4] Full server startup test...
echo.

REM Start full server
echo Starting complete server...
start /B npm run dev > full_server.log 2>&1

echo ⏳ Waiting for server to start...
timeout /t 10 >nul

REM Test if server is responding
echo Testing server response...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Full server startup failed
    echo 💡 Checking server logs...
    echo.
    echo Server log output:
    type full_server.log 2>nul
    echo.
    echo 🔧 Manual start: npm run dev
    pause
    exit /b 1
) else (
    echo ✅ Full server started successfully!
    echo 🌐 Server running on http://localhost:5000
)

echo.
echo =====================================
echo 🎉 Backend server is ready!
echo =====================================
echo.
echo 📋 Ready for login testing:
echo - Admin: admin@edujobsconnect.rw / Admin123!
echo - Student: jean@example.com / Student123!
echo - Employer: employer@company.com / Employer123!
echo.
echo 🔧 Access your application at: http://localhost:3001
echo.

pause
