@echo off
echo ========================================
echo   RESTARTING BACKEND - MOBILE KYC FIX
echo ========================================
echo.

echo [1/3] Stopping any running backend processes...
taskkill /f /im java.exe 2>nul
timeout /t 2 >nul

echo [2/3] Navigating to backend directory...
cd /d "%~dp0backend"

echo [3/3] Starting backend with mobile KYC security fix...
echo.
echo Backend starting with mobile KYC endpoints enabled...
echo Mobile KYC endpoints: /api/mobile-kyc/** now accessible
echo.
mvn spring-boot:run

pause