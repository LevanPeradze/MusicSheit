# Complete Vercel Setup Guide

This guide walks you through setting up Vercel from scratch and deploying your frontend.

## Step 1: Create a Vercel Account

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com)

2. **Sign Up**: 
   - Click the **"Sign Up"** button (top right)
   - Choose one of the sign-up options:
     - **GitHub** (recommended - easiest if your code is on GitHub)
     - **GitLab**
     - **Bitbucket**
     - **Email** (you can connect Git later)

3. **Authorize Access** (if using GitHub/GitLab/Bitbucket):
   - You'll be asked to authorize Vercel to access your repositories
   - Click **"Authorize"** or **"Install"** - this allows Vercel to read your repos for deployment

4. **Complete Profile** (optional):
   - You can skip onboarding steps and go straight to the dashboard

## Step 2: Import Your Repository

1. **From Vercel Dashboard**:
   - You should see a dashboard or landing page
   - Click **"Add New..."** button (usually top right)
   - Then click **"Project"**

2. **Connect Repository**:
   - If this is your first time, you may need to:
     - Click **"Import Git Repository"**
     - You'll see a list of your repositories (if connected via GitHub/GitLab/Bitbucket)
     - Or click **"Configure GitHub App"** / **"Connect Git Provider"** if needed
   
3. **Select Your Repository**:
   - Find and click on **`LevanPeradze/MusicSheit`** (or your repo name)
   - If you don't see it, make sure:
     - Your Git provider account is connected
     - The repository exists and you have access to it

4. **Configure the Project**:

   **Important Settings:**
   
   - **Project Name**: You can keep the default or change it (e.g., `musical-site-frontend`)
   
   - **Root Directory**: 
     - Click **"Edit"** or **"Configure"**
     - Click **"Root Directory"**
     - Select or type: `frontend`
     - ⚠️ **This is critical!** It tells Vercel where your frontend code is located
   
   - **Framework Preset**: 
     - Should auto-detect as **"Vite"**
     - If not, select **"Vite"** from the dropdown
   
   - **Build Command**: 
     - Should be: `npm run build`
     - Verify this is correct
   
   - **Output Directory**: 
     - Should be: `dist`
     - This is where Vite builds your app
   
   - **Install Command**: 
     - Should be: `npm install`
     - Leave as default

5. **Environment Variables** (you'll set this later):
   - For now, you can skip this section
   - You'll add `VITE_API_URL` after you have your backend URL
   - Click **"Deploy"** to continue

## Step 3: First Deployment

1. **Start Deployment**:
   - Click the **"Deploy"** button
   - Vercel will:
     - Clone your repository
     - Install dependencies (`npm install` in the `frontend` folder)
     - Build your project (`npm run build`)
     - Deploy to a CDN

2. **Wait for Build**:
   - You'll see a build log in real-time
   - This usually takes 1-3 minutes
   - Look for: "✓ Build completed" or "✓ Deployment ready"

3. **Get Your URL**:
   - Once deployed, you'll see a success message
   - Your site will be live at a URL like:
     ```
     https://musical-site-frontend-xxxxx.vercel.app
     ```
   - **Save this URL!** You'll need it to:
     - Update your backend CORS settings
     - Share your deployed frontend

## Step 4: Set Environment Variables (After Backend is Deployed)

Once you have your backend deployed on Google Cloud Run:

1. **Go to Project Settings**:
   - In your Vercel dashboard, click on your project
   - Go to **"Settings"** tab (top menu)
   - Click **"Environment Variables"** in the left sidebar

2. **Add Environment Variable**:
   - Click **"Add New"** or **"Add"**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.run.app/api`
     - Replace `your-backend-url.run.app` with your actual Google Cloud Run backend URL
     - Make sure to include `/api` at the end
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

3. **Redeploy**:
   - Go back to the **"Deployments"** tab
   - Click the **"..."** (three dots) on your latest deployment
   - Click **"Redeploy"**
   - Or make a small change and push to trigger a new deployment

## Step 5: Custom Domain (Optional)

If you want a custom domain:

1. Go to **Settings** → **Domains**
2. Enter your domain name
3. Follow Vercel's instructions to configure DNS
4. Vercel will automatically set up SSL certificates

## Troubleshooting

### Build Fails

**Error: "Build Command failed"**
- Check that `Root Directory` is set to `frontend`
- Verify `package.json` exists in the `frontend` folder
- Check the build logs for specific errors

**Error: "Module not found"**
- Make sure all dependencies are in `frontend/package.json`
- Vercel installs from `package.json` in the root directory you specified

**Error: "Cannot find module"**
- Ensure your `frontend/package.json` has all required dependencies
- Check that imports in your code match what's installed

### Wrong Root Directory

If you forgot to set the root directory:
1. Go to **Settings** → **General**
2. Scroll to **"Root Directory"**
3. Change it to `frontend`
4. Save and redeploy

### Environment Variables Not Working

- Make sure the variable name is exactly `VITE_API_URL` (Vite requires `VITE_` prefix)
- After adding variables, you **must redeploy** for them to take effect
- Check that the value doesn't have trailing slashes (use `/api` not `/api/`)

### CORS Errors After Deployment

- Make sure you've updated your backend's `ALLOWED_ORIGIN` environment variable with your Vercel URL
- The Vercel URL should be like: `https://your-project.vercel.app` (no trailing slash)

## Quick Reference

### Vercel Dashboard URLs

- **Main Dashboard**: https://vercel.com/dashboard
- **Your Project**: https://vercel.com/your-username/your-project-name
- **Deployments**: Look under the "Deployments" tab in your project

### Important Commands (CLI Method - Alternative)

If you prefer using the command line:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to frontend folder
cd frontend

# Login to Vercel
vercel login

# Deploy (first time will ask questions)
vercel

# Deploy to production
vercel --prod

# Add environment variable
vercel env add VITE_API_URL production
```

## What Happens on Each Push?

If you connected via GitHub:
- Every push to your `main` branch automatically triggers a new deployment
- Vercel builds and deploys your latest code
- Previous deployments are kept (you can roll back if needed)

To disable auto-deployments:
- Go to **Settings** → **Git**
- Unlink repository or configure deployment branches

## Next Steps

After Vercel is set up:

1. ✅ **Get your Vercel URL** (e.g., `https://your-project.vercel.app`)
2. ✅ **Update backend CORS** with your Vercel URL:
   ```bash
   gcloud run services update musical-site-backend \
     --region us-central1 \
     --update-env-vars ALLOWED_ORIGIN="https://your-project.vercel.app"
   ```
3. ✅ **Set `VITE_API_URL`** in Vercel environment variables
4. ✅ **Test your deployed frontend** - it should now connect to your backend!

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Check your deployment logs in the Vercel dashboard for specific errors

