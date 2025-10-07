# EduJobs Connect Backend

Backend API server for the EduJobs Connect platform - connecting Rwandan students with university opportunities and job vacancies.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally
- Git installed

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # The .env file is already configured for development
   # Update MongoDB URI if needed
   ```

4. **Start MongoDB** (if not running)
   ```bash
   # On Windows
   mongod
   
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   ```

5. **Seed the database** (optional but recommended)
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── models/           # Database models
│   ├── User.js       # User model with authentication
│   ├── University.js # University model with programs
│   ├── Job.js        # Job posting model
│   └── Application.js # Application tracking model
├── routes/           # API routes
│   ├── auth.js       # Authentication routes
│   ├── users.js      # User management routes
│   ├── universities.js # University routes
│   ├── jobs.js       # Job posting routes
│   ├── applications.js # Application routes
│   └── admin.js      # Admin dashboard routes
├── middleware/       # Custom middleware
│   └── auth.js       # Authentication & authorization
├── scripts/          # Utility scripts
│   └── seed.js       # Database seeding script
├── uploads/          # File upload directory
├── server.js         # Main server file
├── package.json      # Dependencies and scripts
└── .env              # Environment variables
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests (when implemented)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email address
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences
- `PUT /api/users/change-password` - Change password
- `DELETE /api/users/account` - Delete user account

### Universities
- `GET /api/universities` - Get all universities (with filters)
- `GET /api/universities/featured` - Get featured universities
- `GET /api/universities/:id` - Get university by ID
- `GET /api/universities/:id/programs` - Get university programs
- `POST /api/universities` - Create university (Admin only)
- `PUT /api/universities/:id` - Update university (Admin only)
- `DELETE /api/universities/:id` - Delete university (Admin only)

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/featured` - Get featured jobs
- `GET /api/jobs/categories` - Get job categories
- `GET /api/jobs/:id` - Get job by ID
- `GET /api/jobs/user/my-jobs` - Get user's job postings
- `POST /api/jobs` - Create job (Employer/Admin only)
- `PUT /api/jobs/:id` - Update job (Owner/Admin only)
- `DELETE /api/jobs/:id` - Delete job (Owner/Admin only)

### Applications
- `GET /api/applications` - Get user's applications
- `GET /api/applications/:id` - Get application by ID
- `GET /api/applications/stats` - Get application statistics
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `PUT /api/applications/:id/submit` - Submit application
- `PUT /api/applications/:id/withdraw` - Withdraw application
- `DELETE /api/applications/:id` - Delete application (draft only)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/health` - Get system health status
- `GET /api/admin/users` - Get all users (with pagination)
- `GET /api/admin/universities` - Get all universities
- `GET /api/admin/jobs` - Get all jobs
- `GET /api/admin/applications` - Get all applications
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/users/bulk-delete` - Delete multiple users
- `GET /api/admin/homepage` - Get homepage settings
- `PUT /api/admin/homepage` - Update homepage settings

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **Student** - Can view and apply for jobs/universities
- **Employer** - Can post and manage job listings
- **Admin** - Full access to all features and admin dashboard

## 🗄️ Database Models

### User Model
- Authentication with bcrypt password hashing
- Role-based access control
- Profile information and preferences
- Email verification and password reset

### University Model
- University information and programs
- Location and contact details
- Ratings and reviews
- Featured and verified status

### Job Model
- Job posting details and requirements
- Company information
- Salary and benefits
- Application tracking statistics

### Application Model
- Unified model for job and university applications
- Document uploads and personal information
- Status tracking and communication history
- Application number generation

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Helmet for security headers
- Account lockout after failed login attempts

## 📊 Sample Data

After running `npm run seed`, you can use these test accounts:

**Admin Account:**
- Email: admin@edujobsconnect.rw
- Password: Admin123!

**Student Account:**
- Email: jean@example.com
- Password: Student123!

**Employer Account:**
- Email: employer@company.com
- Password: Employer123!

## 🌍 Environment Variables

Key environment variables in `.env`:

```bash
PORT=5000                    # Server port
NODE_ENV=development         # Environment
MONGODB_URI=mongodb://...    # MongoDB connection string
JWT_SECRET=your-secret-key   # JWT signing secret
FRONTEND_URL=http://localhost:3000  # Frontend URL for CORS
```

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up email service for notifications
5. Configure file upload storage (AWS S3, etc.)
6. Set up process manager (PM2, Docker, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.
