@echo off
echo ========================================
echo   DIAGNOSING PHOTO DISPLAY ISSUE
echo ========================================
echo.

echo 📁 Checking images directory structure...
if not exist "frontend\public\images" (
    echo ❌ Images directory missing!
    mkdir "frontend\public\images"
    echo ✅ Created images directory
) else (
    echo ✅ Images directory exists
)

echo.
echo 📸 Checking all image files...
echo.

for %%f in (frontend\public\images\*.*) do (
    echo 🔍 Found: %%~nxf
    echo    Size: %%~zf bytes
    if %%~zf EQU 0 (
        echo    ⚠️  WARNING: File is empty (0 bytes)
    ) else (
        echo    ✅ File has content
    )
    echo.
)

echo 📋 Expected photo files:
echo    - wilson-bundi.jpg (Wilson Bundi - Lead Developer)
echo    - henry-mutuma.jpg (Henry Mutuma - Credit Manager)  
echo    - samuel-eringo.jpg (Samuel Eringo - CEO) [Optional]
echo.

echo 🔧 TROUBLESHOOTING STEPS:
echo.
echo 1. CHECK FILE SIZES:
echo    - Files must be greater than 0 bytes
echo    - Re-save photos if they show 0 bytes
echo.
echo 2. CHECK FILE NAMES:
echo    - Must be exactly: wilson-bundi.jpg, henry-mutuma.jpg
echo    - Case sensitive on some systems
echo.
echo 3. CHECK FILE FORMATS:
echo    - Supported: .jpg, .jpeg, .png, .webp
echo    - Recommended: .jpg format
echo.
echo 4. BROWSER CACHE:
echo    - Press Ctrl+F5 to hard refresh
echo    - Or open in incognito/private mode
echo.
echo 5. DEVELOPMENT SERVER:
echo    - Make sure frontend is running on port 3000
echo    - Restart if needed: npm start
echo.

echo 🌐 Test URLs (open in browser):
echo    http://localhost:3000/images/wilson-bundi.jpg
echo    http://localhost:3000/images/henry-mutuma.jpg
echo.

echo 📱 If photos still don't appear:
echo    1. Check browser developer tools (F12)
echo    2. Look for 404 errors in Network tab
echo    3. Verify file paths are correct
echo.

pause