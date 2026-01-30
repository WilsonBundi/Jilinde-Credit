# Simple System Health Check
Write-Host "Jilinde Credit System Health Check" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Check Backend API
Write-Host "`nTesting Backend API..." -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method GET -TimeoutSec 5
    Write-Host "Backend API: WORKING" -ForegroundColor Green
    Write-Host "Status: $($response.status)" -ForegroundColor White
} catch {
    Write-Host "Backend API: FAILED" -ForegroundColor Red
}

# Check Frontend
Write-Host "`nTesting Frontend..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "Frontend: WORKING" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor White
} catch {
    Write-Host "Frontend: FAILED" -ForegroundColor Red
}

# Test Authentication
Write-Host "`nTesting Authentication..." -ForegroundColor Blue
try {
    $body = '{"username":"admin","password":"admin123"}'
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 5
    Write-Host "Authentication: WORKING" -ForegroundColor Green
    Write-Host "User: $($response.user.username)" -ForegroundColor White
} catch {
    Write-Host "Authentication: FAILED" -ForegroundColor Red
}

Write-Host "`nSystem URLs:" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend: http://localhost:8080/api" -ForegroundColor White
Write-Host "Login: admin / admin123" -ForegroundColor White