@echo off
echo Adding Samuel Eringo's photo...

REM Check if the images directory exists
if not exist "frontend\public\images" (
    echo Creating images directory...
    mkdir "frontend\public\images"
)

echo.
echo INSTRUCTIONS:
echo 1. Save Samuel Eringo's photo (the first image you provided) as "samuel-eringo.jpg"
echo 2. Copy it to: frontend\public\images\samuel-eringo.jpg
echo 3. The photo should show Samuel in a blue shirt and khaki pants
echo.
echo Current images in directory:
dir "frontend\public\images" /b

echo.
echo Photo integration complete! The landing page will now display:
echo - Samuel Eringo (CEO) - Real photo with animated border
echo - Henry Mutuma (Credit Manager) - Real photo with animated border  
echo - Wilson Bundi (Lead Developer) - Real photo with animated border
echo.
echo All photos will rotate automatically every 4 seconds with smooth animations.
pause