# Deployment Guide

This guide explains how to deploy the Musical School Website with the backend on Google Cloud Run and the frontend on Vercel.

## Project Structure

```
musicalsite-main/
├── backend/           # Node.js/Express API
│   ├── config/        # Database configuration
│   ├── migrations/    # Database migrations
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
3. **PostgreSQL Database** (Neon, Supabase, or Google Cloud SQL)
4. **Google Cloud SDK** (`gcloud`) installed locally (for backend deployment)
5. **Node.js 20+** installed locally

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

1. Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=postgresql://user:password@host/db?sslmode=require
   PORT=3000
   ALLOWED_ORIGIN=https://your-frontend-url.vercel.app
   ```

   > **Note**: Replace `your-frontend-url.vercel.app` with your actual Vercel frontend URL (you'll get this after deploying the frontend).

2. For Google Cloud Run, you'll need to set these as environment variables in the Cloud Run service.

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
     --set-env-vars DATABASE_URL="your-database-url",ALLOWED_ORIGIN="https://your-frontend-url.vercel.app"
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
     --set-env-vars DATABASE_URL="your-database-url",ALLOWED_ORIGIN="https://your-frontend-url.vercel.app"
   ```

   Replace `PROJECT_ID` with your Google Cloud project ID.

### Step 4: Run Database Migrations

After the backend is deployed, run migrations:

1. Option 1: Run migrations locally (set DATABASE_URL in your `.env`):
   ```bash
   cd backend
   npm install
   npm run migrate
   ```

2. Option 2: Run migrations from Cloud Run container:
   ```bash
   gcloud run jobs create migrate-job \
     --image gcr.io/PROJECT_ID/musical-site-backend \
     --region us-central1 \
     --set-env-vars DATABASE_URL="your-database-url" \
     --command="node" \
     --args="migrations/run_migrations.js"
   
   gcloud run jobs execute migrate-job --region us-central1
   ```

### Step 5: Note Your Backend URL

After deployment, Google Cloud Run will provide a URL like:
```
https://musical-site-backend-xxxxx-uc.a.run.app
```

Save this URL - you'll need it for the frontend deployment.

## Frontend Deployment (Vercel)

### Step 1: Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### Step 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Configure the project:
   - **Root Directory**: Select `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Set Environment Variables

In the Vercel project settings, add environment variables:

- **Variable**: `VITE_API_URL`
- **Value**: `https://your-backend-url.run.app/api`

Replace `your-backend-url.run.app` with your actual Google Cloud Run backend URL.

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

### Alternative: Deploy via CLI

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. When prompted, set environment variables:
   ```bash
   vercel env add VITE_API_URL production
   # Enter: https://your-backend-url.run.app/api
   ```

4. Redeploy to use the new environment variable:
   ```bash
   vercel --prod
   ```

## Post-Deployment Checklist

- [ ] Backend is running and accessible at Cloud Run URL
- [ ] Database migrations have been run
- [ ] Frontend is deployed and accessible at Vercel URL
- [ ] `VITE_API_URL` is set in Vercel environment variables
- [ ] `ALLOWED_ORIGIN` is set in Cloud Run environment variables (with your Vercel URL)
- [ ] Test user registration and login
- [ ] Test API endpoints from frontend

## Updating CORS After Frontend Deployment

After you have your Vercel frontend URL, update the Cloud Run service:

```bash
gcloud run services update musical-site-backend \
  --region us-central1 \
  --update-env-vars ALLOWED_ORIGIN="https://your-actual-vercel-url.vercel.app"
```

## Local Development

### Backend

```bash
cd backend
npm install
# Create .env file with DATABASE_URL
npm run migrate  # Run migrations
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

- **Database connection errors**: Verify `DATABASE_URL` is correct and the database is accessible
- **CORS errors**: Ensure `ALLOWED_ORIGIN` includes your frontend URL (no trailing slash)
- **Port errors**: Cloud Run sets `PORT` automatically, but ensure your code uses `process.env.PORT || 3000`

### Frontend Issues

- **API calls failing**: Verify `VITE_API_URL` is set correctly in Vercel
- **Build errors**: Ensure all dependencies are in `package.json`
- **Routing issues**: Vercel should handle SPA routing via `vercel.json`, but verify rewrites are configured

## Cost Estimates

- **Google Cloud Run**: Free tier includes 2 million requests/month
- **Vercel**: Free tier includes 100GB bandwidth/month
- **Database**: Depends on provider (Neon free tier, Supabase free tier, or Cloud SQL)

## Security Notes

1. Never commit `.env` files to Git
2. Use environment variables for all secrets
3. Consider using Google Secret Manager for sensitive data
4. Implement proper password hashing (currently passwords are stored in plain text - this should be fixed)
5. Add authentication tokens (JWT) for API security

