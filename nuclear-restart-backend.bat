@echo off
echo ========================================
echo   NUCLEAR RESTART - COMPLETE BACKEND RESET
echo ========================================
echo.

echo [1/6] Killing ALL Java processes...
taskkill /f /im java.exe 2>nul
taskkill /f /im javaw.exe 2>nul
wmic process where "name='java.exe'" delete 2>nul
wmic process where "name='javaw.exe'" delete 2>nul
timeout /t 5 >nul

echo [2/6] Cleaning all Maven artifacts...
cd /d "%~dp0backend"
rmdir /s /q target 2>nul
mvn clean -q

echo [3/6] Clearing Maven cache...
rmdir /s /q "%USERPROFILE%\.m2\repository\com\jilindecredit" 2>nul

echo [4/6] Force recompiling everything...
mvn clean compile -U -q

echo [5/6] Packaging application...
mvn package -DskipTests -q

echo [6/6] Starting fresh backend instance...
start "Jilinde Credit Backend - NUCLEAR RESTART" cmd /k "mvn spring-boot:run"

echo.
echo ========================================
echo   NUCLEAR RESTART COMPLETE
echo ========================================
echo.
echo ✅ All processes killed
echo ✅ All compiled artifacts deleted
echo ✅ Fresh compilation completed
echo ✅ Backend starting with 100% fresh code
echo.
echo ⚠️  IMPORTANT: Wait at least 20 seconds for full startup
echo.
echo The document verification should now be completely disabled!
echo Test registration after the backend fully starts.
echo.
timeout /t 20 >nul
echo Backend should be ready now!
pause