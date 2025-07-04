-- Property Management System Database Schema
-- Phase 2: Complete MySQL Implementation

-- Create database (run this separately if needed)
-- CREATE DATABASE property_management;
-- USE property_management;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS remittances;
DROP TABLE IF EXISTS rent_payments;
DROP TABLE IF EXISTS tenancy_agreements;
DROP TABLE IF EXISTS tenants;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS estates;
DROP TABLE IF EXISTS company_expenses;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS agents;
DROP TABLE IF EXISTS landlords;
DROP TABLE IF EXISTS users;

-- Users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'agent') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agent_no VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    gender ENUM('Male', 'Female', 'Other'),
    commission_rate DECIMAL(5,2) DEFAULT 1.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Landlords table
CREATE TABLE landlords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    landlord_no VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    gender ENUM('Male', 'Female', 'Other'),
    bank_account VARCHAR(50),
    bank_name VARCHAR(100),
    id_number VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Estates table
CREATE TABLE estates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estate_no VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    total_houses INT DEFAULT 0,
    occupied_houses INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_no VARCHAR(50) UNIQUE NOT NULL,
    estate_id INT,
    landlord_id INT,
    agent_id INT,
    house_number VARCHAR(20) NOT NULL,
    house_type ENUM('Bedsitter', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4+ Bedroom', 'Commercial') NOT NULL,
    rent_amount DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2),
    status ENUM('Vacant', 'Occupied', 'Under Maintenance', 'Reserved') DEFAULT 'Vacant',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (estate_id) REFERENCES estates(id) ON DELETE SET NULL,
    FOREIGN KEY (landlord_id) REFERENCES landlords(id) ON DELETE SET NULL,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL
);

-- Tenants table
CREATE TABLE tenants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_no VARCHAR(50) UNIQUE NOT NULL,
    property_id INT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    id_number VARCHAR(20),
    gender ENUM('Male', 'Female', 'Other'),
    occupation VARCHAR(100),
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    move_in_date DATE,
    move_out_date DATE,
    deposit_paid DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
);

-- Tenancy agreements table
CREATE TABLE tenancy_agreements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_no VARCHAR(50) UNIQUE NOT NULL,
    tenant_id INT NOT NULL,
    property_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2),
    terms_conditions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Rent payments table
CREATE TABLE rent_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_no VARCHAR(50) UNIQUE NOT NULL,
    tenant_id INT,
    property_id INT,
    amount_paid DECIMAL(10,2) NOT NULL,
    rent_month DATE NOT NULL,
    payment_date DATE DEFAULT (CURRENT_DATE),
    payment_method ENUM('Cash', 'Bank Transfer', 'Mobile Money', 'Cheque') DEFAULT 'Cash',
    penalty_amount DECIMAL(10,2) DEFAULT 0,
    balance_before DECIMAL(10,2) DEFAULT 0,
    balance_after DECIMAL(10,2) DEFAULT 0,
    receipt_number VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
);

-- Company expenses table
CREATE TABLE company_expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_no VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE DEFAULT (CURRENT_DATE),
    category ENUM('Maintenance', 'Utilities', 'Marketing', 'Administrative', 'Legal', 'Other') DEFAULT 'Other',
    vendor VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Remittances table (payments to landlords)
CREATE TABLE remittances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    remittance_no VARCHAR(50) UNIQUE NOT NULL,
    landlord_id INT,
    property_id INT,
    rent_collected DECIMAL(10,2) NOT NULL,
    company_commission DECIMAL(10,2) NOT NULL,
    agent_commission DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    remittance_date DATE DEFAULT (CURRENT_DATE),
    payment_method ENUM('Cash', 'Bank Transfer', 'Mobile Money', 'Cheque') DEFAULT 'Bank Transfer',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (landlord_id) REFERENCES landlords(id) ON DELETE SET NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
);

-- Employees table
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_no VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    salary DECIMAL(10,2),
    phone VARCHAR(20),
    email VARCHAR(100),
    hire_date DATE DEFAULT (CURRENT_DATE),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_properties_estate ON properties(estate_id);
CREATE INDEX idx_properties_landlord ON properties(landlord_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_tenants_property ON tenants(property_id);
CREATE INDEX idx_tenants_active ON tenants(is_active);
CREATE INDEX idx_rent_payments_tenant ON rent_payments(tenant_id);
CREATE INDEX idx_rent_payments_property ON rent_payments(property_id);
CREATE INDEX idx_rent_payments_month ON rent_payments(rent_month);
CREATE INDEX idx_remittances_landlord ON remittances(landlord_id);

-- Insert default admin user
INSERT INTO users (email, password, role) VALUES 
('admin@propertyms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- Password is 'password' (hashed with bcrypt)

-- Insert sample data for testing
INSERT INTO agents (agent_no, name, phone, email, gender, commission_rate) VALUES
('AGT001', 'John Doe', '+254700123456', 'john.doe@email.com', 'Male', 1.00),
('AGT002', 'Jane Smith', '+254700123457', 'jane.smith@email.com', 'Female', 1.00);

INSERT INTO landlords (landlord_no, name, phone, email, gender, bank_account, bank_name) VALUES
('LL001', 'Robert Johnson', '+254700123458', 'robert.j@email.com', 'Male', '1234567890', 'KCB Bank'),
('LL002', 'Mary Wilson', '+254700123459', 'mary.w@email.com', 'Female', '0987654321', 'Equity Bank');

INSERT INTO estates (estate_no, name, location, description, total_houses) VALUES
('EST001', 'Sunrise Apartments', 'Westlands, Nairobi', 'Modern apartment complex', 20),
('EST002', 'Garden View Estate', 'Karen, Nairobi', 'Family-friendly estate', 15);

INSERT INTO properties (property_no, estate_id, landlord_id, agent_id, house_number, house_type, rent_amount, deposit_amount) VALUES
('PROP001', 1, 1, 1, 'A1', '2 Bedroom', 35000.00, 35000.00),
('PROP002', 1, 1, 1, 'A2', '1 Bedroom', 25000.00, 25000.00),
('PROP003', 2, 2, 2, 'B1', '3 Bedroom', 50000.00, 50000.00);

-- Triggers to auto-generate numbers
DELIMITER //

CREATE TRIGGER before_insert_agents
BEFORE INSERT ON agents
FOR EACH ROW
BEGIN
    IF NEW.agent_no IS NULL OR NEW.agent_no = '' THEN
        SET NEW.agent_no = CONCAT('AGT', LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(agent_no, 4) AS UNSIGNED)), 0) + 1 FROM agents), 3, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_landlords
BEFORE INSERT ON landlords
FOR EACH ROW
BEGIN
    IF NEW.landlord_no IS NULL OR NEW.landlord_no = '' THEN
        SET NEW.landlord_no = CONCAT('LL', LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(landlord_no, 3) AS UNSIGNED)), 0) + 1 FROM landlords), 3, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_estates
BEFORE INSERT ON estates
FOR EACH ROW
BEGIN
    IF NEW.estate_no IS NULL OR NEW.estate_no = '' THEN
        SET NEW.estate_no = CONCAT('EST', LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(estate_no, 4) AS UNSIGNED)), 0) + 1 FROM estates), 3, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_properties
BEFORE INSERT ON properties
FOR EACH ROW
BEGIN
    IF NEW.property_no IS NULL OR NEW.property_no = '' THEN
        SET NEW.property_no = CONCAT('PROP', LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(property_no, 5) AS UNSIGNED)), 0) + 1 FROM properties), 3, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_tenants
BEFORE INSERT ON tenants
FOR EACH ROW
BEGIN
    IF NEW.tenant_no IS NULL OR NEW.tenant_no = '' THEN
        SET NEW.tenant_no = CONCAT('TEN', LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(tenant_no, 4) AS UNSIGNED)), 0) + 1 FROM tenants), 3, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_rent_payments
BEFORE INSERT ON rent_payments
FOR EACH ROW
BEGIN
    IF NEW.payment_no IS NULL OR NEW.payment_no = '' THEN
        SET NEW.payment_no = CONCAT('PAY', LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(payment_no, 4) AS UNSIGNED)), 0) + 1 FROM rent_payments), 3, '0'));
    END IF;
END//

DELIMITER ;

-- Update estate occupancy when property status changes
DELIMITER //

CREATE TRIGGER update_estate_occupancy_after_property_update
AFTER UPDATE ON properties
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        UPDATE estates SET 
            occupied_houses = (SELECT COUNT(*) FROM properties WHERE estate_id = NEW.estate_id AND status = 'Occupied')
        WHERE id = NEW.estate_id;
        
        IF OLD.estate_id != NEW.estate_id THEN
            UPDATE estates SET 
                total_houses = (SELECT COUNT(*) FROM properties WHERE estate_id = OLD.estate_id),
                occupied_houses = (SELECT COUNT(*) FROM properties WHERE estate_id = OLD.estate_id AND status = 'Occupied')
            WHERE id = OLD.estate_id;
        END IF;
    END IF;
END//

DELIMITER ;