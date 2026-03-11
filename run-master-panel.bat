@echo off
title Location Tracker - MASTER PANEL
color 0D
cls

echo.
echo ========================================================
echo   Location Tracker - MASTER PANEL LAUNCHER
echo ========================================================
echo.

REM Step 1: Clean up old processes
echo [1/6] Cleaning up old processes...
powershell -Command "Get-NetTCPConnection -LocalPort 5000,8081,8083 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }" >nul 2>&1
timeout /t 1 /nobreak >nul

REM Step 2: Use Master app flavor
echo [2/6] Preparing Master app flavor...
adb shell am force-stop com.locationtracker.master >nul 2>&1
adb shell pm clear com.locationtracker.master >nul 2>&1

REM Step 3: Start Backend in new window
echo [3/6] Starting Backend Server...
start "Backend Server - DO NOT CLOSE" cmd /k "cd /d c:\RNProjects\LocationTracker\backend && echo Backend Starting... && python app.py"
timeout /t 3 /nobreak >nul

REM Step 4: Start Metro Bundler in new window
echo [4/6] Starting Metro Bundler...
start "Metro Bundler - DO NOT CLOSE" cmd /k "cd /d c:\RNProjects\LocationTracker && echo Metro Bundler Starting... && npx react-native start --reset-cache"
echo Waiting for Metro to initialize (20 seconds)...
timeout /t 20 /nobreak

REM Step 5: Build and install app
echo [5/6] Building and installing app...
call npx react-native run-android --mode masterDebug --appId com.locationtracker.master --no-packager

REM Step 6: Done
echo.
echo [6/6] Complete!
echo.
echo ========================================================
echo   MASTER PANEL is now running!
echo ========================================================
echo.
echo Two windows opened:
echo   1. Backend Server (Port 5000)
echo   2. Metro Bundler (Port 8081)
echo.
echo Keep those windows open while using the app!
echo.
echo Master Login Credentials:
echo   Email: master@office.com
echo   Password: master123
echo.
echo App should be running on your emulator now.
echo If you see white screen, wait 10 seconds and reload (double tap R)
echo.
pause
