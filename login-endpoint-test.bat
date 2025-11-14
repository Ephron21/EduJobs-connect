@echo off
echo 🔧 Login Endpoint Diagnostic
echo ============================
echo.

cd backend

echo [1/5] Testing database connection...
echo.

REM Test database connection
node -e "
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edujobsconnect';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Database connected successfully');
    return mongoose.connection.db.admin().listDatabases();
  })
  .then((dbs) => {
    const dbExists = dbs.databases.some(db => db.name === 'edujobsconnect');
    console.log('✅ EduJobs Connect database exists:', dbExists);
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
" > db_login_test.log 2>&1

if errorlevel 1 (
    echo ❌ Database connection failed
    type db_login_test.log
    echo.
    echo 💡 Run mongodb-test.bat first to fix database issues
    pause
    exit /b 1
) else (
    echo ✅ Database connection successful
    del db_login_test.log >nul 2>&1
)

echo.

echo [2/5] Testing User model loading...
echo.

REM Test User model loading
node -e "
try {
  const User = require('./models/User');
  console.log('✅ User model loaded successfully');
  console.log('✅ findByEmail method exists:', typeof User.findByEmail === 'function');
  process.exit(0);
} catch (err) {
  console.log('❌ User model failed to load:', err.message);
  process.exit(1);
}
" > user_model_test.log 2>&1

if errorlevel 1 (
    echo ❌ User model loading failed
    type user_model_test.log
    echo.
    echo 💡 Check User.js model file for syntax errors
    pause
    exit /b 1
) else (
    echo ✅ User model loaded successfully
    del user_model_test.log >nul 2>&1
)

echo.

echo [3/5] Checking if seeded users exist...
echo.

REM Check if seeded users exist
node -e "
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edujobsconnect';

const testUsers = [
  { email: 'admin@edujobsconnect.rw', expectedRole: 'admin' },
  { email: 'jean@example.com', expectedRole: 'student' },
  { email: 'employer@company.com', expectedRole: 'employer' }
];

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('🔍 Checking seeded users...');
    
    for (const testUser of testUsers) {
      const user = await User.findByEmail(testUser.email);
      if (user) {
        console.log('✅ Found user:', testUser.email, '(Role:', user.role + ')');
      } else {
        console.log('❌ User not found:', testUser.email);
      }
    }
    
    const totalUsers = await User.countDocuments();
    console.log('📊 Total users in database:', totalUsers);
    
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Database query failed:', err.message);
    process.exit(1);
  });
" > seed_check.log 2>&1

if errorlevel 1 (
    echo ❌ Database query failed
    type seed_check.log
    echo.
    echo 💡 Database seeding might have failed
) else (
    echo ✅ Database query successful
    del seed_check.log >nul 2>&1
)

echo.

echo [4/5] Testing auth route loading...
echo.

REM Test auth route loading
node -e "
try {
  const authRoute = require('./routes/auth');
  console.log('✅ Auth route loaded successfully');
  console.log('✅ Login endpoint exists:', typeof authRoute.stack !== 'undefined');
  process.exit(0);
} catch (err) {
  console.log('❌ Auth route failed to load:', err.message);
  console.log('Stack trace:', err.stack);
  process.exit(1);
}
" > auth_route_test.log 2>&1

if errorlevel 1 (
    echo ❌ Auth route loading failed
    type auth_route_test.log
    echo.
    echo 💡 Check auth.js route file for syntax errors
    pause
    exit /b 1
) else (
    echo ✅ Auth route loaded successfully
    del auth_route_test.log >nul 2>&1
)

echo.

echo [5/5] Testing login endpoint directly...
echo.

REM Test login endpoint
echo Starting server for endpoint test...
start /B npm run dev > login_endpoint_test.log 2>&1

echo ⏳ Waiting for server to start...
timeout /t 8 >nul

echo Testing login endpoint with test credentials...
curl -s -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@edujobsconnect.rw\",\"password\":\"Admin123!\"}" ^
  > login_response.log 2>&1

findstr /C:"500" login_response.log >nul 2>&1
if errorlevel 1 (
    echo ✅ Login endpoint responded (check response for success/error)
    echo Response:
    type login_response.log
) else (
    echo ❌ Login endpoint returning 500 error
    echo Response:
    type login_response.log
    echo.
    echo 💡 Check server logs for detailed error:
    echo Server log:
    type login_endpoint_test.log
)

del login_response.log >nul 2>&1

echo.
echo =====================================
echo 📋 Login Diagnostic Complete
echo =====================================
echo.
echo 🔧 Recommendations:
echo 1. If users not found, re-run database seeding
echo 2. If server errors, check MongoDB connection
echo 3. If auth route errors, check auth.js syntax
echo.
echo 🚀 Next steps:
echo - Try logging in with test credentials in browser
echo - Check browser console for specific errors
echo - Run troubleshoot-login.bat for full diagnosis
echo.
pause
