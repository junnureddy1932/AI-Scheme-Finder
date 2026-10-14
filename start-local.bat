@echo off
title JanSahayak AI - Start Services
echo ========================================================
echo Starting JanSahayak AI Backend and Frontend Services
echo ========================================================

echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "JanSahayak Backend (FastAPI)" cmd /k "cd /d %~dp0backend && venv\Scripts\activate.bat && uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Launching Next.js Frontend on http://localhost:3000 ...
start "JanSahayak Frontend (Next.js)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo JanSahayak AI is starting!
echo Frontend: http://localhost:3000
echo Backend API Docs: http://127.0.0.1:8000/docs
echo ========================================================
