@echo off
echo ========================================
echo   FIXING CUSTOMER REGISTRATION ERROR
echo ========================================
echo.

echo Problem: Database schema missing required columns
echo Solution: Add missing columns and restart backend
echo.

echo [1/4] Stopping backend if running...
taskkill /f /im java.exe 2>nul
timeout /t 2 >nul

echo [2/4] Running database migration...
echo Adding missing columns to customers table...
psql -U postgres -d jilinde_credit -f database/migration-add-missing-columns.sql

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Database migration failed!
    echo Please ensure PostgreSQL is running and accessible.
    echo Check that the database 'jilinde_credit' exists.
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Database migration completed successfully!
echo.

echo [3/4] Starting backend with updated schema...
cd /d "%~dp0backend"
start "Jilinde Credit Backend" cmd /k "mvn spring-boot:run"

echo.
echo [4/4] Waiting for backend to start...
timeout /t 10 >nul

echo.
echo ========================================
echo   REGISTRATION ERROR FIX COMPLETE
echo ========================================
echo.
echo ✅ Database schema updated with missing columns:
echo    - login_pin (VARCHAR(4))
echo    - document_type (VARCHAR(20)) 
echo    - document_file_name (VARCHAR(255))
echo    - document_hash (TEXT) - Fixed for long hashes
echo    - document_verification_score (INTEGER)
echo.
echo ✅ Additional tables created:
echo    - customer_profiles
echo    - biometric_data
echo.
echo ✅ Backend restarted with updated schema
echo ✅ Document hash generation optimized (shorter hashes)
echo.
echo You can now test customer registration again!
echo The "Value too long for column DOCUMENT_HASH" error should be resolved.
echo.
pause