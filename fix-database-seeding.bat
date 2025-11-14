@echo off
echo 🔧 Database Seeding Fix
echo ======================
echo.

cd backend

echo [1/3] Checking current database state...
echo.

REM Check if users exist
node -e "
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edujobsconnect';

const testUsers = [
  'admin@edujobsconnect.rw',
  'jean@example.com', 
  'employer@company.com'
];

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('🔍 Checking existing users...');
    
    const existingUsers = await User.find({}, 'email role');
    console.log('📊 Current users in database:', existingUsers.length);
    existingUsers.forEach(user => {
      console.log('  -', user.email, '(Role:', user.role + ')');
    });
    
    const missingUsers = testUsers.filter(email => 
      !existingUsers.some(user => user.email === email)
    );
    
    if (missingUsers.length > 0) {
      console.log('\\n❌ Missing users:', missingUsers.join(', '));
      console.log('🔧 Need to re-seed database');
      process.exit(1);
    } else {
      console.log('\\n✅ All test users exist in database');
      process.exit(0);
    }
  })
  .catch((err) => {
    console.log('❌ Database check failed:', err.message);
    process.exit(1);
  });
" > user_check.log 2>&1

if errorlevel 1 (
    echo ❌ Users missing from database
    type user_check.log
    echo.
    echo 🔧 Re-seeding database...
) else (
    echo ✅ All users exist in database
    del user_check.log >nul 2>&1
    goto :users_exist
)

echo.

echo [2/3] Re-seeding database...
echo.

REM Re-seed database
call npm run seed > seed_output.log 2>&1

findstr /C:"Database seeded successfully" seed_output.log >nul 2>&1
if errorlevel 1 (
    echo ❌ Database seeding failed
    echo Seeding output:
    type seed_output.log
    echo.
    echo 💡 Check seeding script for errors
    pause
    exit /b 1
) else (
    echo ✅ Database seeded successfully
    del seed_output.log >nul 2>&1
)

echo.

echo [3/3] Verifying seeded users...
echo.

REM Verify users were seeded
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
    console.log('🔍 Verifying seeded users...');
    
    for (const testUser of testUsers) {
      const user = await User.findByEmail(testUser.email);
      if (user) {
        console.log('✅ Found user:', testUser.email, '(Role:', user.role + ')');
        if (user.role !== testUser.expectedRole) {
          console.log('⚠️  Role mismatch for', testUser.email);
        }
      } else {
        console.log('❌ User not found:', testUser.email);
      }
    }
    
    const totalUsers = await User.countDocuments();
    console.log('📊 Total users after seeding:', totalUsers);
    
    await mongoose.connection.close();
    console.log('\\n✅ Database seeding verification complete');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Verification failed:', err.message);
    process.exit(1);
  });
" > verify_seed.log 2>&1

if errorlevel 1 (
    echo ❌ User verification failed
    type verify_seed.log
    echo.
    echo 💡 Manual database check may be needed
) else (
    echo ✅ User verification successful
    del verify_seed.log >nul 2>&1
)

:users_exist
echo.
echo =====================================
echo 🎉 Database Seeding Complete!
echo =====================================
echo.
echo ✅ Test users are now available:
echo    Admin: admin@edujobsconnect.rw / Admin123!
echo    Student: jean@example.com / Student123!
echo    Employer: employer@company.com / Employer123!
echo.
echo 🚀 Ready for login testing:
echo 1. Start the system: start-full-system.bat
echo 2. Open browser to: http://localhost:3001
echo 3. Try logging in with test credentials
echo.
echo 🔧 If login still fails:
echo - Clear browser cache (Ctrl+Shift+R)
echo - Run troubleshoot-login.bat
echo - Check browser console for errors
echo.
pause
