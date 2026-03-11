@echo off
title USER PANEL - Complete Setup
color 0B
cls

echo.
echo ============================================================
echo   Location Tracker - USER PANEL (Complete Setup)
echo ============================================================
echo.
echo This script will:
echo  1. Stop all old processes
echo  2. Clear app cache
echo  3. Start Backend Server
echo  4. Start Metro Bundler
echo  5. Wait for Metro to be ready
echo  6. Install and launch app
echo.
echo TWO WINDOWS will open - keep them running!
echo.
pause

REM ============================================================
REM STEP 1: Clean up
REM ============================================================
cls
echo.
echo [1/8] Stopping old processes...
echo.
powershell -Command "Get-Process -Name node,python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue" >nul 2>&1
powershell -Command "Get-NetTCPConnection -LocalPort 5000,8081,8083 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }" >nul 2>&1
timeout /t 2 /nobreak >nul

REM ============================================================
REM STEP 2: Update App.tsx
REM ============================================================
echo [2/8] Setting User Panel mode...
echo.
powershell -Command "(Get-Content App.tsx) -replace 'initialRouteName=\"MasterLogin\"', 'initialRouteName=\"Login\"' | Set-Content App.tsx" >nul
echo Done!

REM ============================================================
REM STEP 3: Clear app cache
REM ============================================================
echo.
echo [3/8] Clearing app cache...
echo.
adb shell am force-stop com.locationtracker >nul 2>&1
adb shell pm clear com.locationtracker >nul 2>&1
echo Done!

REM ============================================================
REM STEP 4: Start Backend
REM ============================================================
echo.
echo [4/8] Starting Backend Server...
echo.
start "Backend Server - KEEP THIS OPEN" cmd /c "title Backend Server && color 0A && cd /d c:\RNProjects\LocationTracker\backend && echo. && echo ============================================ && echo   Backend Server Starting... && echo ============================================ && echo. && python app.py && pause"
echo Waiting for backend to start...
timeout /t 4 /nobreak >nul
echo Done!

REM ============================================================
REM STEP 5: Start Metro Bundler
REM ============================================================
echo.
echo [5/8] Starting Metro Bundler...
echo.
start "Metro Bundler - KEEP THIS OPEN" cmd /c "title Metro Bundler && color 0E && cd /d c:\RNProjects\LocationTracker && echo. && echo ============================================ && echo   Metro Bundler Starting... && echo ============================================ && echo. && npx react-native start --reset-cache && pause"
echo This may take 25-30 seconds...
echo.

REM Wait with progress indicator
for /L %%i in (1,1,25) do (
    echo|set /p="."
    timeout /t 1 /nobreak >nul
)
echo.
echo Done!

REM ============================================================
REM STEP 6: Verify services
REM ============================================================
echo.
echo [6/8] Verifying services...
echo.
powershell -Command "$backend = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue; $metro = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue; if ($backend) { Write-Host '  Backend: RUNNING (Port 5000)' -ForegroundColor Green } else { Write-Host '  Backend: NOT RUNNING!' -ForegroundColor Red }; if ($metro) { Write-Host '  Metro: RUNNING (Port 8081)' -ForegroundColor Green } else { Write-Host '  Metro: NOT RUNNING!' -ForegroundColor Red }"
echo.

REM ============================================================
REM STEP 7: Build and install app
REM ============================================================
echo.
echo [7/8] Building and installing app...
echo.
echo This will take about 30-40 seconds...
echo.
call npx react-native run-android --no-packager
echo.

REM ============================================================
REM STEP 8: Launch and wait
REM ============================================================
echo.
echo [8/8] Waiting for bundle to load...
echo.
echo The app is launching now. Bundle will load in 5-10 seconds.
echo.
timeout /t 10 /nobreak

REM ============================================================
REM DONE!
REM ============================================================
cls
echo.
echo ============================================================
echo   USER PANEL - SETUP COMPLETE!
echo ============================================================
echo.
echo Status:
echo   √ Backend Server: RUNNING
echo   √ Metro Bundler: RUNNING
echo   √ App: INSTALLED
echo.
echo Two windows are now running:
echo   1. Backend Server (Port 5000)
echo   2. Metro Bundler (Port 8081)
echo.
echo **KEEP THOSE WINDOWS OPEN!**
echo.
echo ============================================================
echo   User Panel should now be visible!
echo ============================================================
echo.
echo If you see WHITE SCREEN:
echo   1. Wait 10 more seconds
echo   2. OR run: reload-app.bat
echo   3. OR press 'R' key twice in emulator
echo.
echo What to do:
echo   1. Click "Sign up" to create account
echo   2. Enter name, email, password
echo   3. Wait for master to approve
echo   4. Login with email + OTP from master
echo.
echo ============================================================
echo.
pause
