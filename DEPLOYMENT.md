# Deployment Guide

This guide explains how to deploy the Musical School Website with the backend on Google Cloud Run and the frontend on Vercel.

## Project Structure

```
musicalsite-main/
├── backend/           # Node.js/Express API
│   ├── server.js      # Express server entry point
│   ├── package.json   # Backend dependencies
│   └── Dockerfile     # For Google Cloud Run
├── frontend/          # React + Vite application
│   ├── src/           # React source code
│   ├── index.html     # HTML template
│   ├── vite.config.js # Vite configuration
│   ├── package.json   # Frontend dependencies
│   └── vercel.json    # Vercel configuration
└── README.md
```

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Vercel Account** (free tier works)
3. **Google Cloud SDK** (`gcloud`) installed locally (for backend deployment)
4. **Node.js 20+** installed locally

## Backend Deployment (Google Cloud Run)

### Step 1: Set Up Google Cloud Project

1. Create a new Google Cloud project or select an existing one:
   ```bash
   gcloud projects create musical-site-backend --name="Musical Site Backend"
   gcloud config set project musical-site-backend
   ```

2. Enable required APIs:
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

### Step 2: Configure Environment Variables

📖 **Detailed guide: See [GOOGLE_CLOUD_ENV_VARS.md](./GOOGLE_CLOUD_ENV_VARS.md)**

**Quick answer:** You can skip this step for now! 

You'll set the `ALLOWED_ORIGIN` environment variable **after** you deploy your frontend to Vercel (because you need the Vercel URL first).

**Two options:**
1. **Set during deployment (Step 3)** - Include `--set-env-vars ALLOWED_ORIGIN="..."` in deploy command (if you have Vercel URL)
2. **Set after deployment** - Use Google Cloud Console (see "Updating CORS After Frontend Deployment" section below)

> **Note**: `PORT` is automatically set by Cloud Run - you don't need to configure it.

### Step 3: Build and Deploy to Cloud Run

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build and deploy using Cloud Build:
   ```bash
   gcloud run deploy musical-site-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars ALLOWED_ORIGIN="https://your-frontend-url.vercel.app"
   ```

   Or deploy using a Docker image:
   ```bash
   # Build the container image
   gcloud builds submit --tag gcr.io/PROJECT_ID/musical-site-backend
   
   # Deploy to Cloud Run
   gcloud run deploy musical-site-backend \
     --image gcr.io/PROJECT_ID/musical-site-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars ALLOWED_ORIGIN="https://your-frontend-url.vercel.app"
   ```

   Replace `PROJECT_ID` with your Google Cloud project ID.

### Step 3: Note Your Backend URL

After deployment, Google Cloud Run will provide a URL like:
```
https://musical-site-backend-xxxxx-uc.a.run.app
```

Save this URL - you'll need it for the frontend deployment.

## Frontend Deployment (Vercel)

📖 **For detailed step-by-step Vercel setup instructions, see [VERCEL_SETUP.md](./VERCEL_SETUP.md)**

### Quick Setup Steps

1. **Create Vercel Account**:
   - Go to [vercel.com](https://vercel.com) and sign up (use GitHub for easiest setup)

2. **Import Repository**:
   - Click "Add New Project"
   - Select your repository: `LevanPeradze/MusicSheit`
   - ⚠️ **Important**: Set **Root Directory** to `frontend`
   - Framework should auto-detect as Vite

3. **Deploy**:
   - Click "Deploy" - Vercel will build and deploy automatically
   - Save your Vercel URL (you'll need it for backend CORS)

4. **Set Environment Variables** (after backend is deployed):
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.run.app/api`
   - Redeploy for changes to take effect

### Alternative: Deploy via CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel login
   vercel
   ```

3. Set environment variable:
   ```bash
   vercel env add VITE_API_URL production
   # Enter: https://your-backend-url.run.app/api
   vercel --prod
   ```

## Post-Deployment Checklist

- [ ] Backend is running and accessible at Cloud Run URL
- [ ] Frontend is deployed and accessible at Vercel URL
- [ ] `VITE_API_URL` is set in Vercel environment variables
- [ ] `ALLOWED_ORIGIN` is set in Cloud Run environment variables (with your Vercel URL)
- [ ] Test API endpoints from frontend

## Updating CORS After Frontend Deployment

After you have your Vercel frontend URL, you need to update the `ALLOWED_ORIGIN` environment variable. Choose one method:

### Method 1: Using Google Cloud Console (Easiest)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Make sure you're in the correct project (top dropdown)
3. Navigate to **Cloud Run** (search in top bar or find in left menu)
4. Click on your service name: `musical-site-backend`
5. Click **"EDIT & DEPLOY NEW REVISION"** (top bar)
6. Scroll down to **"Variables & Secrets"** section
7. Under **"Environment variables"**, you'll see existing variables
   - If `ALLOWED_ORIGIN` exists: Click on it to edit the value
   - If it doesn't exist: Click **"ADD VARIABLE"**
8. Set:
   - **Name**: `ALLOWED_ORIGIN`
   - **Value**: `https://your-actual-vercel-url.vercel.app` (no trailing slash!)
9. Click **"DEPLOY"** (bottom of page)
10. Wait for deployment to complete (~30 seconds)

### Method 2: Using Command Line

```bash
gcloud run services update musical-site-backend \
  --region us-central1 \
  --update-env-vars ALLOWED_ORIGIN="https://your-actual-vercel-url.vercel.app"
```

Replace `your-actual-vercel-url.vercel.app` with your real Vercel URL (e.g., `musical-site-frontend-abc123.vercel.app`)

## Local Development

### Backend

```bash
cd backend
npm install
npm start        # Starts server on http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
# Create .env.local with VITE_API_URL=http://localhost:3000/api (optional, uses proxy by default)
npm run dev      # Starts dev server on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:3000` automatically.

## Troubleshooting

### Backend Issues

- **CORS errors**: Ensure `ALLOWED_ORIGIN` includes your frontend URL (no trailing slash)
- **Port errors**: Cloud Run sets `PORT` automatically, but ensure your code uses `process.env.PORT || 3000`

### Frontend Issues

- **API calls failing**: Verify `VITE_API_URL` is set correctly in Vercel
- **Build errors**: Ensure all dependencies are in `package.json`
- **Routing issues**: Vercel should handle SPA routing via `vercel.json`, but verify rewrites are configured

## Cost Estimates

- **Google Cloud Run**: Free tier includes 2 million requests/month
- **Vercel**: Free tier includes 100GB bandwidth/month

## Security Notes

1. Never commit `.env` files to Git
2. Use environment variables for all secrets
3. Consider using Google Secret Manager for sensitive data
4. Add authentication tokens (JWT) for API security

