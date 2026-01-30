# Simple Maven PATH Setup
Write-Host "Setting up Maven PATH..." -ForegroundColor Green

# Common Maven locations
$locations = @(
    "C:\Program Files\Apache\maven\bin",
    "C:\apache-maven-3.9.6\bin",
    "C:\apache-maven-3.9.5\bin",
    "C:\apache-maven-3.9.4\bin",
    "C:\maven\bin"
)

$mavenPath = $null

# Find Maven
foreach ($path in $locations) {
    if (Test-Path $path) {
        $mavenPath = $path
        Write-Host "Found Maven at: $path" -ForegroundColor Green
        break
    }
}

# Check for wildcard paths
if (-not $mavenPath) {
    $wildcardPaths = Get-ChildItem -Path "C:\" -Directory -Name "apache-maven-*" -ErrorAction SilentlyContinue
    foreach ($dir in $wildcardPaths) {
        $testPath = "C:\$dir\bin"
        if (Test-Path $testPath) {
            $mavenPath = $testPath
            Write-Host "Found Maven at: $testPath" -ForegroundColor Green
            break
        }
    }
}

if (-not $mavenPath) {
    Write-Host "Maven not found. Please tell me where you extracted it:" -ForegroundColor Red
    $customPath = Read-Host "Enter Maven installation path (e.g., C:\apache-maven-3.9.6)"
    $testPath = "$customPath\bin"
    if (Test-Path $testPath) {
        $mavenPath = $testPath
    } else {
        Write-Host "Path not found: $testPath" -ForegroundColor Red
        exit 1
    }
}

# Add to PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$mavenPath*") {
    $newPath = "$currentPath;$mavenPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "Added Maven to PATH" -ForegroundColor Green
} else {
    Write-Host "Maven already in PATH" -ForegroundColor Yellow
}

# Update current session
$env:Path = "$env:Path;$mavenPath"

# Test Maven
Write-Host "Testing Maven..." -ForegroundColor Blue
try {
    $result = & mvn -version
    Write-Host "Maven is working!" -ForegroundColor Green
    Write-Host $result
} catch {
    Write-Host "Maven test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Setup complete! You may need to restart PowerShell." -ForegroundColor Green