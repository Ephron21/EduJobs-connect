# EduJobs Connect - Setup Guide

This guide will help you set up and run the EduJobs Connect full-stack application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## Project Structure

```
EduJobs-connect/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
├── docs/             # Documentation
├── SETUP.md          # This setup guide
└── README.md         # Project overview
```

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd EduJobs-connect
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# Required variables:
# - MONGODB_URI
# - JWT_SECRET
# - EMAIL_USER
# - EMAIL_PASS
```

#### Backend Environment Variables (.env)

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/edujobs

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Client URL
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
BASE_URL=http://localhost:5000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

#### Start Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will be available at: `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file if needed
```

#### Frontend Environment Variables (.env)

```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=EduJobs Connect
VITE_APP_VERSION=1.0.0
```

#### Start Frontend Development Server

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend will be available at: `http://localhost:3000`

## Database Setup

### 1. Install MongoDB

**Windows:**
- Download MongoDB Community Server
- Install with default settings
- MongoDB will run as a Windows service

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. Verify MongoDB Connection

```bash
# Connect to MongoDB shell
mongosh

# Create database (optional - will be created automatically)
use edujobs

# Exit MongoDB shell
exit
```

### 3. Database Seeding (Optional)

The application will automatically create collections when you start using it. For development, you can create an admin user:

1. Start the backend server
2. Register a new user through the API or frontend
3. Manually update the user's role to 'admin' in MongoDB:

```javascript
// In MongoDB shell
use edujobs
db.users.updateOne(
  { email: "your-admin@email.com" },
  { $set: { role: "admin", isVerified: true } }
)
```

## Email Configuration

### Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Use App Password** in your `.env` file:
   ```bash
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ```

### Other Email Providers

Update the email configuration in `.env`:

```bash
# For Outlook/Hotmail
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587

# For Yahoo
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587

# For custom SMTP
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587_or_465
```

## File Upload Setup

The application handles file uploads for:
- Profile pictures
- Student documents (ID, diploma, transcripts)
- CV and cover letters
- University logos

Ensure the upload directories exist:

```bash
# From backend directory
mkdir -p uploads/images
mkdir -p uploads/documents
mkdir -p uploads/profiles
mkdir -p uploads/certificates
```

## Development Workflow

### 1. Running Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### 2. API Testing

The backend provides a health check endpoint:
```
GET http://localhost:5000/api/health
```

### 3. Available Scripts

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/verify-email # Email verification
POST /api/auth/forgot-password # Password reset request
POST /api/auth/reset-password  # Password reset
GET  /api/auth/me          # Get current user
POST /api/auth/logout      # Logout
```

### Main Endpoints

```
GET  /api/universities     # Get all universities
GET  /api/applications     # Get all applications
GET  /api/jobs            # Get all jobs
POST /api/consultations   # Create consultation request
GET  /api/users/profile   # Get user profile
```

## Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"

# Start MongoDB (if not running)
# Windows: Start MongoDB service
# macOS: brew services start mongodb/brew/mongodb-community
# Linux: sudo systemctl start mongodb
```

**2. Email Sending Fails**
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Solution:** 
- Use App Password instead of regular password
- Enable "Less secure app access" (not recommended)
- Check email provider SMTP settings

**3. File Upload Errors**
```
Error: ENOENT: no such file or directory, open 'uploads/...'
```
**Solution:** Create upload directories
```bash
mkdir -p uploads/{images,documents,profiles,certificates}
```

**4. CORS Errors**
```
Access to XMLHttpRequest at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution:** Ensure `CLIENT_URL` in backend `.env` matches frontend URL

**5. JWT Token Issues**
```
Error: jwt malformed
```
**Solution:** 
- Clear browser localStorage
- Ensure JWT_SECRET is set in backend `.env`
- Check token format in API requests

### Performance Optimization

**Development:**
- Use `npm run dev` for auto-restart
- Enable MongoDB logging for query optimization
- Use browser dev tools for frontend debugging

**Production:**
- Set `NODE_ENV=production`
- Use process manager (PM2)
- Enable MongoDB indexes
- Implement caching strategies

## Next Steps

After successful setup:

1. **Create Admin User** - Register and promote to admin role
2. **Add Sample Data** - Create universities, applications, and jobs
3. **Test Features** - Try registration, login, and main features
4. **Customize** - Modify branding, colors, and content
5. **Deploy** - Follow deployment guide for production

## Support

If you encounter issues:

1. Check this setup guide
2. Review error logs in terminal
3. Check browser console for frontend errors
4. Verify environment variables
5. Ensure all services are running

For additional help, refer to the main README.md or create an issue in the repository.

---

**Happy Coding! 🚀**
