# API 403 Error Debugging Guide

## Current Issue
The backend is returning **403 Forbidden** errors for the phone verification endpoint, even though:
- The endpoint `/api/onboarding/check-phone` is configured as `permitAll()` in SecurityConfig
- The endpoint has no `@PreAuthorize` annotations
- CORS is configured to allow all origins

## Debugging Steps

### 1. Check Browser Developer Tools
Open the browser developer tools (F12) and look at:
- **Network tab**: Check the actual request being made
- **Console tab**: Look for CORS or other error messages
- **Request headers**: Verify Content-Type and other headers
- **Response headers**: Check if CORS headers are present

### 2. Expected Request Format
The frontend should be making this request:
```
POST https://jilinde-credit-production.up.railway.app/api/onboarding/check-phone
Content-Type: application/json

{
  "phone": "+254712345678"
}
```

### 3. Expected Response
- **Success (200)**: `{"status": "AVAILABLE", "message": "Phone number is available"}`
- **Phone in use (400)**: `{"error": "PHONE_IN_USE", "message": "Phone number is already registered"}`
- **Error (403)**: Should not happen for this endpoint

### 4. Possible Causes of 403 Error

#### A. CORS Preflight Issues
- Browser sends OPTIONS request first
- Server might not be handling OPTIONS properly
- Missing CORS headers in response

#### B. Security Filter Chain Issues
- JWT filter might be intercepting the request
- Security configuration might have conflicting rules
- Request matcher patterns might not be working

#### C. Railway Deployment Issues
- Environment variables not set correctly
- Database connection issues causing security failures
- Railway proxy/load balancer issues

### 5. Quick Fixes to Try

#### Fix 1: Add OPTIONS Method Support
In SecurityConfig.java, ensure OPTIONS is allowed:
```java
.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
```

#### Fix 2: Verify Request URL
Make sure the frontend is calling the correct URL:
- Production: `https://jilinde-credit-production.up.railway.app/api/onboarding/check-phone`
- Local: `http://localhost:8080/api/onboarding/check-phone`

#### Fix 3: Check JWT Filter
The JWT filter might be processing requests it shouldn't. Verify it's not interfering with public endpoints.

### 6. Temporary Workaround
The current code handles 403 errors gracefully:
- Shows "Phone verification unavailable - you can still proceed"
- Allows form submission to continue
- Only blocks if phone is actually in use (400 error)

### 7. Testing Commands
If you have access to curl or a REST client:

```bash
# Test the endpoint directly
curl -X POST https://jilinde-credit-production.up.railway.app/api/onboarding/check-phone \
  -H "Content-Type: application/json" \
  -d '{"phone": "+254712345678"}' \
  -v

# Check if server is responding
curl -I https://jilinde-credit-production.up.railway.app/health

# Test CORS preflight
curl -X OPTIONS https://jilinde-credit-production.up.railway.app/api/onboarding/check-phone \
  -H "Origin: https://your-frontend-domain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

## Next Steps
1. Check browser developer tools for detailed error information
2. Verify the exact request being made by the frontend
3. Test the API endpoint directly if possible
4. Check Railway logs for backend error messages
5. Consider temporarily adding more debug logging to the backend

The current implementation allows users to proceed with registration even when phone verification fails, so the application remains functional while we debug this issue.