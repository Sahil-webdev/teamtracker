@echo off
echo ==============================================
echo   Location Tracker - Backend Server Start
echo ==============================================
echo.

cd backend

echo Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting backend server...
echo Server will run on http://localhost:5000
echo.
echo Default Master Credentials:
echo Email: master@office.com
echo Password: master123
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py

pause
