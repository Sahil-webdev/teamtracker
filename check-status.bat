@echo off
title Location Tracker - Status Check
color 0A

echo.
echo ================================================
echo   Location Tracker - System Status Check
echo ================================================
echo.

echo [Backend Server - Port 5000]
powershell -Command "$p = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue; if ($p) { Write-Host '  Status: RUNNING (Process ID: ' -NoNewline; Write-Host $p[0].OwningProcess -NoNewline -ForegroundColor Green; Write-Host ')' } else { Write-Host '  Status: NOT RUNNING' -ForegroundColor Red }"

echo.
echo [Metro Bundler - Port 8081/8083]
powershell -Command "$p = Get-NetTCPConnection -LocalPort 8081,8083 -ErrorAction SilentlyContinue; if ($p) { $port = $p[0].LocalPort; Write-Host '  Status: RUNNING on port ' -NoNewline; Write-Host $port -NoNewline -ForegroundColor Green; Write-Host ' (Process ID: ' -NoNewline; Write-Host $p[0].OwningProcess -NoNewline -ForegroundColor Green; Write-Host ')' } else { Write-Host '  Status: NOT RUNNING' -ForegroundColor Red }"

echo.
echo [Android Emulator]
powershell -Command "$a = adb devices 2>&1 | Select-String 'emulator'; if ($a) { Write-Host '  Status: CONNECTED' -ForegroundColor Green } else { Write-Host '  Status: NOT CONNECTED' -ForegroundColor Red }"

echo.
echo [Database]
powershell -Command "if (Test-Path 'backend\instance\location_tracker.db') { $size = (Get-Item 'backend\instance\location_tracker.db').Length / 1KB; Write-Host '  Status: EXISTS (' -NoNewline; Write-Host ([math]::Round($size,2)) -NoNewline -ForegroundColor Green; Write-Host ' KB)' } else { Write-Host '  Status: NOT FOUND (Will be created on backend start)' -ForegroundColor Yellow }"

echo.
echo [Current Panel Mode]
powershell -Command "$content = Get-Content 'App.tsx' -Raw; if ($content -match 'initialRouteName=\"Login\"') { Write-Host '  Mode: USER PANEL' -ForegroundColor Cyan } elseif ($content -match 'initialRouteName=\"MasterLogin\"') { Write-Host '  Mode: MASTER PANEL' -ForegroundColor Magenta } else { Write-Host '  Mode: UNKNOWN' -ForegroundColor Red }"

echo.
echo ================================================
echo.
pause
