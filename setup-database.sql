-- Jilinde Credit Database Setup
-- Run this script in PostgreSQL to create the database

-- Create database (run this as postgres user)
CREATE DATABASE jilinde_credit;

-- Connect to the database
\c jilinde_credit;

-- The Spring Boot application will automatically create the tables
-- when it starts up using JPA/Hibernate DDL auto-generation

-- Verify database creation
SELECT current_database();

-- Show that we're ready
\echo 'Database jilinde_credit created successfully!'
\echo 'You can now start the Spring Boot application.'