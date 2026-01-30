# Jilinde Credit Frontend

A modern React application for the Jilinde Credit microfinance management system.

## Features

- **Modern UI**: Built with React 18 and Tailwind CSS
- **Authentication**: JWT-based authentication with protected routes
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Real-time Data**: React Query for efficient data fetching and caching
- **Form Management**: React Hook Form for form validation and handling
- **Notifications**: Toast notifications for user feedback
- **Icons**: Heroicons for consistent iconography

## Tech Stack

- **React 18** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Heroicons** - Icon library
- **React Hot Toast** - Notifications

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.js       # Main layout component
│   └── LoadingSpinner.js # Loading indicators
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Dashboard.js    # Dashboard page
│   ├── Login.js        # Login page
│   ├── Customers.js    # Customer management
│   ├── Loans.js        # Loan management
│   └── Payments.js     # Payment tracking
├── services/           # API services
│   ├── authService.js  # Authentication API
│   └── apiService.js   # Other API endpoints
├── utils/              # Utility functions
│   └── formatters.js   # Data formatting utilities
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update environment variables:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

### Development

Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Building for Production

Build the application:
```bash
npm run build
```

## Key Components

### Authentication
- JWT-based authentication
- Protected routes
- Automatic token refresh
- Login/logout functionality

### Dashboard
- Key performance indicators
- Recent activity feeds
- Quick action buttons
- Portfolio overview

### Customer Management
- Customer listing with search and filters
- Customer profile management
- Loan history tracking
- Contact information management

### Loan Management
- Loan application processing
- Approval workflows
- Repayment scheduling
- Status tracking

### Payment Processing
- Payment recording
- Multiple payment methods (M-Pesa, Bank Transfer, Cash)
- Payment history
- Receipt generation

## Styling Guidelines

### Tailwind CSS Classes
- Use utility classes for styling
- Follow mobile-first responsive design
- Consistent color scheme using custom color palette
- Component classes defined in `index.css`

### Component Structure
- Functional components with hooks
- Props validation where needed
- Consistent naming conventions
- Reusable component patterns

## API Integration

### Authentication
- JWT tokens stored in localStorage
- Automatic token attachment to requests
- Token expiration handling
- Logout on authentication errors

### Data Fetching
- React Query for caching and synchronization
- Optimistic updates where appropriate
- Error handling and retry logic
- Loading states management

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_APP_NAME=Jilinde Credit
REACT_APP_VERSION=1.0.0
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Use meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is proprietary software for Jilinde Credit.