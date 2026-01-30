# Jilinde Credit Setup Guide

## Prerequisites

1. **Java 17+** - For Spring Boot backend
2. **Node.js 16+** - For React frontend
3. **PostgreSQL 12+** - For database
4. **Maven 3.6+** - For Java dependency management

## Database Setup

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE jilinde_credit;
```

2. Run the schema creation script:
```bash
psql -U postgres -d jilinde_credit -f database/schema.sql
```

3. (Optional) Load sample data:
```bash
psql -U postgres -d jilinde_credit -f database/sample_data.sql
```

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Update database credentials in `src/main/resources/application.yml`

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080/api`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at: `http://localhost:3000`

## Default Login Credentials

- **Username**: admin
- **Password**: admin123

## API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/loans` - List loans
- `POST /api/loans` - Create loan
- `GET /api/payments` - List payments
- `POST /api/payments` - Record payment

## Next Steps

1. Complete the remaining entity models (Loan, LoanProduct, Payment)
2. Implement repository layers
3. Create service classes with business logic
4. Build REST controllers
5. Implement JWT authentication
6. Create React components and pages
7. Add form validation and error handling
8. Implement reporting features