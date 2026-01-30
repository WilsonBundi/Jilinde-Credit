# Jilinde Credit - Setup Instructions

## Prerequisites Installation

### 1. Install Node.js (Required for Frontend)

**Option A: Download from Official Website**
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer and follow the setup wizard
4. Restart your command prompt/PowerShell

**Option B: Using Chocolatey (if you have it)**
```powershell
choco install nodejs
```

**Option C: Using Winget**
```powershell
winget install OpenJS.NodeJS
```

### 2. Verify Installation
After installing Node.js, verify it's working:
```powershell
node --version
npm --version
```

You should see version numbers for both commands.

## Running the Frontend

Once Node.js is installed:

### 1. Navigate to Frontend Directory
```powershell
cd "C:\Users\HomePC\Desktop\Jilinde Credit\frontend"
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Create Environment File
```powershell
copy .env.example .env
```

### 4. Start Development Server
```powershell
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

## What You'll See

✅ **Login Page** - Clean authentication interface
✅ **Dashboard** - Overview with key metrics and recent activity
✅ **Customers** - Customer management interface
✅ **Loans** - Loan tracking and management
✅ **Payments** - Payment processing interface
✅ **Responsive Design** - Works on desktop, tablet, and mobile

## Troubleshooting

### If npm install fails:
```powershell
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### If port 3000 is busy:
```powershell
# The app will automatically try port 3001, 3002, etc.
# Or you can specify a different port:
set PORT=3001 && npm start
```

### If you see CORS errors:
- This is normal since the backend isn't running yet
- The frontend will work for UI testing
- API calls will fail until the Java backend is started

## Next Steps

1. **Install Node.js** (if not already done)
2. **Run the frontend** following the steps above
3. **Explore the UI** - Navigate through different sections
4. **Start the backend** - We'll set up the Java Spring Boot backend next

## Backend Setup (Coming Next)

After the frontend is running, we'll set up:
- Java 17+ installation
- Maven configuration
- PostgreSQL database
- Spring Boot backend server

The complete system will then be fully functional!