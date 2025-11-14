# EduJobs Connect - Login Troubleshooting Guide

## 🚀 Quick Start (Automated)

**For Windows users, simply run:**
```bash
start-full-system.bat
```

This script will automatically:
- ✅ Check and start MongoDB
- ✅ Install all dependencies
- ✅ Seed the database with test data
- ✅ Test the authentication system
- ✅ Start both backend and frontend servers

## 🔑 Test Login Credentials

After running the startup script, use these credentials to test login:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@edujobsconnect.rw` | `Admin123!` |
| **Student** | `jean@example.com` | `Student123!` |
| **Employer** | `employer@company.com` | `Employer123!` |

## 🛠️ Manual Setup (If Automated Script Fails)

### Step 1: Start MongoDB
```bash
# Windows
net start MongoDB

# Or check if it's running
sc query MongoDB
```

### Step 2: Backend Setup
```bash
cd backend
npm install
npm run seed
npm run test-auth
npm run dev
```

### Step 3: Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

## 🔍 Common Login Issues & Solutions

### Issue 1: "Login failed - Invalid email or password"

**Possible Causes:**
- Database not seeded with test users
- Wrong credentials
- Backend server not running

**Solutions:**
1. **Re-seed the database:**
   ```bash
   cd backend
   npm run seed
   ```

2. **Test authentication system:**
   ```bash
   cd backend
   npm run test-auth
   ```

3. **Verify correct credentials:**
   - Admin: `admin@edujobsconnect.rw` / `Admin123!`
   - Student: `jean@example.com` / `Student123!`
   - Employer: `employer@company.com` / `Employer123!`

### Issue 2: "Network Error" or "Cannot connect to server"

**Possible Causes:**
- Backend server not running
- Wrong API URL
- Port conflicts

**Solutions:**
1. **Check if backend is running:**
   - Visit: http://localhost:5000/api/health
   - Should return: `{"status":"OK"}`

2. **Start backend server:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Check for port conflicts:**
   - Backend should run on port 5000
   - Frontend should run on port 3001

### Issue 3: "Token has expired" or Authentication errors

**Possible Causes:**
- Old tokens in browser storage
- JWT secret mismatch
- Server restart required

**Solutions:**
1. **Clear browser storage:**
   ```javascript
   // In browser console (F12)
   localStorage.clear()
   sessionStorage.clear()
   ```

2. **Restart backend server:**
   ```bash
   cd backend
   npm run dev
   ```

### Issue 4: Database Connection Issues

**Possible Causes:**
- MongoDB not running
- Wrong connection string
- Database permissions

**Solutions:**
1. **Check MongoDB status:**
   ```bash
   # Windows
   sc query MongoDB
   
   # If not running
   net start MongoDB
   ```

2. **Test database connection:**
   ```bash
   cd backend
   npm run test-auth
   ```

3. **Check MongoDB logs:**
   - Look for connection errors in MongoDB logs
   - Default location: `C:\Program Files\MongoDB\Server\[version]\log\`

### Issue 5: CORS Errors

**Possible Causes:**
- Frontend running on wrong port
- CORS configuration mismatch

**Solutions:**
1. **Verify ports:**
   - Frontend: http://localhost:3001
   - Backend: http://localhost:5000

2. **Check CORS configuration in backend/.env:**
   ```
   FRONTEND_URL=http://localhost:3001
   ```

## 🧪 Testing Authentication System

Run the comprehensive authentication test:
```bash
cd backend
npm run test-auth
```

This will test:
- ✅ Server health check
- ✅ Database connection
- ✅ All user account logins
- ✅ Token validation
- ✅ Invalid login rejection

## 📊 System Health Checks

### Backend Health Check
Visit: http://localhost:5000/api/health

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Frontend Health Check
Visit: http://localhost:3001

Should load the EduJobs Connect login page.

### Database Health Check
```bash
cd backend
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/edujobs-connect')
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.log('❌ Database error:', err.message))
  .finally(() => process.exit())
"
```

## 🔧 Advanced Troubleshooting

### Reset Everything
If all else fails, reset the entire system:

```bash
# Stop all servers (Ctrl+C)

# Clear database
cd backend
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/edujobs-connect')
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => console.log('Database cleared'))
  .finally(() => process.exit())
"

# Re-seed database
npm run seed

# Clear browser data
# In browser: F12 > Application > Storage > Clear storage

# Restart system
cd ..
start-full-system.bat
```

### Check Environment Variables
Verify these files have correct values:

**backend/.env:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edujobs-connect
JWT_SECRET=EduJobs_Connect_2024_Super_Secure_JWT_Secret_Key_For_Authentication_System
FRONTEND_URL=http://localhost:3001
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:5000/api
```

## 📞 Still Having Issues?

1. **Check the console logs:**
   - Backend: Look at the terminal running `npm run dev`
   - Frontend: Open browser DevTools (F12) > Console

2. **Run the test suite:**
   ```bash
   cd backend
   npm run test-auth
   ```

3. **Verify all dependencies are installed:**
   ```bash
   # Backend
   cd backend && npm list

   # Frontend  
   cd frontend && npm list
   ```

4. **Check system requirements:**
   - Node.js 16+ installed
   - MongoDB installed and running
   - Ports 3001 and 5000 available

## 🎯 Success Indicators

When everything is working correctly, you should see:

1. **Backend terminal:**
   ```
   ✅ Connected to MongoDB
   🚀 Server running on port 5000
   📱 Frontend URL: http://localhost:3001
   ```

2. **Frontend terminal:**
   ```
   Local:   http://localhost:3001/
   Network: use --host to expose
   ```

3. **Browser:**
   - Login page loads at http://localhost:3001
   - Test credentials work for all roles
   - No console errors in DevTools

4. **Authentication test:**
   ```
   🎉 ALL TESTS PASSED! Authentication system is working correctly.
   ```

---

**Last Updated:** January 2024  
**System Version:** EduJobs Connect v1.0
