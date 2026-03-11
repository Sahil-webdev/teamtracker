@echo off
title Reload App
color 0E

echo.
echo ================================
echo   Reloading Location Tracker
echo ================================
echo.

echo Sending reload command to app...
adb shell input keyevent 82
timeout /t 1 /nobreak >nul
adb shell input text "RR"

echo.
echo Reload command sent!
echo.
echo The app should reload now.
echo If still white screen, run this script again.
echo.
pause
