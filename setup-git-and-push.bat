@echo off
echo ========================================
echo  Jilinde Credit - Git Setup and Push
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed or not in PATH
    echo.
    echo Please install Git first:
    echo 1. Download Git from: https://git-scm.com/download/windows
    echo 2. Install Git with default settings
    echo 3. Restart your command prompt
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed
echo.

REM Initialize Git repository
echo 📁 Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo ❌ Failed to initialize Git repository
    pause
    exit /b 1
)

REM Add README.md
echo 📄 Adding README.md...
git add README.md
if %errorlevel% neq 0 (
    echo ❌ Failed to add README.md
    pause
    exit /b 1
)

REM Add all files
echo 📦 Adding all project files...
git add .
if %errorlevel% neq 0 (
    echo ❌ Failed to add project files
    pause
    exit /b 1
)

REM Initial commit
echo 💾 Creating initial commit...
git commit -m "Initial commit: Jilinde Credit Microfinance System with Mobile KYC"
if %errorlevel% neq 0 (
    echo ❌ Failed to create initial commit
    pause
    exit /b 1
)

REM Set main branch
echo 🌿 Setting main branch...
git branch -M main
if %errorlevel% neq 0 (
    echo ❌ Failed to set main branch
    pause
    exit /b 1
)

REM Add remote origin
echo 🔗 Adding remote origin...
git remote add origin https://github.com/WilsonBundi/Jilinde-Credit.git
if %errorlevel% neq 0 (
    echo ❌ Failed to add remote origin
    echo This might be because the remote already exists
    echo Trying to set the URL instead...
    git remote set-url origin https://github.com/WilsonBundi/Jilinde-Credit.git
)

REM Push to GitHub
echo 🚀 Pushing to GitHub...
echo.
echo ⚠️  You may be prompted for GitHub credentials
echo    If you have 2FA enabled, use a Personal Access Token instead of password
echo.
git push -u origin main
if %errorlevel% neq 0 (
    echo ❌ Failed to push to GitHub
    echo.
    echo Possible issues:
    echo 1. Repository doesn't exist on GitHub - create it first at https://github.com/new
    echo 2. Authentication failed - check your GitHub credentials
    echo 3. Network connectivity issues
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ SUCCESS! Project pushed to GitHub
echo.
echo 🔗 Repository URL: https://github.com/WilsonBundi/Jilinde-Credit
echo.
echo 📋 Next steps:
echo 1. Visit your GitHub repository to verify the upload
echo 2. Set up branch protection rules if needed
echo 3. Configure GitHub Pages for documentation (optional)
echo 4. Add collaborators if working in a team
echo.
pause