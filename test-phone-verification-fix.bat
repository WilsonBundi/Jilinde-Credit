@echo off
echo ========================================
echo   TESTING PHONE VERIFICATION FIX
echo ========================================
echo.

echo ⏳ Waiting for backend to start...
timeout /t 10 >nul

echo 📱 Testing phone verification API...
echo.

echo 1. Testing send verification code for phone: 0725252908
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/customer/send-verification' -Method POST -ContentType 'application/json' -Body '{\"phone\":\"0725252908\",\"type\":\"verification\"}'; Write-Host '✅ SUCCESS:' -ForegroundColor Green; $response | ConvertTo-Json } catch { Write-Host '❌ ERROR:' -ForegroundColor Red; $_.Exception.Message }"

echo.
echo.

echo 2. Testing with international format: +254725252908
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/customer/send-verification' -Method POST -ContentType 'application/json' -Body '{\"phone\":\"+254725252908\",\"type\":\"verification\"}'; Write-Host '✅ SUCCESS:' -ForegroundColor Green; $response | ConvertTo-Json } catch { Write-Host '❌ ERROR:' -ForegroundColor Red; $_.Exception.Message }"

echo.
echo.

echo 📋 If you see SUCCESS above, the phone verification is working!
echo 🌐 Now test in the browser: http://localhost:3000/customer
echo.

pause