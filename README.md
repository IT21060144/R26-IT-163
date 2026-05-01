# StudyTrack

StudyTrack is a student-focused web app to track study habits using an anonymous code, questionnaire scoring, progress history, and streak tracking.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Features

- Anonymous student code (no login required)
- Questionnaire-based habit scoring
- Results view with score breakdown
- Dashboard for progress history
- Daily streak check-in tracker

## Project Structure

- `frontend` - React UI
- `backend` - Express API + MongoDB models/routes

## Environment Setup

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5002
```

## Install Dependencies

From project root:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Run (Single Command)

From project root:

```bash
npm run dev
```

Then open frontend URL shown in terminal (usually `http://127.0.0.1:5173`).

## Production-Style Run

Build frontend and serve from backend:

```bash
npm run start:prod
```

Open: `http://localhost:5002`

## API Health Check

```bash
GET /api
```

## Notes

- Do not commit `backend/.env`.
- If backend port changes, update `frontend/src/data/api.js`.
