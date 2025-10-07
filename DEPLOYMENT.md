# EduJobs Connect - Deployment Guide

## 🚀 Frontend Deployment to Vercel

### Step 1: Deploy Frontend to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Frontend**:
   ```bash
   # Navigate to project root
   cd d:\EduJobs-connect

   # Deploy frontend only
   vercel --prod
   ```

4. **Set Environment Variables**:
   During deployment or in Vercel dashboard, set:
   ```
   VITE_API_BASE_URL=https://your-backend-domain.vercel.app/api
   ```

### Step 2: Backend Deployment Options

Since Vercel is optimized for frontend deployments, you'll need to deploy your backend separately. Here are the recommended options:

#### Option A: Railway (Recommended)
Railway is perfect for Node.js applications with MongoDB.

1. Go to [railway.app](https://railway.app) and create an account
2. Create a new project
3. Connect your GitHub repository
4. Add these environment variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/edujobs (or use MongoDB Atlas)
   JWT_SECRET=your-jwt-secret-here
   PORT=8080
   NODE_ENV=production
   ```
5. Deploy automatically when you push to your repository

#### Option B: Render
1. Go to [render.com](https://render.com) and create an account
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables as above

#### Option C: Heroku
1. Install Heroku CLI and login
2. Create a `Procfile` in your backend folder:
   ```
   web: npm start
   ```
3. Deploy:
   ```bash
   heroku create your-app-name
   heroku git:remote -a your-app-name
   git subtree push --prefix backend heroku main
   ```

## 🔧 Production Configuration

### Environment Variables Needed:

**Frontend (Vercel):**
```
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

**Backend (Railway/Render/Heroku):**
```
MONGODB_URI=mongodb://localhost:27017/edujobs
JWT_SECRET=your-super-secret-jwt-key-here
PORT=8080
NODE_ENV=production
```

### Database Options:

1. **MongoDB Atlas** (Cloud) - Recommended for production
2. **Railway PostgreSQL** - If you want to switch to PostgreSQL
3. **Local MongoDB** - For development only

## 📋 Deployment Checklist

- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway/Render/Heroku
- [ ] Set up MongoDB Atlas (recommended)
- [ ] Update environment variables
- [ ] Test API connectivity
- [ ] Set up custom domain (optional)
- [ ] Enable SSL certificates

## 🌐 Getting Your Shareable Link

After deployment:

1. **Frontend URL**: `https://your-project-name.vercel.app`
2. **Backend URL**: `https://your-backend-app.railway.app` (or your chosen backend host)

Your main website URL will be the Vercel deployment URL.

## 🚨 Important Notes

- Make sure your backend CORS settings allow your Vercel domain
- Update the `VITE_API_BASE_URL` in Vercel dashboard to point to your backend
- For production, use MongoDB Atlas instead of local MongoDB
- Set strong JWT secrets for production security

Would you like me to help you set up any specific part of this deployment process?
