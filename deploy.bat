@echo off
echo 🚀 EduJobs Connect - Deployment Script
echo =====================================
echo.

echo 📦 Installing Vercel CLI...
npm i -g vercel

echo.
echo 🔐 Logging into Vercel...
vercel login

echo.
echo 🌐 Deploying frontend to Vercel...
vercel --prod

echo.
echo ✅ Deployment completed!
echo.
echo 📋 Next Steps:
echo 1. Deploy backend to Railway, Render, or Heroku
echo 2. Set environment variables in Vercel dashboard
echo 3. Update VITE_API_BASE_URL to point to your backend
echo 4. Check DEPLOYMENT.md for detailed instructions
echo.
echo 🌍 Your website will be available at: https://your-project-name.vercel.app
echo.
pause
