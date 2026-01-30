@echo off
echo ========================================
echo   TESTING SIMPLE REGISTRATION API
echo ========================================
echo.

echo Testing with minimal required fields only...
echo.

curl -X POST http://localhost:8080/api/onboarding/register ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"phone\":\"0712345679\",\"email\":\"john.doe@example.com\",\"nationalId\":\"12345679\",\"dateOfBirth\":\"1990-01-01\",\"gender\":\"MALE\",\"address\":\"Nairobi, Kenya\",\"occupation\":\"Developer\",\"monthlyIncome\":75000,\"maritalStatus\":\"single\",\"digitalLiteracyLevel\":3,\"preferredLanguage\":\"english\",\"voiceAssistanceEnabled\":false,\"idType\":\"national_id\"}"

echo.
echo.
echo ========================================
echo   API TEST COMPLETE
echo ========================================
echo.
echo Expected: JSON response with customerCode and success message
echo If you see "Document verification failed" - backend still has old code
echo If you see success response - registration is working!
echo.
pause