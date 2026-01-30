# Automated Database Setup with Password
Write-Host "Setting up PostgreSQL database..." -ForegroundColor Green

# Set PostgreSQL password environment variable
$env:PGPASSWORD = "1234"

# Test connection
Write-Host "Testing PostgreSQL connection..." -ForegroundColor Blue
try {
    $result = psql -U postgres -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL connection successful" -ForegroundColor Green
    } else {
        Write-Host "❌ PostgreSQL connection failed" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error connecting to PostgreSQL" -ForegroundColor Red
    exit 1
}

# Create database if it doesn't exist
Write-Host "Creating jilinde_credit database..." -ForegroundColor Blue
try {
    $result = psql -U postgres -c "CREATE DATABASE jilinde_credit;" 2>&1
    if ($result -like "*already exists*") {
        Write-Host "✅ Database already exists" -ForegroundColor Yellow
    } elseif ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database created successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create database" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error creating database" -ForegroundColor Red
}

# Test database connection
Write-Host "Testing database connection..." -ForegroundColor Blue
try {
    $result = psql -U postgres -d jilinde_credit -c "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database connection successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Database connection failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error testing database" -ForegroundColor Red
}

Write-Host "Database setup complete!" -ForegroundColor Green