@echo off
echo ========================================
echo   DIAGNOSING BACKEND ISSUE
echo ========================================
echo.

echo [1] Checking for running Java processes...
tasklist | findstr java.exe
echo.

echo [2] Checking for Spring Boot processes...
wmic process where "CommandLine like '%%spring-boot%%'" get ProcessId,CommandLine
echo.

echo [3] Checking backend directory...
cd /d "%~dp0backend"
echo Current directory: %CD%
echo.

echo [4] Checking if target directory exists...
if exist target (
    echo Target directory exists - contains compiled code
    dir target\classes\com\jilindecredit\api\service\ 2>nul
) else (
    echo Target directory does not exist
)
echo.

echo [5] Checking Maven process...
tasklist | findstr mvn
echo.

echo [6] Testing backend endpoint...
curl -s http://localhost:8080/health 2>nul
echo.

echo ========================================
echo   DIAGNOSIS COMPLETE
echo ========================================
pause