# StudyTrack

## Run Instructions

### Step 1 — Start MongoDB
```bash
brew services start mongodb-community
```

### Step 2 — Backend (Terminal 1)
```bash
cd backend
npm install
node server.js
```
Should show: MongoDB connected / Server running on http://localhost:5002

### Step 3 — Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

## Port
Backend runs on port 5002. If you change it, update frontend/src/data/api.js line 1.
