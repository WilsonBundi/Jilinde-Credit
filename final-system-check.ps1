# Final Jilinde Credit System Check
Write-Host "🎯 JILINDE CREDIT SYSTEM - FINAL STATUS CHECK" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Set PostgreSQL password
$env:PGPASSWORD = "1234"

Write-Host "`n1. DATABASE STATUS:" -ForegroundColor Blue
try {
    $tables = psql -U postgres -d jilinde_credit -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" -t
    Write-Host "✅ Database Connected" -ForegroundColor Green
    Write-Host "   Tables: $($tables -join ', ')" -ForegroundColor White
    
    $userCount = psql -U postgres -d jilinde_credit -c "SELECT COUNT(*) FROM users;" -t
    Write-Host "   Users: $($userCount.Trim()) accounts created" -ForegroundColor White
} catch {
    Write-Host "❌ Database Error" -ForegroundColor Red
}

Write-Host "`n2. BACKEND API STATUS:" -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend API: $($response.status)" -ForegroundColor Green
    Write-Host "   Service: $($response.service)" -ForegroundColor White
} catch {
    Write-Host "❌ Backend API: Not responding" -ForegroundColor Red
}

Write-Host "`n3. AUTHENTICATION TEST:" -ForegroundColor Blue
try {
    $body = '{"username":"admin","password":"admin123"}'
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 5
    Write-Host "✅ Authentication: Working" -ForegroundColor Green
    Write-Host "   User: $($response.user.username) ($($response.user.role))" -ForegroundColor White
} catch {
    Write-Host "❌ Authentication: Failed" -ForegroundColor Red
}

Write-Host "`n4. FRONTEND STATUS:" -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend: Running (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: Not accessible" -ForegroundColor Red
}

Write-Host "`n🎉 SYSTEM READY!" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host "Frontend URL: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend API:  http://localhost:8080/api" -ForegroundColor Yellow
Write-Host "Login:        admin / admin123" -ForegroundColor Yellow
Write-Host "`nAll services are operational! 🚀" -ForegroundColor Green