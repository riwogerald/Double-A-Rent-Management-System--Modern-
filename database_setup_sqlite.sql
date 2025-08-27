-- Double A Property Management System - SQLite Database Setup
-- Portfolio Demo Version

-- Create database directory structure
-- Note: SQLite automatically creates the database file

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Estates table
CREATE TABLE IF NOT EXISTS estates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Landlords table
CREATE TABLE IF NOT EXISTS landlords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    id_number VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    commission_rate DECIMAL(5,2) DEFAULT 5.00,
    bank_details TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    id_number VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    commission_rate DECIMAL(5,2) DEFAULT 2.00,
    hire_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_number VARCHAR(50) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    bedrooms INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    square_footage INTEGER,
    rent_amount DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'Available',
    estate_id INTEGER NOT NULL,
    landlord_id INTEGER NOT NULL,
    agent_id INTEGER,
    description TEXT,
    amenities TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estate_id) REFERENCES estates(id),
    FOREIGN KEY (landlord_id) REFERENCES landlords(id),
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    id_number VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    occupation VARCHAR(100),
    monthly_income DECIMAL(10,2),
    is_active BOOLEAN DEFAULT 1,
    move_in_date DATE,
    move_out_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tenancy agreements table
CREATE TABLE IF NOT EXISTS tenancy_agreements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    rent_amount DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    agreement_document TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Rent payments table
CREATE TABLE IF NOT EXISTS rent_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    payment_date DATE,
    due_date DATE NOT NULL,
    late_fee DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'Outstanding',
    payment_method VARCHAR(50),
    transaction_reference VARCHAR(100),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Maintenance requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    tenant_id INTEGER,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium',
    status VARCHAR(20) DEFAULT 'Open',
    assigned_to VARCHAR(255),
    cost_estimate DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    completion_date DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Commission payments table
CREATE TABLE IF NOT EXISTS commission_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER,
    landlord_id INTEGER,
    property_id INTEGER NOT NULL,
    rent_payment_id INTEGER NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    payment_date DATE,
    status VARCHAR(20) DEFAULT 'Pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id),
    FOREIGN KEY (landlord_id) REFERENCES landlords(id),
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (rent_payment_id) REFERENCES rent_payments(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_estate ON properties(estate_id);
CREATE INDEX IF NOT EXISTS idx_properties_landlord ON properties(landlord_id);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_rent_payments_tenant ON rent_payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_property ON rent_payments(property_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_due_date ON rent_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_rent_payments_status ON rent_payments(status);
CREATE INDEX IF NOT EXISTS idx_tenants_active ON tenants(is_active);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_commission_payments_agent ON commission_payments(agent_id);
CREATE INDEX IF NOT EXISTS idx_commission_payments_landlord ON commission_payments(landlord_id);

-- Insert demo users with pre-hashed passwords (Demo123!)
-- Password hash: $2b$10$mQksT.AfsUK9.PJOjVz9VuzBkTQHmppVlWlbKUWLyK8HjXro.rSse (bcrypt)
INSERT OR IGNORE INTO users (email, password) VALUES 
('admin@property.com', '$2b$10$mQksT.AfsUK9.PJOjVz9VuzBkTQHmppVlWlbKUWLyK8HjXro.rSse'),
('manager@property.com', '$2b$10$mQksT.AfsUK9.PJOjVz9VuzBkTQHmppVlWlbKUWLyK8HjXro.rSse'),
('agent1@property.com', '$2b$10$mQksT.AfsUK9.PJOjVz9VuzBkTQHmppVlWlbKUWLyK8HjXro.rSse'),
('agent2@property.com', '$2b$10$mQksT.AfsUK9.PJOjVz9VuzBkTQHmppVlWlbKUWLyK8HjXro.rSse'),
('test@example.com', '$2b$10$mQksT.AfsUK9.PJOjVz9VuzBkTQHmppVlWlbKUWLyK8HjXro.rSse');

-- Insert demo estates
INSERT OR IGNORE INTO estates (name, location, description) VALUES 
('Sunrise Heights', 'Westlands, Nairobi', 'Modern residential complex with premium amenities'),
('Garden View Apartments', 'Karen, Nairobi', 'Luxury apartments with garden views'),
('City Central Plaza', 'CBD, Nairobi', 'Commercial and residential mixed development'),
('Lakeside Villas', 'Runda, Nairobi', 'Executive villas with lake access'),
('Pine Grove Estate', 'Kileleshwa, Nairobi', 'Family-friendly residential estate');

-- Insert demo landlords
INSERT OR IGNORE INTO landlords (first_name, last_name, email, phone, id_number, address, commission_rate) VALUES 
('John', 'Kamau', 'john.kamau@email.com', '+254701234567', '12345678', 'Westlands, Nairobi', 5.0),
('Mary', 'Wanjiku', 'mary.wanjiku@email.com', '+254702345678', '23456789', 'Karen, Nairobi', 4.5),
('Peter', 'Ochieng', 'peter.ochieng@email.com', '+254703456789', '34567890', 'CBD, Nairobi', 5.5),
('Grace', 'Njeri', 'grace.njeri@email.com', '+254704567890', '45678901', 'Runda, Nairobi', 4.0);

-- Insert demo agents
INSERT OR IGNORE INTO agents (first_name, last_name, email, phone, id_number, address, commission_rate, hire_date) VALUES 
('David', 'Mwangi', 'david.mwangi@property.com', '+254705678901', '56789012', 'Kilimani, Nairobi', 2.0, '2023-01-15'),
('Sarah', 'Akinyi', 'sarah.akinyi@property.com', '+254706789012', '67890123', 'Lavington, Nairobi', 2.5, '2023-03-20'),
('Michael', 'Kiprop', 'michael.kiprop@property.com', '+254707890123', '78901234', 'Parklands, Nairobi', 1.8, '2023-06-10');

-- Insert demo properties
INSERT OR IGNORE INTO properties (unit_number, property_type, bedrooms, bathrooms, rent_amount, status, estate_id, landlord_id, agent_id, description) VALUES 
('Unit-001', 'Apartment', 2, 1, 45000, 'Occupied', 1, 1, 1, '2 bedroom apartment in Sunrise Heights'),
('Unit-002', 'Apartment', 3, 2, 65000, 'Occupied', 1, 1, 1, '3 bedroom apartment in Sunrise Heights'),
('Unit-003', 'Studio', 1, 1, 25000, 'Available', 1, 1, NULL, 'Modern studio in Sunrise Heights'),
('Unit-004', 'Villa', 4, 3, 120000, 'Occupied', 2, 2, 2, '4 bedroom villa in Garden View'),
('Unit-005', 'Townhouse', 3, 2, 85000, 'Occupied', 2, 2, 2, '3 bedroom townhouse in Garden View'),
('Unit-006', 'Penthouse', 5, 4, 200000, 'Available', 3, 3, NULL, 'Luxury penthouse in City Central'),
('Unit-007', 'Apartment', 2, 2, 55000, 'Occupied', 3, 3, 3, '2 bedroom apartment in City Central'),
('Unit-008', 'Villa', 6, 5, 300000, 'Under Maintenance', 4, 4, NULL, 'Executive villa at Lakeside'),
('Unit-009', 'Apartment', 1, 1, 35000, 'Occupied', 5, 1, 1, '1 bedroom apartment in Pine Grove'),
('Unit-010', 'Townhouse', 4, 3, 95000, 'Available', 5, 2, 2, '4 bedroom townhouse in Pine Grove');

-- Insert demo tenants
INSERT OR IGNORE INTO tenants (first_name, last_name, email, phone, id_number, address, emergency_contact, emergency_phone, is_active, move_in_date) VALUES 
('James', 'Mutua', 'james.mutua1@email.com', '+254708123456', '11111111', 'Address 1, Nairobi', 'Emergency 1', '+254718123456', 1, '2023-01-15'),
('Jane', 'Wanjiku', 'jane.wanjiku2@email.com', '+254708234567', '22222222', 'Address 2, Nairobi', 'Emergency 2', '+254718234567', 1, '2023-02-20'),
('Robert', 'Ochieng', 'robert.ochieng3@email.com', '+254708345678', '33333333', 'Address 3, Nairobi', 'Emergency 3', '+254718345678', 1, '2023-03-10'),
('Maria', 'Njeri', 'maria.njeri4@email.com', '+254708456789', '44444444', 'Address 4, Nairobi', 'Emergency 4', '+254718456789', 1, '2023-04-05'),
('William', 'Kiplagat', 'william.kiplagat5@email.com', '+254708567890', '55555555', 'Address 5, Nairobi', 'Emergency 5', '+254718567890', 1, '2023-05-12'),
('Patricia', 'Akinyi', 'patricia.akinyi6@email.com', '+254708678901', '66666666', 'Address 6, Nairobi', 'Emergency 6', '+254718678901', 1, '2023-06-18'),
('Charles', 'Mwangi', 'charles.mwangi7@email.com', '+254708789012', '77777777', 'Address 7, Nairobi', 'Emergency 7', '+254718789012', 1, '2023-07-25');

-- Insert demo rent payments for the last 6 months
INSERT OR IGNORE INTO rent_payments (tenant_id, property_id, amount_due, amount_paid, payment_date, due_date, status, payment_method) VALUES 
-- Tenant 1 - Unit 001
(1, 1, 45000, 45000, '2024-08-01', '2024-08-01', 'Paid', 'M-Pesa'),
(1, 1, 45000, 45000, '2024-07-01', '2024-07-01', 'Paid', 'Bank Transfer'),
(1, 1, 45000, 45000, '2024-06-01', '2024-06-01', 'Paid', 'M-Pesa'),
(1, 1, 45000, 0, '2024-09-01', '2024-09-01', 'Outstanding', NULL),

-- Tenant 2 - Unit 002  
(2, 2, 65000, 65000, '2024-08-01', '2024-08-01', 'Paid', 'Bank Transfer'),
(2, 2, 65000, 65000, '2024-07-01', '2024-07-01', 'Paid', 'Cash'),
(2, 2, 65000, 65000, '2024-06-01', '2024-06-01', 'Paid', 'M-Pesa'),

-- Tenant 3 - Unit 004
(3, 4, 120000, 120000, '2024-08-01', '2024-08-01', 'Paid', 'Bank Transfer'),
(3, 4, 120000, 120000, '2024-07-01', '2024-07-01', 'Paid', 'Bank Transfer'),
(3, 4, 120000, 0, '2024-09-01', '2024-09-01', 'Outstanding', NULL),

-- Tenant 4 - Unit 005
(4, 5, 85000, 85000, '2024-08-01', '2024-08-01', 'Paid', 'M-Pesa'),
(4, 5, 85000, 85000, '2024-07-01', '2024-07-01', 'Paid', 'Bank Transfer'),

-- Tenant 5 - Unit 007
(5, 7, 55000, 55000, '2024-08-01', '2024-08-01', 'Paid', 'Cash'),
(5, 7, 55000, 40000, '2024-07-01', '2024-07-01', 'Partial', 'M-Pesa'),

-- Tenant 6 - Unit 009
(6, 9, 35000, 35000, '2024-08-01', '2024-08-01', 'Paid', 'Bank Transfer'),
(6, 9, 35000, 35000, '2024-07-01', '2024-07-01', 'Paid', 'M-Pesa');

-- Insert demo maintenance requests
INSERT OR IGNORE INTO maintenance_requests (property_id, tenant_id, title, description, priority, status, assigned_to, cost_estimate) VALUES 
(1, 1, 'Leaking Faucet', 'Kitchen sink faucet has been leaking for 2 days', 'Medium', 'Open', 'Maintenance Team A', 2500),
(4, 3, 'AC Unit Repair', 'Air conditioning unit not cooling properly', 'High', 'In Progress', 'HVAC Specialists', 15000),
(7, 5, 'Broken Window', 'Bedroom window lock is broken', 'Low', 'Completed', 'Maintenance Team B', 3000),
(2, 2, 'Electrical Issue', 'Power outlets in living room not working', 'High', 'Open', 'Electrical Team', 8000);

-- Database setup completed
SELECT 'SQLite Database setup completed successfully!' as message;
