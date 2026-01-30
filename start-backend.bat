@echo off
echo 🚀 Starting Jilinde Credit Backend...
echo.

echo 📋 Checking prerequisites...

echo Checking Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java not found. Please install Java 17 first.
    echo Download from: https://adoptium.net/
    pause
    exit /b 1
)
echo ✅ Java found

echo Checking Maven...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Maven not found. Please install Maven first.
    echo Download from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)
echo ✅ Maven found

echo.
echo 🔄 Starting Spring Boot application...
echo.

cd backend
mvn spring-boot:run

pause