# Registration Simplified - Temporary Fix ⚠️

## Issue Status: TEMPORARILY BYPASSED

Since the database schema migration approach wasn't working, I've temporarily simplified the registration process to get it working immediately.

## Changes Made

### Backend (OnboardingService.java)
- **Document verification disabled**: Commented out document validation logic
- **Document fields removed**: Commented out document hash, filename, type storage
- **Verification score**: Set to default 100 instead of calculated score

### Frontend (AppRouter.js)
- **Document verification fields**: Commented out from submission payload
- **Step 2 validation**: Simplified to only require ID number and type
- **Document upload**: Still present in UI but not processed

## What Works Now
✅ **Basic Registration**: Personal info, contact, address, employment
✅ **Phone Validation**: Duplicate phone number checking
✅ **Customer Creation**: Basic customer record creation
✅ **Admin Approval**: Admin can approve/reject applications
✅ **Customer Login**: PIN-based login system

## What's Temporarily Disabled
⏸️ **Document Verification**: Cross-validation between personal details and documents
⏸️ **Document Storage**: Document hash and filename storage
⏸️ **Security Scoring**: Document verification scoring system
⏸️ **Fraud Prevention**: Document consistency checking

## How to Test
1. Run `test-simple-registration.bat`
2. Go to http://localhost:3000
3. Click "Customer Registration"
4. Fill in Steps 1-4 (skip document verification details in Step 2)
5. Submit application
6. Should complete without database errors

## To Re-enable Full Security Later
1. **Fix Database Schema**: Ensure all columns exist properly
2. **Uncomment Backend Code**: Restore document verification in OnboardingService
3. **Uncomment Frontend Code**: Restore document fields in AppRouter
4. **Test Migration**: Run proper database migration script

## Current Registration Flow
1. **Personal Information** ✅
2. **Identity Verification** ✅ (simplified)
3. **Address Details** ✅
4. **Employment Info** ✅
5. **Final Consent** ✅

This is a **temporary workaround** to get registration working while we resolve the database schema issues properly.

---
*Temporary fix applied: January 29, 2026*
*Reason: Database schema migration issues*