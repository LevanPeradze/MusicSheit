# Quick Start - Windows Commands

## Step-by-Step for Windows Users

### 1. Open PowerShell or Command Prompt

- Press `Win + X` and choose "Windows PowerShell" or "Command Prompt"
- Or search for "PowerShell" in the Start menu

### 2. Navigate to Your Project

First, go to your project folder:

```cmd
cd C:\musicalsite-main
```

Or wherever your project is located.

### 3. Go to Backend Folder

```cmd
cd backend
```

### 4. Deploy to Google Cloud Run

**Use this EXACT command (copy the whole thing as one line):**

```cmd
gcloud run deploy musical-site-backend --source . --platform managed --region us-central1 --allow-unauthenticated
```

**IMPORTANT:**
- Copy the ENTIRE command above
- Paste it as ONE LINE (no line breaks)
- Press Enter
- Wait for deployment to complete (1-3 minutes)

### 5. If You Want to Set ALLOWED_ORIGIN (After You Have Vercel URL)

Once you have your Vercel URL, you can update the environment variable:

```cmd
gcloud run services update musical-site-backend --region us-central1 --update-env-vars ALLOWED_ORIGIN="https://your-vercel-url.vercel.app"
```

Replace `your-vercel-url.vercel.app` with your actual Vercel URL.

## Common Mistakes to Avoid

❌ **Don't copy the markdown code block markers** (` ```bash `)
- Only copy the actual command inside

❌ **Don't use backslashes `\` for line continuation on Windows**
- Use single-line commands instead

❌ **Don't run commands from the Cloud SDK directory**
- Navigate to your project directory first: `cd C:\musicalsite-main\backend`

✅ **Do use single-line commands**
✅ **Do navigate to the backend folder first**
✅ **Do copy commands without the markdown syntax**

## Full Example (Copy This Exactly)

```cmd
cd C:\musicalsite-main
cd backend
gcloud run deploy musical-site-backend --source . --platform managed --region us-central1 --allow-unauthenticated
```

## Troubleshooting

### "The system cannot find the path specified"
- Make sure you're in the right directory
- Check that `C:\musicalsite-main\backend` exists
- Use `dir` (or `ls` in PowerShell) to see what's in the current folder

### "gcloud: command not found"
- Make sure Google Cloud SDK is installed
- Try closing and reopening PowerShell/CMD
- Or use Google Cloud Shell in the browser instead

### "ERROR: (gcloud.run.deploy) unrecognized arguments: \"
- You're using backslashes `\` - Windows doesn't support this
- Use the single-line command instead

