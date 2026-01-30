@echo off
echo ========================================
echo   TESTING PHOTO URLs DIRECTLY
echo ========================================
echo.

echo 🌐 Opening photo URLs in browser to test accessibility...
echo.

echo 📸 Testing Wilson's photo...
start http://localhost:3000/images/wilson-bundi.jpg

timeout /t 2 >nul

echo 📸 Testing Henry's photo...
start http://localhost:3000/images/henry-mutuma.jpg

timeout /t 2 >nul

echo.
echo 📋 WHAT TO LOOK FOR:
echo.
echo ✅ WORKING: Photo displays in browser
echo ❌ NOT WORKING: 
echo    - "Cannot GET /images/..." error
echo    - Blank page
echo    - 404 Not Found
echo.

echo 💡 If photos don't load:
echo 1. Check if files exist in frontend\public\images\
echo 2. Verify file sizes are greater than 0 bytes
echo 3. Make sure frontend server is running (npm start)
echo 4. Clear browser cache (Ctrl+F5)
echo.

echo 🔄 After fixing issues, refresh the main website:
echo    http://localhost:3000
echo.

pause