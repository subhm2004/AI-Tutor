# IntellectA – Multi-Agent Learning Assistant

IntellectA is a personalized learning app with a Next.js frontend and Flask backend. Students can chat with subject-specific AI agents for Math, Physics, Chemistry, and History — with LaTeX math, image upload, and JWT authentication.

## Key Features

- **Interactive chat** — Multi-subject tutoring in one workspace
- **Smart routing** — Math, Physics, Chemistry, and History agents
- **LaTeX & chemistry** — Clear formulas and `\ce{}` notation
- **Image questions** — Upload problem photos from notes
- **Auth** — Register, login, secure JWT sessions
- **Chat tools** — Pin chats, regenerate answers, stop generation
- **Themes** — Light and dark mode

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Framer Motion, KaTeX
- **Backend:** Flask, Groq API, SQLite, JWT

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- npm

### Installation

```bash
git clone <repository_url>
cd AI-Tutor   # or your folder name

cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cd ../frontend
npm install

cd ..
npm install
```

### Environment

**`backend/.env`**

```env
GROQ_API_KEY=your_key
GROQ_MODEL=llama-3.1-8b-instant
JWT_SECRET_KEY=your_long_random_secret
JWT_EXPIRE_DAYS=7
```

**`frontend/.env.local`**

```env
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:5001
```

### Run

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://127.0.0.1:5001 (or your configured port)

See [SETUP.md](SETUP.md) for detailed troubleshooting.

## Project Structure

```
├── backend/          # Flask API, agents, auth
├── frontend/         # Next.js app
├── package.json      # Run both servers
└── SETUP.md
```

## License

See repository license file.
