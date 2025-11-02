# Frontend Deployment Guide

## Option 1: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free): https://vercel.com

### Steps:

1. **Push your code to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Prepare frontend for deployment"
   git push origin main
   ```

2. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub

3. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `houseiq-frontend` folder as the root directory

4. **Configure Project**
   - Framework Preset: Vite
   - Root Directory: `houseiq-frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

5. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
     - Replace with your actual backend URL once deployed
   - For now, you can use: `http://localhost:8080/api` (will update later)

6. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at: `https://your-project-name.vercel.app`

7. **Update Backend CORS** (after backend deployment)
   - Once backend is deployed, update `VITE_API_URL` in Vercel
   - Redeploy frontend to pick up the new URL

### Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain

---

## Option 2: Deploy to Render.com (Static Site)

### Steps:

1. **Create Static Site on Render**
   - Go to https://render.com
   - Click "New +" → "Static Site"

2. **Configure**
   - Name: `houseiq-frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

3. **Connect Repository**
   - Connect your GitHub repo
   - Root Directory: `houseiq-frontend`

4. **Deploy**
   - Click "Create Static Site"
   - Render will build and deploy automatically

---

## Option 3: Deploy with Docker (Render Web Service)

1. **Use Dockerfile.prod**
   - Render will detect and use `Dockerfile.prod`
   - Set environment variable: `VITE_API_URL`

2. **Configure Service**
   - Type: Web Service
   - Dockerfile Path: `houseiq-frontend/Dockerfile.prod`
   - Environment Variables:
     - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

---

## Testing Deployment

After deployment:
1. Visit your deployed URL
2. Check browser console for errors
3. Try logging in/registering
4. Verify API calls are working

## Troubleshooting

- **Build fails**: Check build logs in Vercel/Render dashboard
- **API calls fail**: Verify `VITE_API_URL` is set correctly
- **404 on routes**: Ensure SPA routing is configured (vercel.json or nginx config)
- **CORS errors**: Backend needs to allow your frontend URL