# Deployment Plan: Google Cloud Run (Backend) + Vercel (Frontend)

Use this as a step-by-step runbook to ship the app to production.

---

## 0) Prerequisites
- Have `gcloud` CLI installed and authenticated (`gcloud init`).
- Have a GCP project selected and billing enabled.
- Have Docker available locally (for building/running images) or use Cloud Build.
- Have a PostgreSQL instance/connection string ready (Neon/RDS/Cloud SQL).
- Have a Vercel account with the CLI (`npm i -g vercel`) or use the Vercel dashboard.

---

## 1) Environment Variables

### Backend (Cloud Run)
- `DATABASE_URL` — Postgres connection string (with `sslmode=require` if using managed DB).
- `ALLOWED_ORIGIN` — your Vercel frontend URL (e.g., `https://your-site.vercel.app`).
- `PORT` — Cloud Run will set this automatically, but keep it in the service.
- `NODE_ENV` — `production`.

### Frontend (Vercel)
- `VITE_API_URL` — the Cloud Run HTTPS URL (e.g., `https://api-xxx.run.app`).

Use `.env` locally; set the same keys in the respective platform secret managers.

---

## 2) Backend: Google Cloud Run
1. **Enable APIs**  
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com
   ```
2. **Build & push the container** (from repo root)  
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/musicalsite-api
   ```
3. **Deploy to Cloud Run**  
   ```bash
   gcloud run deploy musicalsite-api \
     --image gcr.io/PROJECT_ID/musicalsite-api \
     --platform managed \
     --region REGION \
     --allow-unauthenticated \
     --set-env-vars DATABASE_URL="postgres://..." \
     --set-env-vars ALLOWED_ORIGIN="https://your-site.vercel.app" \
     --set-env-vars NODE_ENV=production
   ```
   Cloud Run will assign an HTTPS URL; note it for the frontend.
4. **(Optional) Connect to Cloud SQL**  
   If using Cloud SQL instead of Neon, add `--add-cloudsql-instances INSTANCE_CONNECTION_NAME` and ensure `DATABASE_URL` references the Unix socket.
5. **Smoke test**  
   ```bash
   curl -X GET "https://<cloud-run-url>/api/db/test"
   ```

---

## 3) Frontend: Vercel
1. **Project setup**  
   - Import the GitHub repo into Vercel (or `vercel link` via CLI).
2. **Environment variables**  
   - Add `VITE_API_URL=https://<cloud-run-url>` in Vercel Project Settings → Environment Variables (Production + Preview).
3. **Build settings**  
   - Framework: Vite  
   - Build command: `npm run build`  
   - Output directory: `dist`
4. **Deploy**  
   - Push to `main` or run `vercel --prod` from the repo root.
5. **Verify**  
   - Open the Vercel URL and run through login/register/profile flows.

---

## 4) Local Parity / Testing Checklist
- Run migrations against the production DB once before first deploy:
  ```bash
  DATABASE_URL="postgres://..." npm run migrate
  ```
- Local run with prod API base:
  ```bash
  VITE_API_URL="http://localhost:3000/api" npm run dev:frontend
  ```
- Sanity tests:
  - `POST /api/register` and `POST /api/login`
  - `GET /api/interests`
  - `GET /api/courses?userId=1`
  - Profile update round-trip

---

## 5) Ongoing Ops
- **Secrets rotation**: update Cloud Run & Vercel env vars, then redeploy.
- **DB migrations**: run `npm run migrate` against the target DB before deploying new schema-dependent code.
- **Monitoring**: check Cloud Run logs (`gcloud logs tail --project PROJECT_ID --service musicalsite-api`).
- **CORS**: keep `ALLOWED_ORIGIN` in sync with the Vercel domain.

---

## 6) Quick Recovery Steps
- Roll back Cloud Run: `gcloud run services update-traffic musicalsite-api --to-revisions <REV>=100`.
- Roll back frontend: redeploy a previous commit via Vercel.

