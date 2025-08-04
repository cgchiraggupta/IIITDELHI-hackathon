# 🚀 Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

### Frontend (Vercel)
- [ ] Code is pushed to GitHub
- [ ] Environment variables are set in Vercel:
  - `VITE_API_BASE_URL=https://your-backend-url.railway.app`
  - `VITE_OCR_API_KEY=K84125832788957`
  - `VITE_GEMINI_API_KEY=AIzaSyC5CqcZww_dEKXlH4G6seq8H0p-RZC5si0`
  - `VITE_SARVAM_API_KEY=sk_sb5gdo6f_zbutFjWzkn02WwpwkZUmiNy9`

### Backend (Railway/Render)
- [ ] Backend is deployed and running
- [ ] Environment variables are set in backend:
  - `PORT=3001`
  - `OCR_API_KEY=K84125832788957`
  - `GEMINI_API_KEY=AIzaSyC5CqcZww_dEKXlH4G6seq8H0p-RZC5si0`
  - `SARVAM_API_KEY=sk_sb5gdo6f_zbutFjWzkn02WwpwkZUmiNy9`
- [ ] Backend URL is accessible

## 🧪 Test Commands

### Test Backend
```bash
curl -X GET https://your-backend-url.railway.app/api/health
```

### Test Frontend
1. Visit your Vercel URL
2. Open browser console (F12)
3. Check for any errors
4. Try camera capture feature

## 🔧 Quick Fixes

### If Analysis Doesn't Work:
1. Check browser console for errors
2. Verify `VITE_API_BASE_URL` is correct
3. Test backend health endpoint
4. Check CORS configuration

### If Translation/TTS Doesn't Work:
1. Verify API keys are set correctly
2. Check network tab for failed requests
3. Ensure backend is running

## 📞 Common Issues & Solutions

### Issue: "Failed to fetch" errors
**Solution**: Check `VITE_API_BASE_URL` environment variable

### Issue: CORS errors
**Solution**: Update CORS origin in backend/server.js with your Vercel domain

### Issue: API key errors
**Solution**: Verify all API keys are set in both frontend and backend

### Issue: Build fails
**Solution**: Check Node.js version (should be 18+)

## 🎯 Success Indicators

✅ Backend health endpoint returns `{"status":"ok"}`  
✅ Frontend loads without console errors  
✅ Camera capture works  
✅ Image analysis completes successfully  
✅ Translation/TTS works  
✅ No CORS errors in browser console  

## 🚀 Ready to Deploy!

If all checks pass, your application should work perfectly in production! 