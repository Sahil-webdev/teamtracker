@echo off
title WHITE SCREEN FIX - Complete Reset
color 0C
cls

echo.
echo ============================================================
echo   WHITE SCREEN FIX - Complete System Reset
echo ============================================================
echo.
echo This will completely reset everything and start fresh.
echo.
pause

REM ============================================================
REM STEP 1: Kill EVERYTHING
REM ============================================================
echo.
echo [1/10] Killing all processes...
echo.

REM Kill app
adb shell am force-stop com.locationtracker 2>nul

REM Kill Node/Metro
taskkill /F /IM node.exe 2>nul
taskkill /F /IM node 2>nul

REM Kill Python/Backend
taskkill /F /IM python.exe 2>nul
taskkill /F /IM python 2>nul

REM Kill gradle
taskkill /F /IM java.exe 2>nul

echo Done!
timeout /t 2 /nobreak >nul

REM ============================================================
REM STEP 2: Clear ALL caches
REM ============================================================
echo.
echo [2/10] Clearing all caches...
echo.

adb shell pm clear com.locationtracker 2>nul

REM Clear Metro cache
if exist "%TEMP%\metro-*" (
    rmdir /s /q "%TEMP%\metro-*" 2>nul
)
if exist "%TEMP%\react-*" (
    rmdir /s /q "%TEMP%\react-*" 2>nul
)

REM Clear project cache
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache" 2>nul
)

echo Done!

REM ============================================================
REM STEP 3: Update App.tsx for Master Panel
REM ============================================================
echo.
echo [3/10] Setting Master Panel mode...
echo.
powershell -Command "(Get-Content App.tsx) -replace 'initialRouteName=\"Login\"', 'initialRouteName=\"MasterLogin\"' | Set-Content App.tsx" >nul
echo Done!

REM ============================================================
REM STEP 4: Start Backend
REM ============================================================
echo.
echo [4/10] Starting Backend Server...
echo.
cd backend
start "Backend Server" cmd /c "title Backend Server - Port 5000 && color 0A && python app.py & pause"
cd ..
echo Waiting for backend...
timeout /t 4 /nobreak >nul

REM Check backend
powershell -Command "$b = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue; if ($b) { Write-Host '  Backend: RUNNING' -ForegroundColor Green } else { Write-Host '  Backend: FAILED!' -ForegroundColor Red; exit 1 }"
if errorlevel 1 (
    echo.
    echo ERROR: Backend failed to start!
    echo Check the Backend Server window for errors.
    pause
    exit /b 1
)

REM ============================================================
REM STEP 5: Clean Metro cache and start fresh
REM ============================================================
echo.
echo [5/10] Cleaning Metro Bundler cache...
echo.
call npx react-native start --reset-cache --port 8081 >nul 2>&1 &
echo Metro starting in background...
timeout /t 1 /nobreak >nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

REM ============================================================
REM STEP 6: Start Metro with full output
REM ============================================================
echo.
echo [6/10] Starting Metro Bundler (visible output)...
echo.
start "Metro Bundler" cmd /c "title Metro Bundler - Port 8081 && color 0E && npx react-native start --port 8081 & pause"
echo Waiting for Metro to be ready...
echo.

REM Wait 30 seconds with progress
for /L %%i in (1,1,30) do (
    echo|set /p="."
    timeout /t 1 /nobreak >nul
)
echo.

REM Check Metro
powershell -Command "$m = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue; if ($m) { Write-Host '  Metro: RUNNING' -ForegroundColor Green } else { Write-Host '  Metro: FAILED!' -ForegroundColor Red; exit 1 }"
if errorlevel 1 (
    echo.
    echo ERROR: Metro failed to start!
    echo Check the Metro Bundler window for errors.
    pause
    exit /b 1
)

REM ============================================================
REM STEP 7: Uninstall old app
REM ============================================================
echo.
echo [7/10] Uninstalling old app...
echo.
adb uninstall com.locationtracker 2>nul
echo Done!

REM ============================================================
REM STEP 8: Clean build
REM ============================================================
echo.
echo [8/10] Clean build (this takes time)...
echo.
cd android
call gradlew clean assembleDebug
cd ..

REM ============================================================
REM STEP 9: Install app
REM ============================================================
echo.
echo [9/10] Installing app...
echo.
call npx react-native run-android --no-packager

REM ============================================================
REM STEP 10: Wait and verify
REM ============================================================
echo.
echo [10/10] Waiting for bundle to load...
echo.
timeout /t 15 /nobreak

REM ============================================================
REM DONE
REM ============================================================
cls
echo.
echo ============================================================
echo   FIX COMPLETE!
echo ============================================================
echo.
echo Status:
powershell -Command "$b = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue; $m = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue; if ($b) { Write-Host '  Backend: RUNNING' -ForegroundColor Green } else { Write-Host '  Backend: NOT RUNNING' -ForegroundColor Red }; if ($m) { Write-Host '  Metro: RUNNING' -ForegroundColor Green } else { Write-Host '  Metro: NOT RUNNING' -ForegroundColor Red }"
echo.
echo ============================================================
echo   CHECK THE EMULATOR NOW!
echo ============================================================
echo.
echo If STILL white screen:
echo   1. Check Metro Bundler window - any RED errors?
echo   2. Check Backend Server window - running properly?
echo   3. In emulator, shake device or press Ctrl+M
echo   4. Click "Reload" in dev menu
echo.
echo Login Credentials:
echo   Email: master@office.com
echo   Password: master123
echo.
echo ============================================================
echo.
pause
