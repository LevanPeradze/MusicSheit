# How to Set Environment Variables in Google Cloud Run

This guide shows you exactly how to set environment variables for your backend service.

## What Environment Variables Do You Need?

For this project, you only need:
- `ALLOWED_ORIGIN` - Your frontend URL (from Vercel) to allow CORS requests

The `PORT` variable is automatically set by Cloud Run, so you don't need to configure it.

## When to Set Environment Variables

**You can set them at any time:**
- ✅ During initial deployment (Step 3)
- ✅ After deployment via Google Cloud Console (easier)
- ✅ After deployment via command line

## Method 1: During Deployment (Recommended if you have Vercel URL ready)

When you run the deploy command, include the environment variable:

```bash
cd backend
gcloud run deploy musical-site-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ALLOWED_ORIGIN="https://your-vercel-url.vercel.app"
```

Replace `your-vercel-url.vercel.app` with your actual Vercel frontend URL.

## Method 2: After Deployment via Google Cloud Console (Easiest)

### Step-by-Step Instructions:

1. **Open Google Cloud Console**
   - Go to: https://console.cloud.google.com
   - Make sure you're logged in with the correct Google account

2. **Select Your Project**
   - Click the project dropdown at the top (next to "Google Cloud")
   - Select your project (or the one you created for this deployment)

3. **Navigate to Cloud Run**
   - In the search bar at the top, type: `Cloud Run`
   - Click on "Cloud Run" in the results
   - Or find it in the left navigation menu under "Serverless" → "Cloud Run"

4. **Open Your Service**
   - You should see a list of Cloud Run services
   - Click on `musical-site-backend` (or whatever you named it)

5. **Edit the Service**
   - Click the **"EDIT & DEPLOY NEW REVISION"** button (top right of the page)

6. **Go to Variables & Secrets**
   - Scroll down the page
   - Find the **"Variables & Secrets"** section
   - Click to expand it if needed

7. **Add or Edit Environment Variable**
   
   **If the variable doesn't exist:**
   - Click **"ADD VARIABLE"** button
   - **Name**: Type `ALLOWED_ORIGIN` (exactly like this, all caps)
   - **Value**: Type your Vercel URL, for example: `https://musical-site-abc123.vercel.app`
     - ⚠️ Make sure there's **NO trailing slash** at the end
     - Make sure it starts with `https://`
   
   **If the variable already exists:**
   - Click on the `ALLOWED_ORIGIN` row
   - Update the value to your Vercel URL

8. **Deploy**
   - Scroll to the bottom of the page
   - Click the **"DEPLOY"** button (blue button, bottom right)
   - Wait 30-60 seconds for deployment to complete

9. **Verify**
   - After deployment completes, you'll be redirected to the service page
   - The new revision will be active
   - Your environment variable is now set!

## Method 3: After Deployment via Command Line

If you prefer using the command line:

```bash
# Update the ALLOWED_ORIGIN variable
gcloud run services update musical-site-backend \
  --region us-central1 \
  --update-env-vars ALLOWED_ORIGIN="https://your-vercel-url.vercel.app"
```

**Make sure:**
- You're authenticated: `gcloud auth login`
- You're in the correct project: `gcloud config set project PROJECT_ID`
- Replace `your-vercel-url.vercel.app` with your actual Vercel URL

## Viewing Current Environment Variables

To see what environment variables are currently set:

**Via Console:**
- Go to Cloud Run → Your service → Click service name
- Scroll to "Variables & Secrets" section

**Via Command Line:**
```bash
gcloud run services describe musical-site-backend \
  --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)"
```

## Common Mistakes to Avoid

❌ **Wrong format:**
```
ALLOWED_ORIGIN=https://your-url.vercel.app/  (trailing slash)
ALLOWED_ORIGIN=your-url.vercel.app  (missing https://)
```

✅ **Correct format:**
```
ALLOWED_ORIGIN=https://your-url.vercel.app
```

❌ **Variable name typo:**
```
ALLOWED_ORIGINS (with S)
allowed_origin (lowercase)
```

✅ **Correct name:**
```
ALLOWED_ORIGIN (exactly as shown)
```

## Troubleshooting

### "Variable not taking effect"
- Make sure you clicked "DEPLOY" after adding/editing the variable
- Wait for the deployment to complete (30-60 seconds)
- The service needs to restart for changes to take effect

### "Can't find Cloud Run in console"
- Make sure you've enabled the Cloud Run API (from Step 1)
- Try refreshing the page
- Make sure you're in the correct Google Cloud project

### "Permission denied"
- Make sure you're logged in with the correct Google account
- Make sure your account has "Cloud Run Admin" or "Editor" role in the project
- Check: IAM & Admin → IAM in Google Cloud Console

### "CORS errors still happening"
- Double-check the URL has no trailing slash
- Make sure it starts with `https://`
- Verify the variable name is exactly `ALLOWED_ORIGIN`
- Check that a new deployment was created and is active

## Quick Reference

**Where to find your Vercel URL:**
- After deploying to Vercel, you'll get a URL like: `https://musical-site-abc123.vercel.app`
- You can find it in your Vercel dashboard → Your project → Deployments

**Where to set environment variables:**
- Google Cloud Console → Cloud Run → Your Service → Edit → Variables & Secrets

**Format:**
- Name: `ALLOWED_ORIGIN`
- Value: `https://your-vercel-url.vercel.app` (no trailing slash)

---

**Next Steps:**
After setting `ALLOWED_ORIGIN`, your backend will accept requests from your frontend, and CORS errors should be resolved!

