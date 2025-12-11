# Fix: Double /api/api/ in URL

## Problem

You're seeing errors like:
```
/api/api/register - 404 Not Found
```

This happens because:
1. Your `VITE_API_URL` in Vercel is set to: `https://your-backend-url.run.app/api`
2. Your frontend code calls: `/api/register`
3. Result: `https://your-backend-url.run.app/api` + `/api/register` = `/api/api/register` ❌

## Solution

**Option 1: Fix Vercel Environment Variable (Easiest)**

In Vercel, change `VITE_API_URL` to **remove the `/api` part**:

**Wrong:**
```
VITE_API_URL=https://your-backend-url.run.app/api
```

**Correct:**
```
VITE_API_URL=https://your-backend-url.run.app
```

### Steps to Fix:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL`
5. Click **Edit** or **Delete and re-add**
6. Set value to: `https://musical-site-backend-162143620204.us-central1.run.app` (YOUR backend URL, no `/api`)
7. Click **Save**
8. Go to **Deployments** tab
9. Click the **...** (three dots) on the latest deployment
10. Click **Redeploy**
11. Wait for deployment to complete

**Option 2: Update Frontend Code (More Work)**

If you prefer to keep `VITE_API_URL` with `/api`, you'd need to change all frontend API calls from `/api/xxx` to just `/xxx`. But Option 1 is much easier!

## How to Check Your Current Setting

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Look at the value of `VITE_API_URL`
3. It should be: `https://musical-site-backend-162143620204.us-central1.run.app` (no `/api` at the end)

## After Fixing

Once you redeploy with the correct `VITE_API_URL`:
- `/api/register` will become: `https://your-backend.run.app/api/register` ✅
- `/api/login` will become: `https://your-backend.run.app/api/login` ✅
- All API calls should work correctly

## Test It

After redeploying, try registering again. The URL should be:
```
https://musical-site-backend-162143620204.us-central1.run.app/api/register
```

Not:
```
https://musical-site-backend-162143620204.us-central1.run.app/api/api/register
```

