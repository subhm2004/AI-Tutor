# AI Tutor Setup Guide

This guide helps you set up and run the project on macOS/Linux.

## 1) Prerequisites

- Node.js: **v20 LTS recommended**
- npm: comes with Node
- Python: **3.10+** (project also works with newer Python, but 3.10/3.11 is safest)

Optional but recommended:

- `nvm` for managing Node versions

## 2) Project Structure

- `frontend/` -> Next.js app (UI)
- `backend/` -> Flask API + AI agents
- root `package.json` -> runs frontend + backend together

## 3) Environment Variables

### Backend env

File: `backend/.env`

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

### Frontend env

File: `frontend/.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:5000
```

## 4) Install Dependencies

Run these commands from project root:

```bash
# Root dependency (concurrently)
npm install

# Frontend dependencies
npm --prefix frontend install

# Backend virtual environment
rm -rf backend/venv
python3 -m venv backend/venv

# Install backend runtime dependencies
backend/venv/bin/pip install -r backend/requirements.txt
```

## 5) Run the Project

### Option A: One command (recommended)

```bash
npm run dev
```

This should start:

- Backend: `http://127.0.0.1:5000`
- Frontend: `http://localhost:3000`

### Option B: Run services separately (if one-command run hangs)

Terminal 1:

```bash
cd backend
venv/bin/python app.py
```

Terminal 2:

```bash
cd frontend
npm run dev
```

## 6) Health Checks

Backend health endpoint:

```bash
curl http://127.0.0.1:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "Tutor system is healthy."
}
```

Frontend check:

- Open `http://localhost:3000` in browser

## 7) Common Issues & Fixes

### Issue: Backend venv exists but Python executable not found

Cause: old/broken virtual env symlinks.

Fix:

```bash
rm -rf backend/venv
python3 -m venv backend/venv
```

Then reinstall backend dependencies.

### Issue: Frontend `npm run dev` hangs on startup

Cause: Node version compatibility in some environments.

Fix (use Node 20 LTS):

```bash
nvm install 20
nvm use 20
cd frontend && npm run dev
```

### Issue: Groq/auth errors in backend

Check:

- `backend/.env` has valid `GROQ_API_KEY`
- Key is active and not restricted incorrectly

## 8) Useful Commands

Run only frontend:

```bash
npm --prefix frontend run dev
```

Run only backend:

```bash
cd backend && venv/bin/python app.py
```

## 9) Security Note

Do not commit real API keys. Keep `backend/.env` private and rotate keys if they were shared.

