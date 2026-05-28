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
JWT_SECRET_KEY=your_long_random_secret_here
JWT_EXPIRE_DAYS=7
```

### Frontend env

File: `frontend/.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:5001
```

## Auth (JWT)

- Register / login: `http://localhost:3000/login`
- Chat (`/chat`) requires a valid JWT token
- API routes protected: `POST /api/chat`, `POST /api/chat/image`
- Public routes: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/health`

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

### Issue: `GET /_next/static/...` returns 404 (blank page, broken CSS)

Cause: Next.js dev cache (`.next`) is out of sync with the browser. This often happens after:

- Stopping dev with `Ctrl+C` mid-compile
- Running `dev:clean` while the browser tab is still open
- Hot reload failing (`entryCSSFiles` / `fallback-build-manifest.json` errors in terminal)
- Partial `npm install` (e.g. only one package added)

Fix (do in order):

```bash
# 1) Stop dev server (Ctrl+C) — only one `next dev` should run

cd frontend
rm -rf .next
npm install
npm run dev
```

Then in the browser: **hard refresh** (`Cmd+Shift+R` on Mac) or open an incognito window.

If it still happens:

```bash
cd frontend
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

Optional script (clears cache before each dev start):

```bash
npm run dev:clean
```

### Issue: Webpack warnings (`<w> [webpack.cache.PackFileCacheStrategy]` / `next-route-loader`)

These are **warnings**, not app bugs. They appear when `.next/server` was deleted or not ready while webpack was still caching (often right after `dev:clean`, a failed compile, or saving many files quickly).

Fix: same as the 404 issue above — stop dev, `rm -rf .next`, `npm run dev`, hard refresh browser. The project uses in-memory webpack cache in dev to reduce this noise.

## 8) Useful Commands

Run only frontend:

```bash
npm --prefix frontend run dev
```

Run frontend with a fresh `.next` cache:

```bash
npm --prefix frontend run dev:clean
```

Run only backend:

```bash
cd backend && venv/bin/python app.py
```

## 9) Security Note

Do not commit real API keys. Keep `backend/.env` private and rotate keys if they were shared.

