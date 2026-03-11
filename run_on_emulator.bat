@echo off
echo ========================================
echo   Location Tracker - Emulator Setup
echo ========================================
echo.

REM Kill old processes
echo [1/4] Stopping old processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul

REM Start backend server
echo [2/4] Starting backend server...
start "Backend Server" cmd /k "cd backend && python app.py"
timeout /t 3 /nobreak >nul

REM Check if emulator is running
echo [3/4] Checking emulator...
adb devices | find "emulator" >nul
if %errorlevel% neq 0 (
    echo ERROR: Emulator not running! Please start Android emulator first.
    echo Press any key to exit...
    pause >nul
    exit /b
)
echo Emulator OK!

REM Run app on emulator
echo [4/4] Running app on emulator...
echo This will take 2-3 minutes...
call npx react-native run-android

echo.
echo ========================================
echo   App should be running on emulator!
echo   Backend: http://localhost:5000
echo   Master Login: master@office.com / master123
echo ========================================
pause
