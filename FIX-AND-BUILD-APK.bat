@echo off
title FIX BUILD ERROR - Clean and Rebuild
color 0C
cls

echo.
echo ========================================================
echo   FIXING BUILD ERROR - Complete Clean and Rebuild
echo ========================================================
echo.
echo Problem Found:
echo   Build is still referencing OLD OneDrive path
echo   Need to clean everything and rebuild fresh
echo.
echo This will:
echo   1. Delete node_modules (old path references)
echo   2. Delete android build folders
echo   3. Reinstall dependencies fresh
echo   4. Build release APK
echo.
echo Time: 15-20 minutes
echo.
pause

REM ============================================================
REM STEP 1: Stop all processes
REM ============================================================
echo.
echo [1/10] Stopping all processes...
echo.
taskkill /F /IM node.exe 2>nul
taskkill /F /IM java.exe 2>nul
taskkill /F /IM gradle.exe 2>nul
timeout /t 2 /nobreak >nul
echo Done!

REM ============================================================
REM STEP 2: Delete node_modules
REM ============================================================
echo.
echo [2/10] Deleting old node_modules...
echo.
cd C:\RNProjects\LocationTracker
if exist "node_modules" (
    echo Deleting... (this takes 2-3 minutes)
    rmdir /s /q node_modules
    echo Done!
) else (
    echo Already deleted, skipping...
)

REM ============================================================
REM STEP 3: Delete package-lock
REM ============================================================
echo.
echo [3/10] Deleting package-lock.json...
echo.
if exist "package-lock.json" (
    del /f package-lock.json
    echo Done!
) else (
    echo Not found, skipping...
)

REM ============================================================
REM STEP 4: Delete android build folders
REM ============================================================
echo.
echo [4/10] Deleting android build folders...
echo.
if exist "android\build" (
    rmdir /s /q android\build
)
if exist "android\app\build" (
    rmdir /s /q android\app\build
)
if exist "android\.gradle" (
    rmdir /s /q android\.gradle
)
echo Done!

REM ============================================================
REM STEP 5: Clean npm cache
REM ============================================================
echo.
echo [5/10] Cleaning npm cache...
echo.
call npm cache clean --force
echo Done!

REM ============================================================
REM STEP 6: Reinstall dependencies
REM ============================================================
echo.
echo [6/10] Installing dependencies (fresh)...
echo.
echo This will take 5-7 minutes...
echo.
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo Done!

REM ============================================================
REM STEP 7: Verify keystore
REM ============================================================
echo.
echo [7/10] Verifying keystore...
echo.
if exist "android\app\my-release-key.keystore" (
    echo Keystore found!
) else (
    echo ERROR: Keystore not found!
    echo Please generate keystore first.
    pause
    exit /b 1
)

REM ============================================================
REM STEP 8: Get keystore password
REM ============================================================
echo.
echo [8/10] Keystore password...
echo.
set /p KEYSTORE_PASSWORD="Enter keystore password: "

REM ============================================================
REM STEP 9: Update gradle.properties
REM ============================================================
echo.
echo [9/10] Updating gradle.properties...
echo.

REM Backup old gradle.properties
if exist "android\gradle.properties" (
    copy /y android\gradle.properties android\gradle.properties.bak >nul
)

REM Remove old signing config if exists
findstr /V "MYAPP_RELEASE" android\gradle.properties > android\gradle.properties.tmp
move /y android\gradle.properties.tmp android\gradle.properties >nul

REM Add new signing config
(
echo.
echo # Release Signing Config
echo MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
echo MYAPP_RELEASE_KEY_ALIAS=my-key-alias
echo MYAPP_RELEASE_STORE_PASSWORD=%KEYSTORE_PASSWORD%
echo MYAPP_RELEASE_KEY_PASSWORD=%KEYSTORE_PASSWORD%
) >> android\gradle.properties

echo Done!

REM ============================================================
REM STEP 10: Build Release APK
REM ============================================================
echo.
echo [10/10] Building Release APK...
echo.
echo This will take 10-15 minutes on first build
echo Please wait...
echo.

cd android
call gradlew assembleRelease --no-daemon --warning-mode all
if errorlevel 1 (
    echo.
    echo ========================================================
    echo   BUILD FAILED AGAIN!
    echo ========================================================
    echo.
    echo Please check error messages above.
    echo.
    echo Common issues:
    echo   1. Antivirus blocking build
    echo   2. Insufficient disk space
    echo   3. JDK version mismatch
    echo.
    pause
    exit /b 1
)
cd ..

REM ============================================================
REM Copy APK
REM ============================================================
echo.
echo Copying APK to easy location...
echo.

set APK_SOURCE=android\app\build\outputs\apk\release\app-release.apk
set APK_DEST=LocationTracker-v1.0.apk

if exist "%APK_SOURCE%" (
    copy /y "%APK_SOURCE%" "%APK_DEST%" >nul
    
    REM Get file size
    for %%A in ("%APK_DEST%") do set APK_SIZE=%%~zA
    set /a APK_SIZE_MB=%APK_SIZE%/1024/1024
    
    echo APK created successfully!
) else (
    echo ERROR: APK file not found!
    pause
    exit /b 1
)

REM ============================================================
REM SUCCESS!
REM ============================================================
cls
echo.
echo ========================================================
echo   BUILD SUCCESSFUL!
echo ========================================================
echo.
echo APK File: LocationTracker-v1.0.apk
echo Location: C:\RNProjects\LocationTracker\LocationTracker-v1.0.apk
echo Size: %APK_SIZE_MB% MB
echo.
echo ========================================================
echo   IMPORTANT - Backend URL:
echo ========================================================
echo.
echo Current: https://your-backend.herokuapp.com/api
echo.
echo Before testing, update backend URL in:
echo   src\config\api.ts
echo.
echo Options:
echo   1. For same WiFi test: http://YOUR_LAPTOP_IP:5000/api
echo   2. For cloud backend: https://yourapp.herokuapp.com/api
echo.
echo ========================================================
echo   TESTING:
echo ========================================================
echo.
echo 1. Copy APK to phone
echo 2. Enable "Unknown Sources"
echo 3. Install and test
echo.
echo ========================================================
echo.
pause

REM Open folder
explorer /select,"%CD%\LocationTracker-v1.0.apk"
