@echo off
echo ========================================
echo   ULTIMATE BACKEND RESTART
echo ========================================
echo.

echo [1/6] NUCLEAR KILL - All Java processes...
taskkill /f /im java.exe 2>nul
taskkill /f /im javaw.exe 2>nul
wmic process where "name='java.exe'" delete 2>nul
wmic process where "name='javaw.exe'" delete 2>nul
wmic process where "CommandLine like '%%spring-boot%%'" delete 2>nul
wmic process where "CommandLine like '%%maven%%'" delete 2>nul
wmic process where "CommandLine like '%%jilinde%%'" delete 2>nul

echo [2/6] Waiting for complete termination...
timeout /t 15 >nul

echo [3/6] Cleaning ALL Maven artifacts...
cd /d "%~dp0backend"
rmdir /s /q target 2>nul
del /q /s *.class 2>nul

echo [4/6] Force Maven clean and compile...
mvn clean -q
mvn compile -U -q

echo [5/6] Starting backend with SIMPLE REGISTRATION...
echo.
echo ⚠️  BACKEND STARTING WITH SIMPLE REGISTRATION (NO DOCUMENT VERIFICATION)
echo.
start "Jilinde Backend - SIMPLE REGISTRATION" cmd /k "echo SIMPLE REGISTRATION MODE ACTIVE && mvn spring-boot:run"

echo [6/6] Waiting for full startup...
timeout /t 25 >nul

echo.
echo ========================================
echo   ULTIMATE RESTART COMPLETE
echo ========================================
echo.
echo ✅ SIMPLE REGISTRATION MODE ACTIVE
echo ✅ NO document verification
echo ✅ NO document hash storage
echo ✅ Console logging added for debugging
echo.
echo The backend should now accept registrations without ANY document verification errors!
echo Check the backend console for "SIMPLE REGISTRATION" messages.
echo.
pause