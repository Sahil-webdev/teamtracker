@echo off
setlocal

if "%~1"=="" (
  echo Usage: BUILD-PROD-APKS.bat https://api.yourdomain.com/api
  exit /b 1
)

set API_URL=%~1
echo Building production APKs with API_BASE_URL=%API_URL%

cd /d %~dp0android
call .\gradlew.bat :app:assembleUserRelease :app:assembleMasterRelease -PAPI_BASE_URL=%API_URL%

if errorlevel 1 (
  echo Build failed.
  exit /b 1
)

copy /Y app\build\outputs\apk\user\release\app-user-release.apk ..\TeamTrackerUser.apk >nul
copy /Y app\build\outputs\apk\master\release\app-master-release.apk ..\TeamTrackerMaster.apk >nul

echo.
echo Done:
echo   %~dp0TeamTrackerUser.apk
echo   %~dp0TeamTrackerMaster.apk
endlocal
