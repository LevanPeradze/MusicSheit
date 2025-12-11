# Quick Start Guide

## Project Structure

```
musicalsite-main/
├── backend/          # Backend API (deploy to Google Cloud Run)
│   ├── server.js
│   └── package.json
├── frontend/         # Frontend (deploy to Vercel)
│   ├── src/
│   ├── index.html
│   └── package.json
└── DEPLOYMENT.md     # Full deployment guide
```

## Local Development

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Set Up Environment (Optional)

**Backend** (`backend/.env` - optional):
```env
PORT=3000
ALLOWED_ORIGIN=http://localhost:5173
```

**Frontend** (`frontend/.env.local` - optional):
```env
VITE_API_URL=http://localhost:3000/api
```
> Note: Not needed for local dev - Vite proxies `/api` automatically

### 3. Start Servers

**Terminal 1:**
```bash
cd backend
npm start
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

Visit http://localhost:5173

## Deployment

### Backend → Google Cloud Run

```bash
cd backend
gcloud run deploy musical-site-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ALLOWED_ORIGIN="https://your-vercel-url.vercel.app"
```

### Frontend → Vercel

1. Go to vercel.com and import your repo
2. Set root directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-backend-url.run.app/api`
4. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## After Deployment

1. Update CORS `ALLOWED_ORIGIN` in Cloud Run with your Vercel URL
2. Set `VITE_API_URL` in Vercel environment variables

## Git Push

After restructuring, commit and push:

```bash
git add .
git commit -m "Restructure project: separate backend and frontend folders"
git push origin main
```

