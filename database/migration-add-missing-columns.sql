-- Migration Script: Add Missing Columns to Customers Table
-- This script adds the missing document verification columns

-- Add missing columns to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS login_pin VARCHAR(4),
ADD COLUMN IF NOT EXISTS document_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS document_file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS document_hash TEXT, -- Using TEXT instead of VARCHAR(255) for long hashes
ADD COLUMN IF NOT EXISTS document_verification_score INTEGER;

-- Create customer_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS customer_profiles (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    digital_literacy_level INTEGER DEFAULT 1 CHECK (digital_literacy_level BETWEEN 1 AND 5),
    preferred_language VARCHAR(20) DEFAULT 'english',
    voice_assistance_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create biometric_data table if it doesn't exist
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

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_customers_national_id ON customers(national_id);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_customer_id ON customer_profiles(customer_id);
CREATE INDEX IF NOT EXISTS idx_biometric_data_customer_id ON biometric_data(customer_id);

-- Update existing customers to have default values for new columns
UPDATE customers 
SET 
    document_verification_score = 0
WHERE document_verification_score IS NULL;

COMMIT;