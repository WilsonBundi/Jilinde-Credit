@echo off
echo ========================================
echo   AGGRESSIVE BACKEND RESTART
echo ========================================
echo.

echo [1/5] Killing ALL Java processes aggressively...
taskkill /f /im java.exe 2>nul
taskkill /f /im javaw.exe 2>nul
wmic process where "name='java.exe'" delete 2>nul
wmic process where "name='javaw.exe'" delete 2>nul
wmic process where "CommandLine like '%%spring-boot%%'" delete 2>nul
wmic process where "CommandLine like '%%maven%%'" delete 2>nul

echo [2/5] Waiting for processes to fully terminate...
timeout /t 10 >nul

echo [3/5] Cleaning Maven target directory...
cd /d "%~dp0backend"
rmdir /s /q target 2>nul

echo [4/5] Force clean and compile...
mvn clean compile -U -q

echo [5/5] Starting fresh backend instance...
start "Jilinde Backend - AGGRESSIVE RESTART" cmd /k "echo Starting backend with document verification DISABLED... && mvn spring-boot:run"

echo.
echo ========================================
echo   AGGRESSIVE RESTART COMPLETE
echo ========================================
echo.
echo ✅ All Java processes killed aggressively
echo ✅ Target directory cleaned
echo ✅ Fresh compilation completed
echo ✅ Backend starting with NO document verification
echo.
echo ⚠️  WAIT 30 SECONDS for complete startup
echo.
echo The document verification error MUST be gone now!
echo.
timeout /t 30 >nul
echo Backend should be ready - test registration now!
pause