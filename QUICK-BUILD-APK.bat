@echo off
title Quick APK Build - Skip Clean
color 0B
cls

echo.
echo ========================================================
echo   Building Release APK (Quick Build)
echo ========================================================
echo.
echo This will build APK without cleaning (faster, avoids OneDrive issues)
echo.
pause

REM ============================================================
REM STEP 1: Get keystore password
REM ============================================================
echo.
echo [1/4] Keystore Configuration
echo.
set /p KEYSTORE_PASSWORD="Enter your keystore password: "

REM ============================================================
REM STEP 2: Update gradle.properties
REM ============================================================
echo.
echo [2/4] Updating gradle.properties...
echo.

cd C:\RNProjects\LocationTracker

REM Check if already added
findstr "MYAPP_RELEASE_STORE_FILE" android\gradle.properties >nul 2>&1
if %errorlevel% equ 0 (
    echo Signing config already exists in gradle.properties
) else (
    echo Adding signing configuration...
    (
    echo.
    echo # Release Signing Config
    echo MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
    echo MYAPP_RELEASE_KEY_ALIAS=my-key-alias
    echo MYAPP_RELEASE_STORE_PASSWORD=%KEYSTORE_PASSWORD%
    echo MYAPP_RELEASE_KEY_PASSWORD=%KEYSTORE_PASSWORD%
    ) >> android\gradle.properties
    echo Done!
)

REM ============================================================
REM STEP 3: Build Release APK (NO CLEAN)
REM ============================================================
echo.
echo [3/4] Building Release APK...
echo.
echo This will take 5-10 minutes on first build
echo Please wait...
echo.

cd android
call gradlew assembleRelease --no-daemon
if errorlevel 1 (
    echo.
    echo ========================================================
    echo   BUILD FAILED!
    echo ========================================================
    echo.
    echo Possible reasons:
    echo  1. Wrong keystore password
    echo  2. Build configuration error
    echo  3. Check error messages above
    echo.
    pause
    exit /b 1
)
cd ..

echo.
echo Build successful!

REM ============================================================
REM STEP 4: Copy APK to easy location
REM ============================================================
echo.
echo [4/4] Copying APK...
echo.

set APK_SOURCE=android\app\build\outputs\apk\release\app-release.apk
set APK_DEST=LocationTracker-v1.0.apk

if exist "%APK_SOURCE%" (
    copy "%APK_SOURCE%" "%APK_DEST%" >nul
    
    REM Get file size
    for %%A in ("%APK_DEST%") do set APK_SIZE=%%~zA
    set /a APK_SIZE_MB=%APK_SIZE%/1024/1024
    
    echo APK copied successfully!
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
echo   TESTING ON YOUR PHONE:
echo ========================================================
echo.
echo 1. Connect phone via USB OR
echo    Copy APK to phone via WhatsApp/Email
echo.
echo 2. Enable "Install from Unknown Sources":
echo    Settings ^> Security ^> Unknown Sources ^> Enable
echo    (On newer Android: Settings ^> Apps ^> Special Access ^>
echo     Install Unknown Apps ^> Select app ^> Allow)
echo.
echo 3. Open APK file on phone and install
echo.
echo 4. IMPORTANT: Update Backend URL before testing
echo    Current: https://your-backend.herokuapp.com/api
echo    Change in: src\config\api.ts
echo.
echo ========================================================
echo   DISTRIBUTING TO USERS:
echo ========================================================
echo.
echo Option 1: WhatsApp/Email
echo  - Send LocationTracker-v1.0.apk file directly
echo.
echo Option 2: Google Drive/Dropbox
echo  - Upload APK
echo  - Get shareable link
echo  - Send link to users
echo.
echo Option 3: QR Code
echo  - Upload to cloud
echo  - Generate QR code from link
echo  - Print and display in office
echo.
echo ========================================================
echo.
pause

REM Open folder with APK
explorer /select,"%CD%\LocationTracker-v1.0.apk"
