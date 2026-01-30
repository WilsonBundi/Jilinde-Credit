@echo off
echo ========================================
echo   TESTING PHONE VERIFICATION SYSTEM
echo ========================================
echo.

echo 🔄 Starting backend if not running...
cd backend
start "Backend" cmd /k "mvn spring-boot:run"
timeout /t 10 >nul

echo 📱 Testing phone verification endpoints...
echo.

echo 1. Testing send verification code...
curl -X POST http://localhost:8080/api/customer/send-verification ^
  -H "Content-Type: application/json" ^
  -d "{\"phone\":\"0714978525\",\"type\":\"verification\"}"

echo.
echo.

echo 2. Testing with different phone format...
curl -X POST http://localhost:8080/api/customer/send-verification ^
  -H "Content-Type: application/json" ^
  -d "{\"phone\":\"+254714978525\",\"type\":\"verification\"}"

echo.
echo.

echo 📋 Instructions:
echo 1. Check the backend console for the verification code
echo 2. Use the code to test verification via the customer portal
echo 3. Go to http://localhost:3000/customer to test the UI
echo.

pause