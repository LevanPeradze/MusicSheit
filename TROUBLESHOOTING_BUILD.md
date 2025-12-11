# Troubleshooting Cloud Run Build Failures

## How to Check Build Logs

When you get a build failure, you need to check the Cloud Build logs. The error message gives you a URL like:

```
Logs are available at [https://console.cloud.google.com/cloud-build/builds;region=us-central1/...]
```

### Step-by-Step:

1. **Copy the full URL** from the error message (it's the long URL with the build ID)

2. **Paste it in your browser** or:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to **Cloud Build** → **History**
   - Click on the failed build (it should be at the top)

3. **Look for the error** - Scroll down to see the actual build logs and find where it failed

## Common Build Issues and Fixes

### Issue 1: Missing package-lock.json

**Error:** `npm ci` fails or package-lock.json not found

**Fix:**
```cmd
cd C:\musicalsite-main\backend
npm install
```

This will create a `package-lock.json` file. Then commit and push:
```cmd
git add package-lock.json
git commit -m "Add package-lock.json for backend"
git push origin main
```

### Issue 2: Dockerfile Issues

**Error:** Docker build fails, Dockerfile not found, or syntax errors

**Check:**
- Make sure `Dockerfile` exists in the `backend/` folder
- Make sure it's named exactly `Dockerfile` (no extension)
- Check the Dockerfile content is correct

### Issue 3: Module Not Found

**Error:** Cannot find module 'xxx' or dependency errors

**Fix:**
- Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify dependencies work
- Check that `package-lock.json` is up to date

### Issue 4: File Path Issues

**Error:** Cannot find file or path issues

**Check:**
- Make sure `server.js` exists in `backend/` folder
- Make sure all required files are in the backend folder
- Check `.dockerignore` isn't excluding needed files

### Issue 5: Build Timeout

**Error:** Build timeout or takes too long

**Fix:**
- Simplify the Dockerfile
- Reduce dependencies if possible
- Check for unnecessary files being copied

## Quick Fix: Generate package-lock.json

If you don't have `package-lock.json` in the backend folder:

```cmd
cd C:\musicalsite-main\backend
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push origin main
```

Then try deploying again.

## Alternative: Use Buildpacks Instead of Dockerfile

If Dockerfile continues to have issues, you can let Cloud Run use Buildpacks automatically. To do this:

1. **Rename or remove the Dockerfile temporarily:**
```cmd
cd C:\musicalsite-main\backend
ren Dockerfile Dockerfile.backup
```

2. **Deploy without Dockerfile** (Cloud Run will auto-detect Node.js):
```cmd
gcloud run deploy musical-site-backend --source . --platform managed --region us-central1 --allow-unauthenticated
```

3. **If that works, you can delete Dockerfile.backup**

## Still Having Issues?

1. **Check the actual build logs** (most important!)
   - Use the URL from the error message
   - Look for the specific error line
   - Share the error message for help

2. **Verify your backend folder structure:**
   ```
   backend/
   ├── server.js
   ├── package.json
   ├── package-lock.json (should exist)
   ├── config/
   │   └── database.js
   └── Dockerfile
   ```

3. **Test locally first:**
   ```cmd
   cd C:\musicalsite-main\backend
   npm install
   npm start
   ```
   If this works locally, the issue is likely with the Dockerfile or Cloud Build setup.

4. **Check Google Cloud Console:**
   - Make sure Cloud Build API is enabled
   - Check that you have proper permissions
   - Verify you're using the correct project

## Getting Help

When asking for help, provide:
1. The exact error message from build logs
2. Your backend folder structure
3. Contents of `package.json`
4. Contents of `Dockerfile`
5. Any relevant error lines from Cloud Build logs
