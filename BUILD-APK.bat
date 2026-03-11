@echo off
title Build Release APK - Complete Process
color 0B
cls

echo.
echo ========================================================
echo   Building Release APK for Direct Distribution
echo ========================================================
echo.
echo This will:
echo  1. Fix OneDrive path issues
echo  2. Clean old references
echo  3. Configure signing
echo  4. Build release APK
echo.
echo Time: 10-15 minutes
echo.
pause

REM ============================================================
REM STEP 1: Stop processes that might lock files
REM ============================================================
echo.
echo [1/8] Stopping processes...
echo.
taskkill /F /IM node.exe 2>nul
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak >nul
echo Done!

REM ============================================================
REM STEP 2: Delete old node_modules (has old path references)
REM ============================================================
echo.
echo [2/8] Cleaning old node_modules...
echo.
cd C:\RNProjects\LocationTracker
if exist "node_modules" (
    echo Deleting node_modules folder...
    rmdir /s /q node_modules 2>nul
    echo Done!
) else (
    echo No node_modules found, skipping...
)

REM ============================================================
REM STEP 3: Reinstall dependencies
REM ============================================================
echo.
echo [3/8] Installing dependencies (fresh)...
echo.
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo Done!

REM ============================================================
REM STEP 4: Check keystore exists
REM ============================================================
echo.
echo [4/8] Checking keystore file...
echo.
if exist "android\app\my-release-key.keystore" (
    echo Keystore found: android\app\my-release-key.keystore
) else (
    echo ERROR: Keystore not found!
    echo Please run step 1 again to generate keystore.
    pause
    exit /b 1
)

REM ============================================================
REM STEP 5: Configure gradle.properties
REM ============================================================
echo.
echo [5/8] Configuring signing...
echo.

REM Read password from user
set /p KEYSTORE_PASSWORD="Enter keystore password: "

REM Update gradle.properties
(
echo MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
echo MYAPP_RELEASE_KEY_ALIAS=my-key-alias
echo MYAPP_RELEASE_STORE_PASSWORD=%KEYSTORE_PASSWORD%
echo MYAPP_RELEASE_KEY_PASSWORD=%KEYSTORE_PASSWORD%
) >> android\gradle.properties

echo Done!

REM ============================================================
REM STEP 6: Update build.gradle (if needed)
REM ============================================================
echo.
echo [6/8] Configuring build.gradle...
echo.
echo Manual step completed earlier - skipping
echo Done!

REM ============================================================
REM STEP 7: Build Release APK (SKIP CLEAN)
REM ============================================================
echo.
echo [7/8] Building Release APK...
echo.
echo This will take 5-10 minutes...
echo.

cd android
call gradlew assembleRelease --no-daemon
if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo Check the error messages above.
    pause
    exit /b 1
)
cd ..

echo.
echo Done!

REM ============================================================
REM STEP 8: Locate and copy APK
REM ============================================================
echo.
echo [8/8] Locating APK file...
echo.

set APK_PATH=android\app\build\outputs\apk\release\app-release.apk

if exist "%APK_PATH%" (
    echo SUCCESS! APK built successfully!
    echo.
    echo APK Location: %APK_PATH%
    
    REM Get file size
    for %%A in ("%APK_PATH%") do set APK_SIZE=%%~zA
    set /a APK_SIZE_MB=%APK_SIZE%/1024/1024
    echo APK Size: %APK_SIZE_MB% MB
    
    REM Copy to easy location
    copy "%APK_PATH%" "LocationTracker-v1.0.apk"
    echo.
    echo APK copied to: LocationTracker-v1.0.apk
) else (
    echo ERROR: APK not found!
    echo Build may have failed.
    pause
    exit /b 1
)

REM ============================================================
REM DONE!
REM ============================================================
cls
echo.
echo ========================================================
echo   BUILD COMPLETE!
echo ========================================================
echo.
echo APK File: LocationTracker-v1.0.apk
echo Location: C:\RNProjects\LocationTracker\LocationTracker-v1.0.apk
echo Size: %APK_SIZE_MB% MB
echo.
echo ========================================================
echo   NEXT STEPS:
echo ========================================================
echo.
echo 1. Test on your phone:
echo    - Copy APK to phone
echo    - Enable "Unknown Sources" in settings
echo    - Install APK
echo    - Test all features
echo.
echo 2. Distribute to users:
echo    - Share APK via WhatsApp/Email/Drive
echo    - Or use the HTML download page template
echo.
echo 3. Make sure backend is accessible:
echo    - Update API URL in src/config/api.ts
echo    - Current: https://your-backend.herokuapp.com/api
echo    - Change to your actual backend URL
echo.
echo ========================================================
echo.
pause
