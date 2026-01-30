@echo off
echo ========================================
echo   TESTING SIMPLIFIED REGISTRATION
echo ========================================
echo.

echo [1/3] Stopping backend...
taskkill /f /im java.exe 2>nul
timeout /t 3 >nul

echo [2/3] Starting backend with simplified registration...
cd /d "%~dp0backend"
start "Jilinde Credit Backend" cmd /k "mvn spring-boot:run"

echo.
echo [3/3] Waiting for backend to start...
timeout /t 15 >nul

echo.
echo ========================================
echo   SIMPLIFIED REGISTRATION READY
echo ========================================
echo.
echo ✅ Document verification temporarily disabled
echo ✅ Registration simplified to basic fields only
echo ✅ Backend restarted with changes
echo.
echo Now test customer registration:
echo 1. Go to http://localhost:3000
echo 2. Click "Customer Registration"
echo 3. Fill in the basic information
echo 4. Skip document verification details
echo 5. Submit the form
echo.
echo The registration should now work without database errors!
echo.
pause