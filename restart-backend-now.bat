@echo off
echo ========================================
echo   RESTARTING BACKEND NOW
echo ========================================
echo.

echo [1/3] Stopping backend...
taskkill /f /im java.exe 2>nul
timeout /t 3 >nul

echo [2/3] Starting backend with document verification disabled...
cd /d "%~dp0backend"
start "Jilinde Backend - No Doc Verification" cmd /k "mvn spring-boot:run"

echo [3/3] Waiting for startup...
timeout /t 15 >nul

echo.
echo ========================================
echo   BACKEND RESTARTED
echo ========================================
echo.
echo ✅ Backend restarted with document verification disabled
echo ✅ Registration should now work without document errors
echo.
echo Test registration now at http://localhost:3000
echo.
pause