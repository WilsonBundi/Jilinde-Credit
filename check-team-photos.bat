@echo off
echo ========================================
echo   CHECKING TEAM PHOTOS STATUS
echo ========================================
echo.

echo 📁 Checking images directory...
if not exist "frontend\public\images" (
    echo ❌ Images directory not found
    mkdir "frontend\public\images"
    echo ✅ Created images directory
) else (
    echo ✅ Images directory exists
)

echo.
echo 📸 Checking individual photos...
echo.

echo 🔍 Wilson Bundi (wilson-bundi.jpg):
if exist "frontend\public\images\wilson-bundi.jpg" (
    for %%A in ("frontend\public\images\wilson-bundi.jpg") do (
        if %%~zA GTR 0 (
            echo ✅ Found - Size: %%~zA bytes
        ) else (
            echo ⚠️  Found but file is empty (0 bytes)
            echo 💡 Please re-save Wilson's photo to this location
        )
    )
) else (
    echo ❌ Not found
    echo 💡 Save Wilson's photo as: frontend\public\images\wilson-bundi.jpg
)

echo.
echo 🔍 Henry Mutuma (henry-mutuma.jpg):
if exist "frontend\public\images\henry-mutuma.jpg" (
    for %%A in ("frontend\public\images\henry-mutuma.jpg") do (
        if %%~zA GTR 0 (
            echo ✅ Found - Size: %%~zA bytes
        ) else (
            echo ⚠️  Found but file is empty (0 bytes)
        )
    )
) else (
    echo ❌ Not found - Using "HM" green badge instead
    echo 💡 Save Henry's photo as: frontend\public\images\henry-mutuma.jpg
)

echo.
echo 🔍 Samuel Eringo (samuel-eringo.jpg):
if exist "frontend\public\images\samuel-eringo.jpg" (
    for %%A in ("frontend\public\images\samuel-eringo.jpg") do (
        if %%~zA GTR 0 (
            echo ✅ Found - Size: %%~zA bytes
        ) else (
            echo ⚠️  Found but file is empty (0 bytes)
        )
    )
) else (
    echo ❌ Not found - Using "SE" purple badge instead
    echo 💡 Save Samuel's photo as: frontend\public\images\samuel-eringo.jpg
)

echo.
echo 📋 CURRENT TEAM DISPLAY:
echo 👤 Samuel Eringo (CEO) - "SE" purple badge
echo 👤 Henry Mutuma (Credit Manager) - "HM" green badge or actual photo
echo 📷 Wilson Bundi (Lead Developer) - Actual photo or emoji fallback
echo.

echo 🌐 Visit http://localhost:3000 to see the team section
echo 🔄 Refresh the page after adding/updating photos
echo.
pause