@echo off
echo ========================================
echo   SETUP HENRY MUTUMA'S PHOTO
echo ========================================
echo.

echo 📸 Setting up Henry's photo directory and instructions...
echo.

echo 📁 Ensuring images directory exists...
if not exist "frontend\public\images" mkdir "frontend\public\images"

echo.
echo 📋 HENRY MUTUMA PHOTO SETUP:
echo.
echo 📂 Directory: frontend\public\images\
echo 📷 Filename: henry-mutuma.jpg
echo 👤 Role: Credit Manager
echo 🎨 Badge: "HM" green gradient (fallback)
echo.

echo 📝 INSTRUCTIONS:
echo 1. Save Henry's photo as "henry-mutuma.jpg"
echo 2. Copy it to: frontend\public\images\henry-mutuma.jpg
echo 3. Photo should be square format (400x400px or larger)
echo 4. Supported formats: JPG, PNG, WebP
echo.

echo 🔍 Checking current status...
if exist "frontend\public\images\henry-mutuma.jpg" (
    for %%A in ("frontend\public\images\henry-mutuma.jpg") do (
        if %%~zA GTR 0 (
            echo ✅ Henry's photo found - Size: %%~zA bytes
            echo 🌐 The website should show his actual photo!
        ) else (
            echo ⚠️  Photo file exists but is empty (0 bytes)
            echo 💡 Please re-save Henry's photo to this location
        )
    )
) else (
    echo ❌ Henry's photo not found
    echo 📂 Please add: frontend\public\images\henry-mutuma.jpg
    echo 🎯 Currently showing: "HM" green badge
)

echo.
echo 📋 COMPLETE TEAM SETUP:
echo 👤 Samuel Eringo (CEO) - "SE" purple badge
echo 📷 Henry Mutuma (Credit Manager) - Ready for actual photo
echo 📷 Wilson Bundi (Lead Developer) - Ready for actual photo
echo.

echo 🌐 Visit http://localhost:3000 to see the team section
echo 🔄 Refresh the page after adding Henry's photo
echo.
pause