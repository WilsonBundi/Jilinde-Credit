@echo off
echo ========================================
echo   FIXING PHOTO DISPLAY ISSUE
echo ========================================
echo.

echo 🔧 Step 1: Checking photo files...
echo.

if exist "frontend\public\images\wilson-bundi.jpg" (
    for %%A in ("frontend\public\images\wilson-bundi.jpg") do (
        if %%~zA GTR 0 (
            echo ✅ Wilson's photo: %%~zA bytes
        ) else (
            echo ❌ Wilson's photo: EMPTY FILE (0 bytes)
            echo 💡 You need to re-save Wilson's photo
        )
    )
) else (
    echo ❌ Wilson's photo: NOT FOUND
)

if exist "frontend\public\images\henry-mutuma.jpg" (
    for %%A in ("frontend\public\images\henry-mutuma.jpg") do (
        if %%~zA GTR 0 (
            echo ✅ Henry's photo: %%~zA bytes
        ) else (
            echo ❌ Henry's photo: EMPTY FILE (0 bytes)
            echo 💡 You need to re-save Henry's photo
        )
    )
) else (
    echo ❌ Henry's photo: NOT FOUND
)

echo.
echo 🔧 Step 2: Testing photo URLs...
echo.

echo 📱 Testing if frontend server is running...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5; Write-Host '✅ Frontend server is running' -ForegroundColor Green } catch { Write-Host '❌ Frontend server not running - Start with: npm start' -ForegroundColor Red }"

echo.
echo 📸 Testing photo accessibility...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/images/wilson-bundi.jpg' -TimeoutSec 5; Write-Host '✅ Wilson photo accessible - Size:' $response.Headers.'Content-Length' 'bytes' -ForegroundColor Green } catch { Write-Host '❌ Wilson photo not accessible:' $_.Exception.Message -ForegroundColor Red }"

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/images/henry-mutuma.jpg' -TimeoutSec 5; Write-Host '✅ Henry photo accessible - Size:' $response.Headers.'Content-Length' 'bytes' -ForegroundColor Green } catch { Write-Host '❌ Henry photo not accessible:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo 🔧 Step 3: Solutions...
echo.

echo 📋 IMMEDIATE FIXES:
echo.
echo 1. RE-SAVE PHOTOS (if 0 bytes):
echo    - Right-click on original photos
echo    - Save As: wilson-bundi.jpg, henry-mutuma.jpg
echo    - Copy to: frontend\public\images\
echo.
echo 2. CLEAR BROWSER CACHE:
echo    - Press Ctrl+Shift+Delete
echo    - Or press Ctrl+F5 for hard refresh
echo    - Or open in incognito mode
echo.
echo 3. RESTART FRONTEND (if needed):
echo    - Go to frontend terminal
echo    - Press Ctrl+C to stop
echo    - Run: npm start
echo.
echo 4. CHECK BROWSER CONSOLE:
echo    - Press F12 in browser
echo    - Look for 404 errors in Network tab
echo.

echo 🌐 After fixing, test at: http://localhost:3000
echo 📍 Look for team photos in "Meet Our Leadership Team" section
echo.

pause