@echo off
echo ============================================
echo Database Schema Migration Helper
echo ============================================
echo.
echo WARNING: This will delete ALL data!
echo Use this ONLY when schema changes require it.
echo.
echo Examples of when to use:
echo - Added new columns to database models
echo - Changed column types
echo - Database corruption errors
echo.
set /p confirm="Are you sure? (yes/no): "

if /i "%confirm%" NEQ "yes" (
    echo Cancelled.
    pause
    exit /b
)

echo.
echo [1/2] Backing up old database...
if exist backend\instance\location_tracker.db (
    copy backend\instance\location_tracker.db backend\instance\backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.db
    echo Backup created!
) else (
    echo No database found to backup.
)

echo.
echo [2/2] Deleting old database...
del /F backend\instance\location_tracker.db 2>nul

echo.
echo Done! Database will be recreated on next backend start.
echo Master user (master@office.com / master123) will be auto-created.
echo.
pause
