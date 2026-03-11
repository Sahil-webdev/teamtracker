@echo off
title RESTART BACKEND WITH NEW DATABASE
color 0A
cls

echo.
echo ========================================================
echo   BACKEND DATABASE UPDATE
echo ========================================================
echo.
echo NEW FEATURES ADDED:
echo   - Location tracking timestamps
echo   - Last login tracking
echo   - User blocking capability
echo   - User deletion with confirmation
echo   - Live location updates
echo.
echo This script will:
echo   1. Stop any running backend
echo   2. Backup old database (if exists)
echo   3. Create fresh database with new schema
echo   4. Start backend server
echo.
pause

REM Stop any running Python/Flask processes
echo.
echo [1/4] Stopping any running backend...
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul
echo Done!

REM Backup old database
echo.
echo [2/4] Backing up old database...
cd backend
if exist "instance\location_tracker.db" (
    set BACKUP_NAME=instance\location_tracker_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.db
    set BACKUP_NAME=%BACKUP_NAME: =0%
    copy "instance\location_tracker.db" "%BACKUP_NAME%" >nul 2>&1
    echo Backup created: %BACKUP_NAME%
    del "instance\location_tracker.db"
    echo Old database deleted
) else (
    echo No existing database found
)

REM Create fresh database
echo.
echo [3/4] Creating fresh database with new schema...
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database created successfully!')"
if errorlevel 1 (
    echo ERROR: Failed to create database!
    echo.
    echo Make sure:
    echo   1. Python is installed
    echo   2. You're in the correct directory
    echo   3. All dependencies are installed (pip install -r requirements.txt)
    pause
    exit /b 1
)
echo Done!

REM Start backend
echo.
echo [4/4] Starting backend server...
echo.
echo ========================================================
echo   BACKEND RUNNING
echo ========================================================
echo.
echo Backend URL: http://localhost:5000
echo API URL: http://localhost:5000/api
echo.
echo Master Login Credentials:
echo   Email: master@office.com
echo   Password: master123
echo.
echo Press Ctrl+C to stop the server
echo ========================================================
echo.

python app.py
