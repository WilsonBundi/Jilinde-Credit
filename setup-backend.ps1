# Jilinde Credit Backend Setup Script
Write-Host "🚀 Setting up Jilinde Credit Backend Environment..." -ForegroundColor Green

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "❌ This script needs to be run as Administrator" -ForegroundColor Red
    Write-Host "Please right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Install Chocolatey if not present
Write-Host "📦 Checking for Chocolatey..." -ForegroundColor Blue
try {
    choco --version | Out-Null
    Write-Host "✅ Chocolatey is already installed" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    Write-Host "✅ Chocolatey installed successfully" -ForegroundColor Green
}

# Install Java 17
Write-Host "☕ Installing Java 17..." -ForegroundColor Blue
try {
    java -version 2>&1 | Out-Null
    Write-Host "✅ Java is already installed" -ForegroundColor Green
} catch {
    choco install openjdk17 -y
    Write-Host "✅ Java 17 installed successfully" -ForegroundColor Green
}

# Install Maven
Write-Host "🔨 Installing Maven..." -ForegroundColor Blue
try {
    mvn -version | Out-Null
    Write-Host "✅ Maven is already installed" -ForegroundColor Green
} catch {
    choco install maven -y
    Write-Host "✅ Maven installed successfully" -ForegroundColor Green
}

# Install PostgreSQL
Write-Host "🐘 Installing PostgreSQL..." -ForegroundColor Blue
try {
    Get-Service postgresql* -ErrorAction SilentlyContinue | Out-Null
    Write-Host "✅ PostgreSQL is already installed" -ForegroundColor Green
} catch {
    choco install postgresql -y --params '/Password:password'
    Write-Host "✅ PostgreSQL installed successfully" -ForegroundColor Green
    Write-Host "📝 Default PostgreSQL credentials:" -ForegroundColor Yellow
    Write-Host "   Username: postgres" -ForegroundColor White
    Write-Host "   Password: password" -ForegroundColor White
}

# Refresh environment variables
Write-Host "🔄 Refreshing environment variables..." -ForegroundColor Blue
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verify installations
Write-Host "🔍 Verifying installations..." -ForegroundColor Blue

try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java installation failed" -ForegroundColor Red
}

try {
    $mavenVersion = mvn -version | Select-String "Apache Maven"
    Write-Host "✅ Maven: $mavenVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Maven installation failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Backend environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Close and reopen PowerShell to refresh environment variables" -ForegroundColor White
Write-Host "2. Create PostgreSQL database: CREATE DATABASE jilinde_credit;" -ForegroundColor White
Write-Host "3. Run: cd backend && mvn spring-boot:run" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"