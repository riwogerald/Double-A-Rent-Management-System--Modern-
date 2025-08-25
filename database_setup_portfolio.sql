-- Double A Rent Management System - Portfolio Database Setup
-- Enhanced with unique, realistic test data for demonstration

-- Create database
CREATE DATABASE IF NOT EXISTS property_management_portfolio;
USE property_management_portfolio;

-- Drop existing tables for clean setup
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
    full_name VARCHAR(100),
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

-- Insert Demo User Accounts (Portfolio Ready)
-- Password for all accounts: Demo123!
INSERT INTO users (email, password, role, full_name) VALUES 
('admin@property.com', '$2b$10$WcGOKNeedbWg2surioKW4unhJSjjQGuO.Xhdgsj6FXz3KEIo6DgnG', 'admin', 'System Administrator'),
('manager@property.com', '$2b$10$WcGOKNeedbWg2surioKW4unhJSjjQGuO.Xhdgsj6FXz3KEIo6DgnG', 'manager', 'Property Manager'),
('agent1@property.com', '$2b$10$WcGOKNeedbWg2surioKW4unhJSjjQGuO.Xhdgsj6FXz3KEIo6DgnG', 'agent', 'Sarah Johnson'),
('agent2@property.com', '$2b$10$WcGOKNeedbWg2surioKW4unhJSjjQGuO.Xhdgsj6FXz3KEIo6DgnG', 'agent', 'Michael Chen'),
('test@example.com', '$2b$10$WcGOKNeedbWg2surioKW4unhJSjjQGuO.Xhdgsj6FXz3KEIo6DgnG', 'admin', 'Test User');

-- Portfolio-Ready Agents (Diverse and Professional)
INSERT INTO agents (agent_no, name, phone, email, gender, commission_rate) VALUES
('AGT001', 'Sarah Johnson', '+254701234567', 'sarah.johnson@doubleaprop.com', 'Female', 2.50),
('AGT002', 'Michael Chen', '+254702345678', 'michael.chen@doubleaprop.com', 'Male', 2.00),
('AGT003', 'Aisha Patel', '+254703456789', 'aisha.patel@doubleaprop.com', 'Female', 1.75),
('AGT004', 'David Kimani', '+254704567890', 'david.kimani@doubleaprop.com', 'Male', 2.25),
('AGT005', 'Grace Wanjiku', '+254705678901', 'grace.wanjiku@doubleaprop.com', 'Female', 1.50);

-- Diverse Landlord Portfolio
INSERT INTO landlords (landlord_no, name, phone, email, gender, bank_account, bank_name, id_number, address) VALUES
('LL001', 'Dr. Robert Mwangi', '+254711234567', 'r.mwangi@email.com', 'Male', '1234567890123', 'KCB Bank', '12345678', 'Muthaiga, Nairobi'),
('LL002', 'Mrs. Elizabeth Ochieng', '+254722345678', 'e.ochieng@gmail.com', 'Female', '2345678901234', 'Equity Bank', '23456789', 'Karen, Nairobi'),
('LL003', 'Rajesh Kumar Holdings Ltd', '+254733456789', 'properties@rajeshkumar.co.ke', 'Male', '3456789012345', 'Standard Chartered', '34567890', 'Westlands, Nairobi'),
('LL004', 'Fatuma Ali Investment Group', '+254744567890', 'investments@fatumaali.com', 'Female', '4567890123456', 'NCBA Bank', '45678901', 'Lavington, Nairobi'),
('LL005', 'James Omondi Estate', '+254755678901', 'james.omondi@outlook.com', 'Male', '5678901234567', 'Co-operative Bank', '56789012', 'Kilimani, Nairobi'),
('LL006', 'Mercy Nduta Properties', '+254766789012', 'mercy.nduta@yahoo.com', 'Female', '6789012345678', 'I&M Bank', '67890123', 'Kileleshwa, Nairobi');

-- Premium Estate Properties
INSERT INTO estates (estate_no, name, location, description, total_houses, occupied_houses) VALUES
('EST001', 'Sunrise Heights', 'Westlands, Nairobi', 'Luxury apartments with modern amenities, gym, and swimming pool', 24, 20),
('EST002', 'Garden View Residences', 'Karen, Nairobi', 'Family-friendly estate with playgrounds and 24/7 security', 18, 15),
('EST003', 'The Mirage Complex', 'Kileleshwa, Nairobi', 'Executive apartments with parking and backup power', 30, 28),
('EST004', 'Acacia Court', 'Lavington, Nairobi', 'Serviced apartments with concierge services', 12, 10),
('EST005', 'Palm Springs Estate', 'Kilimani, Nairobi', 'Modern units with fiber internet and DSTV connections', 20, 18),
('EST006', 'Riverside Towers', 'Muthaiga, Nairobi', 'High-end residential complex with river views', 16, 14);

-- Diverse Property Portfolio
INSERT INTO properties (property_no, estate_id, landlord_id, agent_id, house_number, house_type, rent_amount, deposit_amount, status, description) VALUES
-- Sunrise Heights Properties
('PROP001', 1, 1, 1, 'A101', '2 Bedroom', 45000.00, 45000.00, 'Occupied', 'Master ensuite, modern kitchen, balcony'),
('PROP002', 1, 1, 1, 'A102', '1 Bedroom', 32000.00, 32000.00, 'Occupied', 'Studio design, fully furnished'),
('PROP003', 1, 1, 2, 'A201', '3 Bedroom', 65000.00, 65000.00, 'Occupied', 'Family unit, 3 bathrooms, DSQ'),
('PROP004', 1, 1, 2, 'A202', '2 Bedroom', 45000.00, 45000.00, 'Vacant', 'Recently renovated, modern fittings'),
('PROP005', 1, 2, 3, 'B101', 'Bedsitter', 25000.00, 25000.00, 'Occupied', 'Compact, ideal for young professionals'),

-- Garden View Residences
('PROP006', 2, 2, 3, 'GV001', '4+ Bedroom', 85000.00, 85000.00, 'Occupied', 'Spacious family home, garden, garage'),
('PROP007', 2, 2, 4, 'GV002', '3 Bedroom', 60000.00, 60000.00, 'Occupied', 'Open plan, modern finishes'),
('PROP008', 2, 3, 4, 'GV003', '2 Bedroom', 50000.00, 50000.00, 'Vacant', 'Ground floor, wheelchair accessible'),
('PROP009', 2, 3, 5, 'GV004', '1 Bedroom', 35000.00, 35000.00, 'Occupied', 'Balcony overlooking garden'),

-- The Mirage Complex
('PROP010', 3, 3, 1, 'MR101', '3 Bedroom', 70000.00, 70000.00, 'Occupied', 'Executive finish, city views'),
('PROP011', 3, 4, 2, 'MR102', '2 Bedroom', 55000.00, 55000.00, 'Occupied', 'Modern appliances included'),
('PROP012', 3, 4, 2, 'MR201', '1 Bedroom', 40000.00, 40000.00, 'Under Maintenance', 'Being upgraded'),
('PROP013', 3, 5, 3, 'MR202', 'Bedsitter', 28000.00, 28000.00, 'Occupied', 'Compact luxury living'),

-- Acacia Court
('PROP014', 4, 5, 4, 'AC001', '4+ Bedroom', 120000.00, 120000.00, 'Occupied', 'Penthouse, panoramic views'),
('PROP015', 4, 6, 5, 'AC002', '3 Bedroom', 80000.00, 80000.00, 'Vacant', 'Premium serviced apartment'),
('PROP016', 4, 6, 1, 'AC003', '2 Bedroom', 60000.00, 60000.00, 'Reserved', 'Available next month'),

-- Commercial Properties
('PROP017', 5, 1, 2, 'PS-C01', 'Commercial', 150000.00, 300000.00, 'Occupied', 'Retail space, ground floor'),
('PROP018', 6, 2, 3, 'RT-C01', 'Commercial', 200000.00, 400000.00, 'Vacant', 'Office space, river views');

-- Realistic Tenant Data
INSERT INTO tenants (tenant_no, property_id, name, phone, email, id_number, gender, occupation, emergency_contact, emergency_phone, move_in_date, deposit_paid, is_active) VALUES
('TEN001', 1, 'Alice Wanjiru', '+254701111111', 'alice.wanjiru@gmail.com', '11111111', 'Female', 'Software Engineer', 'Peter Wanjiru', '+254702111111', '2024-01-15', 45000.00, TRUE),
('TEN002', 2, 'John Muchiri', '+254702222222', 'j.muchiri@outlook.com', '22222222', 'Male', 'Marketing Manager', 'Mary Muchiri', '+254703222222', '2024-02-01', 32000.00, TRUE),
('TEN003', 3, 'Dr. Priya Sharma', '+254703333333', 'priya.sharma@hospital.com', '33333333', 'Female', 'Medical Doctor', 'Raj Sharma', '+254704333333', '2023-12-01', 65000.00, TRUE),
('TEN004', 5, 'Kevin Ochieng', '+254705555555', 'kevin.ochieng@startup.co.ke', '55555555', 'Male', 'Tech Entrepreneur', 'Grace Ochieng', '+254706555555', '2024-03-01', 25000.00, TRUE),
('TEN005', 6, 'The Johnson Family', '+254706666666', 'johnson.family@email.com', '66666666', 'Male', 'Bank Manager', 'Sarah Johnson', '+254707666666', '2023-11-01', 85000.00, TRUE),
('TEN006', 7, 'Mohammed Hassan', '+254707777777', 'm.hassan@consulting.com', '77777777', 'Male', 'Business Consultant', 'Fatuma Hassan', '+254708777777', '2024-01-20', 60000.00, TRUE),
('TEN007', 9, 'Linda Kiprotich', '+254709999999', 'linda.kiprotich@ngo.org', '99999999', 'Female', 'NGO Coordinator', 'David Kiprotich', '+254701999999', '2024-02-15', 35000.00, TRUE),
('TEN008', 10, 'James Mwangi & Associates', '+254701010101', 'contact@mwangilaw.co.ke', '10101010', 'Male', 'Lawyer', 'Ann Mwangi', '+254702010101', '2023-10-01', 70000.00, TRUE),
('TEN009', 11, 'Susan Njeri', '+254711111111', 'susan.njeri@bank.com', '11111112', 'Female', 'Finance Manager', 'Paul Njeri', '+254712111111', '2024-01-10', 55000.00, TRUE),
('TEN010', 13, 'Alex Kimani', '+254713131313', 'alex.kimani@media.co.ke', '13131313', 'Male', 'Journalist', 'Rose Kimani', '+254714131313', '2024-02-28', 28000.00, TRUE),
('TEN011', 14, 'International Consulting Ltd', '+254714141414', 'admin@intlconsulting.com', '14141414', 'Other', 'Corporate', 'CEO Office', '+254715141414', '2023-09-01', 120000.00, TRUE),
('TEN012', 17, 'Trendy Boutique', '+254717171717', 'info@trendyboutique.co.ke', '17171717', 'Female', 'Retail Business', 'Mary Wanjiku', '+254718171717', '2023-08-15', 150000.00, TRUE);

-- Realistic Rent Payment History (Last 6 months)
INSERT INTO rent_payments (payment_no, tenant_id, property_id, amount_paid, rent_month, payment_date, payment_method, penalty_amount, balance_before, balance_after, receipt_number, notes) VALUES
-- Recent payments (January 2024)
('PAY001', 1, 1, 45000.00, '2024-01-01', '2024-01-05', 'Bank Transfer', 0, 0, 0, 'RCT001', 'On-time payment'),
('PAY002', 2, 2, 32000.00, '2024-01-01', '2024-01-03', 'Mobile Money', 0, 0, 0, 'RCT002', 'M-Pesa payment'),
('PAY003', 3, 3, 65000.00, '2024-01-01', '2024-01-02', 'Bank Transfer', 0, 0, 0, 'RCT003', 'Early payment'),
('PAY004', 5, 6, 85000.00, '2024-01-01', '2024-01-10', 'Cheque', 0, 0, 0, 'RCT004', 'Family payment'),
('PAY005', 6, 7, 60000.00, '2024-01-01', '2024-01-15', 'Bank Transfer', 1500, 0, 0, 'RCT005', 'Late payment - penalty applied'),

-- February 2024 payments
('PAY006', 1, 1, 45000.00, '2024-02-01', '2024-02-04', 'Bank Transfer', 0, 0, 0, 'RCT006', 'Regular payment'),
('PAY007', 2, 2, 32000.00, '2024-02-01', '2024-02-01', 'Mobile Money', 0, 0, 0, 'RCT007', 'Prompt payment'),
('PAY008', 3, 3, 65000.00, '2024-02-01', '2024-02-01', 'Bank Transfer', 0, 0, 0, 'RCT008', 'Excellent tenant'),
('PAY009', 7, 9, 35000.00, '2024-02-01', '2024-02-20', 'Cash', 875, 0, 0, 'RCT009', 'Cash payment with late fee'),
('PAY010', 8, 10, 70000.00, '2024-02-01', '2024-02-03', 'Bank Transfer', 0, 0, 0, 'RCT010', 'Corporate payment'),

-- March 2024 payments
('PAY011', 1, 1, 45000.00, '2024-03-01', '2024-03-05', 'Bank Transfer', 0, 0, 0, 'RCT011', 'Consistent tenant'),
('PAY012', 4, 5, 25000.00, '2024-03-01', '2024-03-01', 'Mobile Money', 0, 0, 0, 'RCT012', 'New tenant - first payment'),
('PAY013', 9, 11, 55000.00, '2024-03-01', '2024-03-08', 'Bank Transfer', 0, 0, 0, 'RCT013', 'Finance professional'),
('PAY014', 10, 13, 28000.00, '2024-03-01', '2024-03-01', 'Bank Transfer', 0, 0, 0, 'RCT014', 'Media professional'),
('PAY015', 12, 17, 150000.00, '2024-03-01', '2024-03-01', 'Bank Transfer', 0, 0, 0, 'RCT015', 'Commercial rent - boutique');

-- Company Expenses (Realistic operational costs)
INSERT INTO company_expenses (receipt_no, description, amount, expense_date, category, vendor, notes) VALUES
('EXP001', 'Plumbing repairs - Sunrise Heights A101', 8500.00, '2024-01-15', 'Maintenance', 'Nairobi Plumbers Ltd', 'Emergency repair'),
('EXP002', 'Security services - All estates', 45000.00, '2024-01-01', 'Administrative', 'SecureGuard Kenya', 'Monthly retainer'),
('EXP003', 'Property marketing - Online listings', 12000.00, '2024-01-20', 'Marketing', 'Digital Kenya Ltd', 'Website and social media'),
('EXP004', 'Legal consultation - Tenant disputes', 25000.00, '2024-02-05', 'Legal', 'Mwangi & Associates', 'Contract review'),
('EXP005', 'Electricity - Garden View common areas', 18500.00, '2024-02-01', 'Utilities', 'Kenya Power', 'February bill'),
('EXP006', 'Office supplies and stationery', 3200.00, '2024-02-10', 'Administrative', 'Office Mart', 'Monthly supplies'),
('EXP007', 'Vehicle maintenance - inspection car', 6800.00, '2024-02-15', 'Maintenance', 'Auto Care Garage', 'Routine service');

-- Employee Records
INSERT INTO employees (employee_no, name, position, salary, phone, email, hire_date, is_active) VALUES
('EMP001', 'Catherine Wanjiku', 'Office Manager', 55000.00, '+254720000001', 'catherine@doubleaprop.com', '2023-01-15', TRUE),
('EMP002', 'Peter Kimani', 'Maintenance Supervisor', 42000.00, '+254720000002', 'peter@doubleaprop.com', '2023-03-01', TRUE),
('EMP003', 'Grace Achieng', 'Accounts Assistant', 38000.00, '+254720000003', 'grace@doubleaprop.com', '2023-06-01', TRUE),
('EMP004', 'Daniel Omondi', 'Security Coordinator', 35000.00, '+254720000004', 'daniel@doubleaprop.com', '2023-08-15', TRUE);

-- Remittances (Landlord payments)
INSERT INTO remittances (remittance_no, landlord_id, property_id, rent_collected, company_commission, agent_commission, net_amount, remittance_date, payment_method, notes) VALUES
('REM001', 1, 1, 45000.00, 2250.00, 1125.00, 41625.00, '2024-01-10', 'Bank Transfer', 'January rent - PROP001'),
('REM002', 2, 2, 32000.00, 1600.00, 640.00, 29760.00, '2024-01-10', 'Bank Transfer', 'January rent - PROP002'),
('REM003', 3, 3, 65000.00, 3250.00, 1462.50, 60287.50, '2024-01-10', 'Bank Transfer', 'January rent - PROP003'),
('REM004', 2, 6, 85000.00, 4250.00, 2125.00, 78625.00, '2024-01-15', 'Bank Transfer', 'January rent - large family unit'),
('REM005', 3, 7, 60000.00, 3000.00, 1350.00, 55650.00, '2024-01-20', 'Bank Transfer', 'January rent with late fee deduction');

-- Update property statuses and occupancy
UPDATE estates SET occupied_houses = (
    SELECT COUNT(*) FROM properties 
    WHERE estate_id = estates.id AND status = 'Occupied'
) WHERE id IN (1,2,3,4,5,6);

-- Create stored procedures for business logic
DELIMITER //

CREATE PROCEDURE UpdateEstateOccupancy(IN estate_id INT)
BEGIN
    UPDATE estates SET 
        occupied_houses = (
            SELECT COUNT(*) FROM properties 
            WHERE properties.estate_id = estate_id AND status = 'Occupied'
        )
    WHERE id = estate_id;
END//

CREATE PROCEDURE CalculateMonthlyStats(IN target_month DATE)
BEGIN
    SELECT 
        COUNT(DISTINCT p.id) as total_properties,
        COUNT(CASE WHEN p.status = 'Occupied' THEN 1 END) as occupied_properties,
        COUNT(CASE WHEN p.status = 'Vacant' THEN 1 END) as vacant_properties,
        COUNT(DISTINCT t.id) as active_tenants,
        COALESCE(SUM(rp.amount_paid), 0) as monthly_collection,
        ROUND((COUNT(CASE WHEN p.status = 'Occupied' THEN 1 END) / COUNT(DISTINCT p.id)) * 100, 2) as occupancy_rate
    FROM properties p
    LEFT JOIN tenants t ON p.id = t.property_id AND t.is_active = TRUE
    LEFT JOIN rent_payments rp ON t.id = rp.tenant_id 
        AND DATE_FORMAT(rp.payment_date, '%Y-%m') = DATE_FORMAT(target_month, '%Y-%m');
END//

DELIMITER ;

-- Final data verification
SELECT 'Database setup completed successfully!' as Status;
SELECT COUNT(*) as Total_Users FROM users;
SELECT COUNT(*) as Total_Properties FROM properties;
SELECT COUNT(*) as Total_Tenants FROM tenants;
SELECT COUNT(*) as Total_Payments FROM rent_payments;
