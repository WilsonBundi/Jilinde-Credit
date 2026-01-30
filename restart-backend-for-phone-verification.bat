@echo off
echo ========================================
echo   RESTARTING BACKEND FOR PHONE VERIFICATION
echo ========================================
echo.

echo 🔄 Stopping any existing backend processes...
taskkill /f /im java.exe 2>nul
timeout /t 3 >nul

echo 📁 Creating data directory for persistent database...
if not exist "data" mkdir data

echo 🚀 Starting backend with updated phone verification configuration...
cd backend
echo.
echo 📱 PHONE VERIFICATION ENDPOINTS NOW ENABLED:
echo    - POST /api/customer/send-verification (NO AUTH REQUIRED)
echo    - POST /api/customer/verify-phone (NO AUTH REQUIRED)
echo.
echo 🔍 Watch for verification codes in the console output below...
echo ========================================
echo.

mvn spring-boot:run

pause