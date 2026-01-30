@echo off
echo ========================================
echo   SETUP WILSON BUNDI'S ACTUAL PHOTO
echo ========================================
echo.

echo 📸 Setting up Wilson's photo from the image you provided...
echo.

echo 📁 Ensuring images directory exists...
if not exist "frontend\public\images" mkdir "frontend\public\images"

echo.
echo 📋 TO ADD WILSON'S PHOTO:
echo.
echo 1. Save the Wilson photo (red shirt, glasses, backpack) as "wilson-bundi.jpg"
echo 2. Copy it to: frontend\public\images\wilson-bundi.jpg
echo 3. The system will automatically use his real photo
echo.

echo 🎯 CURRENT TEAM SETUP:
echo ✅ Samuel Eringo (CEO) - "SE" purple badge
echo ✅ Henry Mutuma (CTO) - "HM" green badge  
echo 📷 Wilson Bundi (Developer) - Ready for actual photo
echo.

echo 🔍 Checking current status...
if exist "frontend\public\images\wilson-bundi.jpg" (
    echo ✅ Wilson's photo found! The website should show his actual photo.
) else (
    echo 📷 Wilson's photo not found - currently showing emoji placeholder
    echo 💡 Add wilson-bundi.jpg to frontend\public\images\ to show his real photo
)

echo.
echo 🌐 Visit http://localhost:3000 to see the team section
echo 🔄 Refresh the page after adding Wilson's photo
echo.
pause