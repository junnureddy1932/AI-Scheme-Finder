@echo off
title JanSahayak AI - Stop Services
echo ========================================================
echo Stopping JanSahayak AI Local Services (Ports 8000 & 3000)
echo ========================================================

powershell -NoProfile -Command ^
  "Get-NetTCPConnection -LocalPort 8000, 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo Services stopped on ports 8000 and 3000.
pause
