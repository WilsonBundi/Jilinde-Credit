@echo off
echo ========================================
echo   RESTARTING BACKEND WITH PERSISTENT DB
echo ========================================
echo.

echo 🔄 Stopping any existing backend processes...
taskkill /f /im java.exe 2>nul
timeout /t 2 >nul

echo 📁 Creating data directory for persistent database...
if not exist "data" mkdir data

echo 🚀 Starting backend with persistent H2 database...
cd backend
start "Jilinde Credit Backend" cmd /k "mvn spring-boot:run"

echo.
echo ✅ Backend is starting with persistent database!
echo 📊 Database will be saved to: ./data/jilinde_credit_db.mv.db
echo 🌐 Backend URL: http://localhost:8080
echo 🔧 H2 Console: http://localhost:8080/h2-console
echo.
echo 📋 Sample applications will be created automatically for testing
echo 🛡️ Admin portal: http://localhost:3000/admin
echo.
pause