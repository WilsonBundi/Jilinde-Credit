@echo off
echo ========================================
echo   ADD WILSON BUNDI'S PHOTO
echo ========================================
echo.

echo 📸 This script will help you add Wilson's photo to the website
echo.

echo 📁 Creating images directory if it doesn't exist...
if not exist "frontend\public\images" mkdir "frontend\public\images"

echo.
echo 📋 INSTRUCTIONS:
echo.
echo 1. Save Wilson's photo as "wilson-bundi.jpg"
echo 2. Copy it to: frontend\public\images\wilson-bundi.jpg
echo 3. The photo should be square (400x400px or larger works best)
echo.

echo 🔍 Checking if photo already exists...
if exist "frontend\public\images\wilson-bundi.jpg" (
    echo ✅ Wilson's photo found at: frontend\public\images\wilson-bundi.jpg
    echo 🌐 The website should now show his actual photo!
    echo 📱 Visit: http://localhost:3000 to see the result
) else (
    echo ❌ Wilson's photo not found
    echo 📂 Please copy wilson-bundi.jpg to: frontend\public\images\
    echo.
    echo 💡 CURRENT STATUS: Using "WB" initials as placeholder
    echo 🎯 AFTER ADDING PHOTO: Will show Wilson's actual photo
)

echo.
echo 🚀 Once you add the photo, refresh the website to see Wilson's actual photo!
echo.
pause