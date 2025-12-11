# Simple Deployment Guide (Beginner-Friendly)

Goal: Backend on Google Cloud Run, Frontend on Vercel.

Keep this open while you work. Do the steps in order.

---

## What you need first
- A GCP project with billing on.
- `gcloud` CLI installed and logged in (`gcloud init`).
- A Postgres URL (e.g., from Neon/Render/Cloud SQL): `DATABASE_URL=postgres://user:pass@host/db?sslmode=require`
- A Vercel account.

---

## 1) Set required environment variables

Backend (Cloud Run):
- `DATABASE_URL` — your Postgres connection string.
- `ALLOWED_ORIGIN` — your Vercel URL (e.g., `https://your-site.vercel.app`).
- `NODE_ENV` — `production`.
Cloud Run auto-sets `PORT` (app already listens to it).

Frontend (Vercel):
- `VITE_API_URL` — the Cloud Run URL you get after deploy (e.g., `https://musicalsite-api-xyz.run.app`).

---

## 2) Deploy backend to Cloud Run (Google Cloud Console)
You can do everything in the web UI—no CLI required.

1) Open Cloud Run in console.cloud.google.com  
   - Left menu → Cloud Run → “Create service”.

2) Service basics  
   - Name: `musicalsite-api` (or your choice).  
   - Region: pick one (e.g., `europe-west1` or `us-central1`).  
   - Ingress/Authentication: allow all traffic (public) unless you want auth.

3) Source and build  
   - Deployment source: “Source repository”.  
   - Connect GitHub if prompted; select repo `LevanPeradze/MusicSheit` and branch `main`.  
   - Build type: “Dockerfile” (it will detect the Dockerfile in repo root).  
   - Build settings: keep defaults.

4) Environment variables (very important)  
   - Add:
     - `DATABASE_URL` = your Postgres URL  
     - `ALLOWED_ORIGIN` = your Vercel URL (e.g., `https://your-site.vercel.app`)  
     - `NODE_ENV` = `production`  
   - Do NOT set `PORT` (Cloud Run injects it automatically).

5) Resources (optional tweaks)  
   - Min instances: 0 (saves cost).  
   - Max instances: leave default unless you expect high traffic.

6) Deploy  
   - Click “Create”. Wait for build + deploy to finish.  
   - Copy the Service URL shown (e.g., `https://musicalsite-api-xyz.run.app`).

7) Smoke test (still in browser or via Cloud Shell)  
   - Open `https://<service-url>/api/db/test` in the browser.  
   - If it returns success JSON, backend is live and DB reachable.

---

## 3) Verify backend
```bash
curl https://<cloud-run-url>/api/db/test
```
If you see success JSON, the backend is up and talking to the DB.

---

## 4) Deploy frontend to Vercel
1) Import the GitHub repo into Vercel (or `vercel link`).
2) Set env var in Vercel: `VITE_API_URL=https://<cloud-run-url>`
3) Build settings: Framework Vite, Build command `npm run build`, Output `dist`.
4) Deploy (`vercel --prod` or push to `main`).
5) Open the Vercel URL and test login/register/profile.

---

## 5) Run DB migrations on production DB (once before first real use)
```bash
DATABASE_URL="postgres://..." npm run migrate
```

---

## 6) Common issues
- Backend won’t start on Cloud Run: most often `DATABASE_URL` missing/invalid. Redeploy with correct env.
- CORS errors in browser: update `ALLOWED_ORIGIN` in Cloud Run to match your Vercel URL, redeploy.
- Frontend hitting wrong API: ensure Vercel has the right `VITE_API_URL`, then redeploy frontend.

---

## 7) Quick rollback
- Cloud Run: `gcloud run services update-traffic musicalsite-api --to-revisions <REV>=100`
- Vercel: redeploy an earlier commit.

