# 🚀 Jilinde Credit - Quick Start Guide

## Prerequisites Installation

### 1. Install Java 17
**Option A: Download directly**
1. Go to https://adoptium.net/
2. Download Java 17 (LTS)
3. Run installer and follow instructions

**Option B: Using Chocolatey (if available)**
```powershell
# Run PowerShell as Administrator
choco install openjdk17 -y
```

### 2. Install Maven
**Option A: Download directly**
1. Go to https://maven.apache.org/download.cgi
2. Download Binary zip archive
3. Extract to C:\Program Files\Apache\maven
4. Add C:\Program Files\Apache\maven\bin to PATH

**Option B: Using Chocolatey**
```powershell
choco install maven -y
```

### 3. Install PostgreSQL
**Option A: Download directly**
1. Go to https://www.postgresql.org/download/windows/
2. Download and install PostgreSQL
3. Remember the password you set for 'postgres' user

**Option B: Using Chocolatey**
```powershell
choco install postgresql -y --params '/Password:password'
```

## 🔧 Environment Setup

### 1. Verify Installations
Open a **new** PowerShell window and run:
```powershell
java -version
mvn -version
psql --version
```

### 2. Create Database
```powershell
# Connect to PostgreSQL
psql -U postgres -h localhost

# In PostgreSQL prompt, create database:
CREATE DATABASE jilinde_credit;
\q
```

## 🚀 Running the Application

### 1. Start Backend
```powershell
cd backend
mvn spring-boot:run
```

**Expected Output:**
```
Started JilindeCreditApplication in X.XXX seconds
✅ Created default admin user: admin/admin123
✅ Created default loan officer user: loan_officer/loan123
✅ Created default manager user: manager/manager123
```

### 2. Verify Backend is Running
Open browser and go to: http://localhost:8080/api/auth/login

### 3. Test Authentication
**Using curl or Postman:**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@jilindecredit.com",
    "role": "ADMIN"
  }
}
```

## 🌐 Frontend Integration

### 1. Update Frontend Environment
The frontend is already configured with mock authentication. Once backend is running:

1. Edit `frontend/.env`:
```
REACT_APP_USE_MOCK_AUTH=false
```

2. Restart frontend:
```powershell
cd frontend
npm start
```

### 2. Test Full Integration
1. Go to http://localhost:3000
2. Login with: admin/admin123
3. You should now be authenticated against the real backend!

## 📡 Available API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Customer Management
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/{id}` - Get customer

### Digital Onboarding
- `POST /api/onboarding/initiate` - Start onboarding
- `POST /api/onboarding/verify-kyc` - KYC verification
- `POST /api/onboarding/capture-biometric` - Biometric capture

## 🔐 Default Users

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| admin | admin123 | ADMIN | Full system access |
| loan_officer | loan123 | OFFICER | Customer & loan management |
| manager | manager123 | MANAGER | Portfolio monitoring |

## 🐛 Troubleshooting

### Backend won't start
1. **Check Java version**: `java -version` (should be 17+)
2. **Check Maven**: `mvn -version`
3. **Check database**: Ensure PostgreSQL is running
4. **Check port**: Ensure port 8080 is free

### Database connection issues
1. **Check PostgreSQL service**: Services → PostgreSQL
2. **Verify credentials**: Default is postgres/password
3. **Check database exists**: `psql -U postgres -l`

### Frontend authentication issues
1. **Check backend is running**: http://localhost:8080/api/auth/login
2. **Verify .env setting**: `REACT_APP_USE_MOCK_AUTH=false`
3. **Clear browser cache**: Ctrl+Shift+R

## 🎯 What's Working

✅ **Authentication System** - JWT-based login
✅ **Customer Management** - Full CRUD operations
✅ **Digital Onboarding** - Complete workflow
✅ **KYC Verification** - Government database integration (mock)
✅ **Biometric Capture** - AES-256 encrypted storage
✅ **Credit Scoring** - Baseline assessment
✅ **Security** - Role-based access control
✅ **Database** - PostgreSQL with auto-schema creation

## 🚀 Next Steps

Once everything is running:
1. **Test the onboarding workflow** using the API endpoints
2. **Explore the customer management features**
3. **Try the biometric capture functionality**
4. **Review the generated credit scores**

The system is now ready for full microfinance operations!
</text>
</invoke>