@echo off
echo ========================================
echo   TESTING MOBILE KYC SESSION CREATION
echo ========================================
echo.

echo Testing mobile KYC session creation endpoint...
echo.

curl -X POST http://localhost:8080/api/mobile-kyc/create-session ^
  -H "Content-Type: application/json" ^
  -d "{\"customerData\":\"{\\\"name\\\":\\\"Test User\\\",\\\"phone\\\":\\\"+254700000000\\\"}\",\"baseUrl\":\"http://localhost:3000\"}"

echo.
echo.
echo ========================================
echo   TEST COMPLETE
echo ========================================
echo.
echo If you see a JSON response with sessionId and qrCodeData, the fix worked!
echo If you see an error, the backend may not be running or needs restart.
echo.
pause