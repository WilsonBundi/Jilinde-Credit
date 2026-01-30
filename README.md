# 🏦 Jilinde Credit Limited - Microfinance Management System

A comprehensive microfinance management system with advanced KYC biometric verification, built with Spring Boot and React.

## 🚀 Features

### 🔒 **Advanced Security**
- **Mobile-Only KYC Verification** - QR code system for secure biometric verification
- **Document Verification** - OCR-based document validation and cross-verification
- **Biometric Authentication** - Face verification with liveness detection
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin, Manager, and Officer roles

### 📱 **Customer Portal**
- **6-Step Registration** - Comprehensive onboarding with KYC verification
- **Loan Applications** - Digital loan application process
- **Payment Management** - Track payments and loan status
- **Profile Management** - Update personal and financial information
- **Mobile-Responsive** - Optimized for mobile devices

### 👨‍💼 **Admin Portal**
- **Application Review** - Review and approve customer applications
- **Customer Management** - Comprehensive customer database
- **Loan Management** - Track and manage all loans
- **Analytics Dashboard** - Real-time statistics and insights
- **Document Verification Scores** - Security assessment for applications

### 🏢 **Business Features**
- **12 Microfinance Services** - Personal loans, business loans, asset financing, etc.
- **Credit Scoring** - Automated credit assessment
- **Risk Management** - Multi-level risk categorization
- **Digital Banking** - Online banking capabilities
- **Group Lending** - Community-based lending programs

## 🛠️ Technology Stack

### **Backend**
- **Java 17** - Modern Java development
- **Spring Boot 3.x** - Enterprise application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction layer
- **H2 Database** - In-memory database for development
- **Maven** - Dependency management and build tool

### **Frontend**
- **React 18** - Modern UI library
- **Material-UI** - Professional UI components
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features
- **Responsive Design** - Mobile-first approach

### **Security & Verification**
- **JWT Tokens** - Secure authentication
- **Biometric Verification** - Face and document verification
- **OCR Processing** - Document text extraction
- **Liveness Detection** - Anti-spoofing protection
- **Device Validation** - Mobile device enforcement

## 📋 Prerequisites

- **Java 17+** - Required for Spring Boot
- **Node.js 16+** - Required for React frontend
- **Maven 3.6+** - For backend build management
- **Git** - Version control

## 🚀 Quick Start

### **1. Clone Repository**
```bash
git clone https://github.com/WilsonBundi/Jilinde-Credit.git
cd Jilinde-Credit
```

### **2. Backend Setup**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend will start on: http://localhost:8080

### **3. Frontend Setup**
```bash
cd frontend
npm install
npm start
```
Frontend will start on: http://localhost:3000

## 📱 System Access

### **🏠 Landing Page**
- **URL**: http://localhost:3000
- **Features**: Company information, services, team, contact details

### **👤 Customer Registration**
- **URL**: http://localhost:3000/register
- **Process**: 6-step registration with mobile KYC verification
- **Requirements**: Mobile device for biometric verification

### **🔐 Admin Portal**
- **URL**: http://localhost:3000/admin
- **Credentials**: admin / admin123
- **Features**: Application review, customer management, analytics

### **👥 Customer Portal**
- **URL**: http://localhost:3000/customer
- **Access**: After admin approval and PIN generation
- **Features**: Loan applications, payment tracking, profile management

## 🔒 KYC Verification Process

### **Mobile-Only Security**
1. **Desktop Registration** - Complete steps 1-4 on computer
2. **QR Code Generation** - System generates secure QR code
3. **Mobile Scanning** - Scan QR code with mobile phone
4. **Device Validation** - System validates mobile device
5. **Document Scanning** - Live camera capture of ID documents
6. **Face Verification** - Liveness detection and face matching
7. **Cross-Verification** - Face-document matching validation
8. **Results Sync** - Verification results sync back to desktop

### **Security Features**
- ❌ **Laptop cameras BLOCKED** - Desktop/laptop cameras prohibited
- ✅ **Mobile device enforcement** - Server-side device validation
- ✅ **15-minute sessions** - Time-limited secure sessions
- ✅ **Real-time synchronization** - Live status updates
- ✅ **Document validation** - OCR and cross-verification

## 📊 API Endpoints

### **Authentication**
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Token refresh

### **Customer Management**
- `POST /api/onboarding/register` - Customer registration
- `GET /api/customers` - List customers (Admin)
- `PUT /api/customers/{id}` - Update customer

### **Mobile KYC**
- `POST /api/mobile-kyc/create-session` - Create QR session
- `GET /api/mobile-kyc/session/{id}/status` - Poll session status
- `POST /api/mobile-kyc/session/{id}/verify` - Process verification

### **Admin Operations**
- `GET /api/admin/applications` - List applications
- `POST /api/admin/applications/{id}/approve` - Approve application
- `POST /api/admin/applications/{id}/reject` - Reject application

## 🏢 Company Information

### **Jilinde Credit Limited**
- **Phone**: +254719696631 (Samuel Eringo)
- **WhatsApp**: Available for customer support
- **Services**: 12 comprehensive microfinance services
- **Mission**: Providing accessible financial services to underserved communities

### **Team**
- **Samuel Eringo** - CEO & Founder
- **Henry Mutuma** - Credit Manager
- **Wilson Bundi** - Lead Developer

## 🔧 Development

### **Project Structure**
```
Jilinde-Credit/
├── backend/                 # Spring Boot API
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml            # Maven dependencies
├── frontend/               # React application
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   └── package.json       # NPM dependencies
├── database/              # Database scripts
└── docs/                  # Documentation
```

### **Key Components**
- **BiometricService** - KYC verification logic
- **MobileKycSessionService** - QR code session management
- **DocumentVerificationService** - Document validation
- **OnboardingService** - Customer registration
- **AdminController** - Admin operations
- **MobileKycController** - Mobile verification endpoints

## 🚀 Deployment

### **Production Setup**
1. **Database**: Configure PostgreSQL for production
2. **Security**: Update JWT secrets and security configurations
3. **Environment**: Set production environment variables
4. **Build**: Create production builds for both frontend and backend
5. **Deploy**: Deploy to cloud platform (AWS, Azure, etc.)

### **Environment Variables**
```bash
# Database
DB_URL=jdbc:postgresql://localhost:5432/jilinde_credit
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400000

# Application
SERVER_PORT=8080
CLIENT_URL=http://localhost:3000
```

## 📄 License

This project is proprietary software developed for Jilinde Credit Limited.

## 🤝 Contributing

This is a private project for Jilinde Credit Limited. For development inquiries, contact the development team.

## 📞 Support

For technical support or business inquiries:
- **Phone**: +254719696631
- **WhatsApp**: Available for immediate assistance
- **Email**: Contact through official channels

---

**🏦 Jilinde Credit Limited - Empowering Financial Inclusion Through Technology**