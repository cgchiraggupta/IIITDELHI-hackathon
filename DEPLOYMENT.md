# 🚀 Deployment Guide for ASHA Health Assistant

## Overview
This application consists of two parts:
1. **Frontend** (React + Vite) - Deploy to Vercel
2. **Backend** (Node.js + Express) - Deploy to Railway/Render/Railway

## 🎯 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and create a new project
3. Connect your GitHub repository
4. Configure the following settings:

### Step 2: Environment Variables
Add these environment variables in Vercel dashboard:

```
VITE_API_BASE_URL=https://your-backend-url.railway.app
VITE_OCR_API_KEY=K84125832788957
VITE_GEMINI_API_KEY=AIzaSyC5CqcZww_dEKXlH4G6seq8H0p-RZC5si0
VITE_SARVAM_API_KEY=sk_sb5gdo6f_zbutFjWzkn02WwpwkZUmiNy9
```

### Step 3: Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🔧 Backend Deployment (Railway)

### Step 1: Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Set the root directory to `backend/`

### Step 2: Environment Variables
Add these environment variables in Railway:

```
PORT=3001
OCR_API_KEY=K84125832788957
GEMINI_API_KEY=AIzaSyC5CqcZww_dEKXlH4G6seq8H0p-RZC5si0
SARVAM_API_KEY=sk_sb5gdo6f_zbutFjWzkn02WwpwkZUmiNy9
```

### Step 3: Build Settings
- **Start Command**: `npm start`
- **Node Version**: 18 or higher

## 🔄 Alternative Backend Deployment Options

### Option 1: Render
1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set root directory to `backend/`
5. Use the same environment variables as Railway

### Option 2: Railway (Alternative)
1. Use Railway's CLI: `railway login`
2. Run: `railway init` in the backend directory
3. Run: `railway up` to deploy

## 🧪 Testing Deployment

### Test Backend
```bash
curl -X GET https://your-backend-url.railway.app/api/health
```

### Test Frontend
1. Visit your Vercel URL
2. Try the camera capture feature
3. Test the analysis functionality

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure backend has proper CORS configuration
   - Check that frontend URL is allowed

2. **API Connection Issues**
   - Verify `VITE_API_BASE_URL` is correct
   - Check that backend is running and accessible

3. **Environment Variables**
   - Ensure all variables are set in both frontend and backend
   - Check that variable names match exactly

4. **Build Errors**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

## 📝 Important Notes

- **API Keys**: Keep your API keys secure and don't commit them to public repositories
- **CORS**: The backend is configured to allow all origins for development. In production, you should restrict this to your frontend domain
- **File Uploads**: The backend supports file uploads up to 10MB
- **Timeouts**: API calls have 30-60 second timeouts depending on the operation

## 🚀 Quick Deploy Commands

### Frontend (Vercel)
```bash
npm install -g vercel
vercel --prod
```

### Backend (Railway)
```bash
cd backend
railway login
railway up
```

## 📞 Support
If you encounter issues:
1. Check the deployment logs in your platform dashboard
2. Verify environment variables are set correctly
3. Test the backend API endpoints directly
4. Check browser console for frontend errors 