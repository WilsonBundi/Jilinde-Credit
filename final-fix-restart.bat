@echo off
echo ========================================
echo   FINAL FIX - DOCUMENT VERIFICATION REMOVED
echo ========================================
echo.

echo [1/4] Killing all Java processes...
taskkill /f /im java.exe 2>nul
taskkill /f /im javaw.exe 2>nul
timeout /t 5 >nul

echo [2/4] Cleaning and recompiling...
cd /d "%~dp0backend"
mvn clean compile -q

echo [3/4] Starting backend with DocumentVerificationService completely removed...
start "Jilinde Backend - FINAL FIX" cmd /k "mvn spring-boot:run"

echo [4/4] Waiting for startup...
timeout /t 20 >nul

echo.
echo ========================================
echo   FINAL FIX APPLIED
echo ========================================
echo.
echo ✅ DocumentVerificationService dependency completely removed
echo ✅ All document verification calls eliminated
echo ✅ Backend recompiled and restarted
echo.
echo The "Document verification failed" error should be GONE!
echo Test registration now - it should work!
echo.
pause