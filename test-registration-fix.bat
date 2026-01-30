@echo off
echo ========================================
echo   TESTING REGISTRATION FIX
echo ========================================
echo.

echo Testing registration endpoint with minimal data...
echo.

curl -X POST http://localhost:8080/api/onboarding/register ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"Test\",\"lastName\":\"User\",\"phone\":\"0712345678\",\"email\":\"test@example.com\",\"nationalId\":\"12345678\",\"dateOfBirth\":\"1990-01-01\",\"gender\":\"MALE\",\"address\":\"Test Address\",\"occupation\":\"Developer\",\"monthlyIncome\":50000,\"maritalStatus\":\"single\",\"digitalLiteracyLevel\":3,\"preferredLanguage\":\"english\",\"voiceAssistanceEnabled\":false,\"idType\":\"national_id\"}"

echo.
echo.
echo ========================================
echo   TEST COMPLETE
echo ========================================
echo.
echo If you see a successful JSON response with customerCode, the fix worked!
echo If you see an error, check the backend logs for details.
echo.
pause