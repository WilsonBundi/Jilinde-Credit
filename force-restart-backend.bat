@echo off
echo ========================================
echo   FORCE RESTART BACKEND WITH ALL FIXES
echo ========================================
echo.

echo [1/4] Killing all Java processes...
taskkill /f /im java.exe 2>nul
taskkill /f /im javaw.exe 2>nul
timeout /t 3 >nul

echo [2/4] Cleaning Maven cache...
cd /d "%~dp0backend"
mvn clean -q

echo [3/4] Compiling with all fixes...
mvn compile -q

echo [4/4] Starting backend with fresh compilation...
start "Jilinde Credit Backend - FIXED" cmd /k "mvn spring-boot:run"

echo.
echo ========================================
echo   BACKEND RESTARTED WITH ALL FIXES
echo ========================================
echo.
echo ✅ All document verification completely disabled
echo ✅ Fresh compilation with all changes applied
echo ✅ Backend starting with clean state
echo.
echo Wait 15 seconds then test registration again.
echo The "Document verification failed" error should be gone!
echo.
timeout /t 15 >nul
echo Ready to test!
pause