# 6-Day GitHub Commit Plan

Use this plan to push meaningful progress daily. File lists match the **StudyTrack** repo (student code, questionnaire, results, dashboard, streak).

## Important

- Never commit `backend/.env`
- If `.env` gets staged by mistake:

```bash
git restore --staged backend/.env
```

- Do not commit `node_modules/` or `dist/` (already in `.gitignore`).

---

## Day 1 - Base Setup + Core Backend

Files:

- `backend/server.js`
- `backend/package.json`
- `backend/models/Student.js`
- `backend/routes/student.js`

Commands:

```bash
git add backend/server.js backend/package.json backend/models/Student.js backend/routes/student.js
git commit -m "Set up backend server and student code endpoints"
git push
```

---

## Day 2 - Results + Streak Backend

Files:

- `backend/models/Result.js`
- `backend/models/Streak.js`
- `backend/routes/results.js`
- `backend/routes/streak.js`

Commands:

```bash
git add backend/models/Result.js backend/models/Streak.js backend/routes/results.js backend/routes/streak.js
git commit -m "Add results and streak APIs with MongoDB models"
git push
```

---

## Day 3 - Frontend App Structure

Files:

- `frontend/index.html`
- `frontend/vite.config.js`
- `frontend/src/main.jsx`
- `frontend/src/App.jsx`
- `frontend/src/components/Nav.jsx`
- `frontend/src/data/api.js`
- `frontend/src/data/questions.js`

Commands:

```bash
git add frontend/index.html frontend/vite.config.js frontend/src/main.jsx frontend/src/App.jsx frontend/src/components/Nav.jsx frontend/src/data/api.js frontend/src/data/questions.js
git commit -m "Create frontend app structure, navigation, and API layer"
git push
```

---

## Day 4 - Main User Flow Pages

Files:

- `frontend/src/pages/Landing.jsx`
- `frontend/src/pages/CodeEntry.jsx`
- `frontend/src/pages/Questionnaire.jsx`
- `frontend/src/pages/Results.jsx`

Commands:

```bash
git add frontend/src/pages/Landing.jsx frontend/src/pages/CodeEntry.jsx frontend/src/pages/Questionnaire.jsx frontend/src/pages/Results.jsx
git commit -m "Implement student flow from landing to questionnaire and results"
git push
```

---

## Day 5 - Dashboard, Streak UI, Theme, and Static Assets

Files:

- `frontend/src/pages/Dashboard.jsx` (habit week grid, analytics, dashboard shell)
- `frontend/src/pages/Streak.jsx`
- `frontend/src/index.css` (DM Sans + Caveat, student-style theme)
- `frontend/public/dashboard-mockup.png` (optional sketch reference)
- `frontend/public/study-theme.svg`

If the dashboard hides the top nav when a code is set, include:

- `frontend/src/App.jsx`

Commands:

```bash
git add frontend/src/pages/Dashboard.jsx frontend/src/pages/Streak.jsx frontend/src/index.css frontend/public/dashboard-mockup.png frontend/public/study-theme.svg frontend/src/App.jsx
git commit -m "Add dashboard and streak UI with habit grid, theme, and public assets"
git push
```

---

## Day 6 - Root Scripts, Lockfiles, and This Plan

Files:

- `package.json`
- `package-lock.json`
- `frontend/package-lock.json`
- `backend/package-lock.json`
- `COMMIT_PLAN_6_DAYS.md` (this file)

Commands:

```bash
git add package.json package-lock.json frontend/package-lock.json backend/package-lock.json COMMIT_PLAN_6_DAYS.md
git commit -m "Add root run scripts, lockfiles, and 6-day commit plan doc"
git push
```

---

## Catch-up (one commit)

If you already built several days locally, you can push everything once (still never add `.env`):

```bash
git status
git add .
git commit -m "StudyTrack: backend APIs, frontend flow, dashboard, and tooling"
git push
```

---

## Daily Check (Optional)

Before pushing each day:

```bash
git status
```
