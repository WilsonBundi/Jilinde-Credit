@echo off
echo ========================================
echo   FIXING DATABASE SCHEMA - ADDING MISSING COLUMNS
echo ========================================
echo.

echo [1/3] Connecting to PostgreSQL database...
echo Running migration to add missing columns...
echo.

echo [2/3] Executing migration script...
psql -U postgres -d jilinde_credit -f database/migration-add-missing-columns.sql

echo.
echo [3/3] Migration completed!
echo.
echo ========================================
echo   DATABASE SCHEMA FIX COMPLETE
echo ========================================
echo.
echo The following columns have been added to the customers table:
echo - login_pin (VARCHAR(4))
echo - document_type (VARCHAR(20))
echo - document_file_name (VARCHAR(255))
echo - document_hash (TEXT) - Fixed to handle long hashes
echo - document_verification_score (INTEGER)
echo.
echo Additional tables created:
echo - customer_profiles
echo - biometric_data
echo.
echo You can now restart the backend and test registration again.
echo.
pause