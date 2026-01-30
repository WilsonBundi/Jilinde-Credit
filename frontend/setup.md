# Frontend Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your backend API URL:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   
   The application will open at `http://localhost:3000`

## Default Login Credentials

For testing purposes, use these credentials:
- **Username**: `admin`
- **Password**: `admin123`

## Features Included

✅ **Authentication System**
- JWT-based login/logout
- Protected routes
- Auto token refresh

✅ **Dashboard**
- Key metrics overview
- Recent activity feeds
- Quick action buttons

✅ **Customer Management**
- Customer listing with search
- Add/edit customer forms
- Customer profile views

✅ **Loan Management**
- Loan application processing
- Status tracking
- Repayment schedules

✅ **Payment Processing**
- Payment recording
- Multiple payment methods
- Transaction history

✅ **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimized
- Modern UI with Tailwind CSS

## Next Steps

1. **Connect to Backend**: Ensure your Java Spring Boot backend is running on port 8080
2. **Test Authentication**: Try logging in with the default credentials
3. **Explore Features**: Navigate through different sections to see the UI
4. **Customize**: Modify colors, layouts, and components as needed

## Troubleshooting

**Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000
npm start
```

**API Connection Issues**
- Check if backend is running on port 8080
- Verify REACT_APP_API_URL in .env file
- Check browser console for CORS errors

**Dependencies Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

- Use browser dev tools to inspect API calls
- Check the Network tab for API responses
- Use React Developer Tools extension
- Hot reload is enabled for instant updates