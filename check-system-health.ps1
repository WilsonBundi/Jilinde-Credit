# Jilinde Credit System Health Check
Write-Host "🔍 Jilinde Credit System Health Check" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check PostgreSQL Service
Write-Host "`n1. Checking PostgreSQL Service..." -ForegroundColor Blue
try {
    $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if ($pgService) {
        Write-Host "✅ PostgreSQL Service: $($pgService.Status)" -ForegroundColor Green
    } else {
        Write-Host "❌ PostgreSQL Service not found" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ Could not check PostgreSQL service" -ForegroundColor Yellow
}

# Check Database Connection
Write-Host "`n2. Testing Database Connection..." -ForegroundColor Blue
try {
    $result = psql -U postgres -d jilinde_credit -c "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database Connection: Working" -ForegroundColor Green
    } else {
        Write-Host "❌ Database Connection: Failed" -ForegroundColor Red
        Write-Host "Error: $result" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ Could not test database connection" -ForegroundColor Yellow
}

# Check Backend API
Write-Host "`n3. Testing Backend API..." -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method GET -TimeoutSec 5
    if ($response.status -eq "UP") {
        Write-Host "✅ Backend API: $($response.status)" -ForegroundColor Green
        Write-Host "   Service: $($response.service)" -ForegroundColor White
    } else {
        Write-Host "❌ Backend API: Not responding properly" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Backend API: Not accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Check Frontend
Write-Host "`n4. Testing Frontend..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend: Running (Status: $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend: Status $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Frontend: Not accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Authentication
Write-Host "`n5. Testing Authentication..." -ForegroundColor Blue
try {
    $body = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 5
    
    if ($response.token) {
        Write-Host "✅ Authentication: Working" -ForegroundColor Green
        Write-Host "   User: $($response.user.username)" -ForegroundColor White
        Write-Host "   Role: $($response.user.role)" -ForegroundColor White
    } else {
        Write-Host "❌ Authentication: Failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Authentication: Failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Check Database Tables
Write-Host "`n6. Checking Database Tables..." -ForegroundColor Blue
try {
    $tables = psql -U postgres -d jilinde_credit -c "\dt" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database Tables: Created" -ForegroundColor Green
        $tableCount = ($tables | Select-String "public \|" | Measure-Object).Count
        Write-Host "   Tables found: $tableCount" -ForegroundColor White
    } else {
        Write-Host "❌ Database Tables: Error checking" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ Could not check database tables" -ForegroundColor Yellow
}

Write-Host "`n🎉 Health Check Complete!" -ForegroundColor Green
Write-Host "`n📋 System URLs:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8080/api" -ForegroundColor White
Write-Host "   Login: admin / admin123" -ForegroundColor White

Read-Host "`nPress Enter to continue"