-- Jilinde Credit Database Schema - UPDATED
-- Microfinance Management System with Enhanced Security Features

-- Create database
CREATE DATABASE IF NOT EXISTS jilinde_credit;

-- Use the database
\c jilinde_credit;

-- Users table (for system authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'OFFICER')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table - UPDATED with document verification fields
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    customer_code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    national_id VARCHAR(20) UNIQUE,
    login_pin VARCHAR(4),
    address TEXT,
    occupation VARCHAR(100),
    monthly_income DECIMAL(12,2),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE')),
    marital_status VARCHAR(20),
    
    -- Document verification fields (ADDED)
    document_type VARCHAR(20),
    document_file_name VARCHAR(255),
    document_hash TEXT, -- Changed from VARCHAR(255) to TEXT to handle long hashes
    document_verification_score INTEGER,
    
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer profiles table (for enhanced customer data)
CREATE TABLE IF NOT EXISTS customer_profiles (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    digital_literacy_level INTEGER DEFAULT 1 CHECK (digital_literacy_level BETWEEN 1 AND 5),
    preferred_language VARCHAR(20) DEFAULT 'english',
    voice_assistance_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Biometric data table (for KYC verification)
CREATE TABLE IF NOT EXISTS biometric_data (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    face_template TEXT,
    fingerprint_template TEXT,
    verification_status VARCHAR(20) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'FAILED')),
    verification_score DECIMAL(5,2),
    verification_date TIMESTAMP,
    device_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan products table
CREATE TABLE IF NOT EXISTS loan_products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    min_amount DECIMAL(12,2) NOT NULL,
    max_amount DECIMAL(12,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    min_term_months INTEGER NOT NULL,
    max_term_months INTEGER NOT NULL,
    processing_fee_rate DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loans table
CREATE TABLE IF NOT EXISTS loans (
    id SERIAL PRIMARY KEY,
    loan_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    product_id INTEGER NOT NULL REFERENCES loan_products(id),
    principal_amount DECIMAL(12,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    term_months INTEGER NOT NULL,
    monthly_payment DECIMAL(12,2) NOT NULL,
    processing_fee DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'DISBURSED', 'ACTIVE', 'COMPLETED', 'DEFAULTED', 'REJECTED')),
    application_date DATE NOT NULL,
    approval_date DATE,
    disbursement_date DATE,
    maturity_date DATE,
    approved_by INTEGER REFERENCES users(id),
    disbursed_by INTEGER REFERENCES users(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    payment_number VARCHAR(20) UNIQUE NOT NULL,
    loan_id INTEGER NOT NULL REFERENCES loans(id),
    payment_date DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    principal_amount DECIMAL(12,2) NOT NULL,
    interest_amount DECIMAL(12,2) NOT NULL,
    penalty_amount DECIMAL(12,2) DEFAULT 0,
    payment_method VARCHAR(20) CHECK (payment_method IN ('CASH', 'BANK_TRANSFER', 'MOBILE_MONEY')),
    reference_number VARCHAR(50),
    received_by INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_customer_code ON customers(customer_code);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_national_id ON customers(national_id);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_customer_id ON customer_profiles(customer_id);
CREATE INDEX IF NOT EXISTS idx_biometric_data_customer_id ON biometric_data(customer_id);
CREATE INDEX IF NOT EXISTS idx_loans_loan_number ON loans(loan_number);
CREATE INDEX IF NOT EXISTS idx_loans_customer_id ON loans(customer_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_payments_loan_id ON payments(loan_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);

-- Insert default loan products (if not exists)
INSERT INTO loan_products (product_name, description, min_amount, max_amount, interest_rate, min_term_months, max_term_months, processing_fee_rate) 
SELECT * FROM (VALUES
    ('Personal Loan', 'Quick personal loans for individual needs', 50000, 500000, 15.0, 3, 12, 2.0),
    ('Business Loan', 'Loans for small business development', 100000, 2000000, 12.0, 6, 24, 1.5),
    ('Emergency Loan', 'Fast emergency loans', 25000, 200000, 18.0, 1, 6, 3.0)
) AS v(product_name, description, min_amount, max_amount, interest_rate, min_term_months, max_term_months, processing_fee_rate)
WHERE NOT EXISTS (SELECT 1 FROM loan_products WHERE product_name = v.product_name);

-- Insert default admin user (password: admin123) if not exists
INSERT INTO users (username, email, password_hash, role) 
SELECT 'admin', 'admin@jilindecredit.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM5lE7u8S8G.fqUlyDO.', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');