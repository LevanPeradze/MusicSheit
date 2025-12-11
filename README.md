# Musical School Website

Full-stack web application for a modern music school. Students can register, set their musical interests, and get course recommendations automatically tailored to them.

## Features

- **Authentication**: Register/Login functionality
- **Interests Profile**: Users pick genres, bands, instruments, styles
- **Dynamic Recommendations**: Courses are tagged with interests; page highlights which ones match the user
- **Vibrant UI**: React + Vite frontend with animated cards and stateful feedback
- **Comprehensive Backend**: Node.js/Express API

## Tech Stack

- **Frontend**: React 19 + Vite, React Router
- **Backend**: Node.js 20 + Express
- **Tooling**: npm scripts, `dotenv`

## Project Structure

```
musicalsite/
├── backend/           # Node.js/Express API
│   ├── server.js      # Express server entry point
│   └── package.json   # Backend dependencies
├── frontend/          # React + Vite application
│   ├── src/           # React source code
│   ├── index.html     # HTML template
│   ├── vite.config.js # Vite configuration
│   └── package.json   # Frontend dependencies
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dachi1234/musicalsite.git
cd musicalsite
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Environment Variables (Optional)

**Backend** (`backend/.env` - optional):
```
PORT=3000
ALLOWED_ORIGIN=http://localhost:5173
```

**Frontend** (`frontend/.env.local` - optional for local dev):
```
VITE_API_URL=http://localhost:3000/api
```

> Note: For local development, you don't need to set `VITE_API_URL` as Vite proxies `/api/*` to `http://localhost:3000` automatically.

### Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend runs on http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

Vite proxies `/api/*` calls to the Express server, so both should run simultaneously.

## Key API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/register` | Register user (username, password, optional email) |
| POST | `/api/login` | Authenticate user, returns profile (without password) |
| GET | `/api/interests` | List all available interests |
| GET/POST | `/api/users/:id/interests` | Fetch/update user interests |
| GET | `/api/courses?userId=:id` | Courses with `isForYou` + matching tags |
| POST | `/api/courses/:id/interests` | Attach interests to a course |

## Deployment

This project is designed to be deployed with:
- **Backend**: Google Cloud Run (or any Node.js hosting)
- **Frontend**: Vercel (or any static hosting)

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.**

### Quick Deployment Summary

1. **Deploy Backend to Google Cloud Run:**
   ```bash
   cd backend
   gcloud run deploy musical-site-backend --source . --platform managed --region us-central1
   ```

2. **Deploy Frontend to Vercel:**
   - Import repository in Vercel dashboard
   - Set root directory to `frontend`
   - Add environment variable: `VITE_API_URL=https://your-backend-url.run.app/api`

For complete step-by-step instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Roadmap

- Password hashing (bcrypt) + tokens
- Course enrollment + progress tracking
- Teacher/admin dashboards
- Email verification & notifications

---

Enjoy building the rest of the musical school experience! 🎶

