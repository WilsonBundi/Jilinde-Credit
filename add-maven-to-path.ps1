# Maven PATH Setup Script
Write-Host "🔧 Adding Maven to PATH..." -ForegroundColor Green

# Common Maven installation locations
$possiblePaths = @(
    "C:\Program Files\Apache\maven\bin",
    "C:\Program Files\apache-maven-*\bin",
    "C:\apache-maven-*\bin",
    "C:\maven\bin",
    "C:\Program Files\Maven\bin"
)

Write-Host "🔍 Searching for Maven installation..." -ForegroundColor Blue

$mavenPath = $null

# Check each possible path
foreach ($path in $possiblePaths) {
    if ($path -like "*apache-maven-*") {
        # Handle wildcard paths
        $wildcardPaths = Get-ChildItem -Path ($path -replace "apache-maven-\*", "") -Directory -Name "apache-maven-*" -ErrorAction SilentlyContinue
        foreach ($wildcardPath in $wildcardPaths) {
            $fullPath = Join-Path ($path -replace "apache-maven-\*", "") $wildcardPath "bin"
            if (Test-Path $fullPath) {
                $mavenPath = $fullPath
                break
            }
        }
    } else {
        if (Test-Path $path) {
            $mavenPath = $path
            break
        }
    }
    if ($mavenPath) { break }
}

if (-not $mavenPath) {
    Write-Host "❌ Maven installation not found in common locations." -ForegroundColor Red
    Write-Host "Please tell me where you extracted Maven. Common locations:" -ForegroundColor Yellow
    Write-Host "  - C:\Program Files\Apache\maven" -ForegroundColor White
    Write-Host "  - C:\apache-maven-3.x.x" -ForegroundColor White
    Write-Host "  - C:\maven" -ForegroundColor White
    
    $customPath = Read-Host "Enter the full path to your Maven installation (or press Enter to browse)"
    
    if ([string]::IsNullOrEmpty($customPath)) {
        Write-Host "Please manually locate your Maven installation and run this script again." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit
    }
    
    $mavenBinPath = Join-Path $customPath "bin"
    if (Test-Path $mavenBinPath) {
        $mavenPath = $mavenBinPath
    } else {
        Write-Host "❌ Maven bin directory not found at: $mavenBinPath" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit
    }
}

Write-Host "✅ Found Maven at: $mavenPath" -ForegroundColor Green

# Get current PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

# Check if Maven is already in PATH
if ($currentPath -split ";" | Where-Object { $_ -eq $mavenPath }) {
    Write-Host "✅ Maven is already in your PATH!" -ForegroundColor Green
} else {
    Write-Host "📝 Adding Maven to your PATH..." -ForegroundColor Blue
    
    # Add Maven to user PATH
    $newPath = $currentPath + ";" + $mavenPath
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    
    Write-Host "✅ Maven added to PATH successfully!" -ForegroundColor Green
}

# Update current session PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host ""
Write-Host "🧪 Testing Maven installation..." -ForegroundColor Blue

try {
    $mavenVersion = & "$mavenPath\mvn.cmd" -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Maven is working correctly!" -ForegroundColor Green
        Write-Host $mavenVersion -ForegroundColor White
    } else {
        Write-Host "❌ Maven test failed" -ForegroundColor Red
        Write-Host $mavenVersion -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error testing Maven: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Close and reopen PowerShell/Command Prompt" -ForegroundColor White
Write-Host "2. Test with: mvn -version" -ForegroundColor White
Write-Host "3. If it works, you can now run the backend!" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"