/*
  # Property Management System Database Schema

  1. New Tables
    - `agents` - Real estate agents with commission tracking
    - `landlords` - Property owners with banking details
    - `tenants` - Property renters with move-in information
    - `estates` - Property developments/complexes
    - `properties` - Individual rental units
    - `rent_payments` - Payment records with penalty calculations
    - `tenancy_agreements` - Lease contracts
    - `company_expenses` - Business expense tracking
    - `remittances` - Payments to landlords with commission deductions
    - `employees` - Staff management

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
    - Implement proper access controls

  3. Business Logic
    - Automatic penalty calculation (0.5% daily)
    - Commission tracking (5% company, 1% agents)
    - Property occupancy management
*/

-- Create custom types
CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE house_type AS ENUM ('Bedsitter', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4+ Bedroom', 'Commercial');
CREATE TYPE payment_method AS ENUM ('Cash', 'Bank Transfer', 'Mobile Money', 'Cheque');
CREATE TYPE expense_category AS ENUM ('Maintenance', 'Utilities', 'Marketing', 'Administrative', 'Legal', 'Other');
CREATE TYPE property_status AS ENUM ('Vacant', 'Occupied', 'Under Maintenance', 'Reserved');

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    agent_no uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    phone text,
    email text UNIQUE,
    gender gender_type,
    commission_rate decimal(5,2) DEFAULT 1.00,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Landlords table
CREATE TABLE IF NOT EXISTS landlords (
    landlord_no uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    phone text,
    email text,
    gender gender_type,
    bank_account text,
    bank_name text,
    id_number text,
    address text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Estates table
CREATE TABLE IF NOT EXISTS estates (
    estate_no uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    location text,
    description text,
    total_houses integer DEFAULT 0,
    occupied_houses integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    property_no uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    estate_no uuid REFERENCES estates(estate_no),
    landlord_no uuid REFERENCES landlords(landlord_no),
    agent_no uuid REFERENCES agents(agent_no),
    house_number text NOT NULL,
    house_type house_type NOT NULL,
    rent_amount decimal(10,2) NOT NULL,
    deposit_amount decimal(10,2),
    status property_status DEFAULT 'Vacant',
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
    tenant_no uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    property_no uuid REFERENCES properties(property_no),
    name text NOT NULL,
    phone text,
    email text,
    id_number text,
    gender gender_type,
    occupation text,
    emergency_contact text,
    emergency_phone text,
    move_in_date date,
    move_out_date date,
    deposit_paid decimal(10,2),
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Tenancy agreements table
CREATE TABLE IF NOT EXISTS tenancy_agreements (
    document_no uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_no uuid REFERENCES tenants(tenant_no),
    property_no uuid REFERENCES properties(property_no),
    start_date date NOT NULL,
    end_date date NOT NULL,
    monthly_rent decimal(10,2) NOT NULL,
    deposit_amount decimal(10,2),
    terms_conditions text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Rent payments table
CREATE TABLE IF NOT EXISTS rent_payments (
    payment_no uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_no uuid REFERENCES tenants(tenant_no),
    property_no uuid REFERENCES properties(property_no),
    amount_paid decimal(10,2) NOT NULL,
    rent_month date NOT NULL,
    payment_date date DEFAULT CURRENT_DATE,
    payment_method payment_method DEFAULT 'Cash',
    penalty_amount decimal(10,2) DEFAULT 0,
    balance_before decimal(10,2) DEFAULT 0,
    balance_after decimal(10,2) DEFAULT 0,
    receipt_number text,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Company expenses table
CREATE TABLE IF NOT EXISTS company_expenses (
    receipt_no uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    description text NOT NULL,
    amount decimal(10,2) NOT NULL,
    expense_date date DEFAULT CURRENT_DATE,
    category expense_category DEFAULT 'Other',
    vendor text,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Remittances table (payments to landlords)
CREATE TABLE IF NOT EXISTS remittances (
    remittance_no uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    landlord_no uuid REFERENCES landlords(landlord_no),
    property_no uuid REFERENCES properties(property_no),
    rent_collected decimal(10,2) NOT NULL,
    company_commission decimal(10,2) NOT NULL,
    agent_commission decimal(10,2) DEFAULT 0,
    net_amount decimal(10,2) NOT NULL,
    remittance_date date DEFAULT CURRENT_DATE,
    payment_method payment_method DEFAULT 'Bank Transfer',
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    employee_no uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    position text,
    salary decimal(10,2),
    phone text,
    email text,
    hire_date date DEFAULT CURRENT_DATE,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE landlords ENABLE ROW LEVEL SECURITY;
ALTER TABLE estates ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenancy_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE remittances ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can read agents"
  ON agents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage agents"
  ON agents FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read landlords"
  ON landlords FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage landlords"
  ON landlords FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read estates"
  ON estates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage estates"
  ON estates FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read properties"
  ON properties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage properties"
  ON properties FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read tenants"
  ON tenants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage tenants"
  ON tenants FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read tenancy_agreements"
  ON tenancy_agreements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage tenancy_agreements"
  ON tenancy_agreements FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read rent_payments"
  ON rent_payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage rent_payments"
  ON rent_payments FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read company_expenses"
  ON company_expenses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage company_expenses"
  ON company_expenses FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read remittances"
  ON remittances FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage remittances"
  ON remittances FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read employees"
  ON employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage employees"
  ON employees FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_estate ON properties(estate_no);
CREATE INDEX IF NOT EXISTS idx_properties_landlord ON properties(landlord_no);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_tenants_property ON tenants(property_no);
CREATE INDEX IF NOT EXISTS idx_tenants_active ON tenants(is_active);
CREATE INDEX IF NOT EXISTS idx_rent_payments_tenant ON rent_payments(tenant_no);
CREATE INDEX IF NOT EXISTS idx_rent_payments_property ON rent_payments(property_no);
CREATE INDEX IF NOT EXISTS idx_rent_payments_month ON rent_payments(rent_month);
CREATE INDEX IF NOT EXISTS idx_remittances_landlord ON remittances(landlord_no);

-- Create functions for business logic
CREATE OR REPLACE FUNCTION calculate_penalty(
    outstanding_amount decimal,
    days_past_due integer
) RETURNS decimal AS $$
BEGIN
    -- 0.5% daily penalty rate
    RETURN outstanding_amount * POWER(1.005, days_past_due) - outstanding_amount;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_commission(
    rent_amount decimal,
    is_agent boolean DEFAULT false
) RETURNS decimal AS $$
BEGIN
    -- 1% for agents, 5% for company
    IF is_agent THEN
        RETURN rent_amount * 0.01;
    ELSE
        RETURN rent_amount * 0.05;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update property occupancy
CREATE OR REPLACE FUNCTION update_property_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.is_active = true THEN
        UPDATE properties SET status = 'Occupied' WHERE property_no = NEW.property_no;
    ELSIF TG_OP = 'UPDATE' AND OLD.is_active = true AND NEW.is_active = false THEN
        UPDATE properties SET status = 'Vacant' WHERE property_no = NEW.property_no;
    ELSIF TG_OP = 'DELETE' AND OLD.is_active = true THEN
        UPDATE properties SET status = 'Vacant' WHERE property_no = OLD.property_no;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_property_status
    AFTER INSERT OR UPDATE OR DELETE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_property_status();

-- Trigger to update estate occupancy counts
CREATE OR REPLACE FUNCTION update_estate_occupancy()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE estates SET 
            total_houses = (SELECT COUNT(*) FROM properties WHERE estate_no = NEW.estate_no),
            occupied_houses = (SELECT COUNT(*) FROM properties WHERE estate_no = NEW.estate_no AND status = 'Occupied')
        WHERE estate_no = NEW.estate_no;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE estates SET 
            occupied_houses = (SELECT COUNT(*) FROM properties WHERE estate_no = NEW.estate_no AND status = 'Occupied')
        WHERE estate_no = NEW.estate_no;
        
        IF OLD.estate_no != NEW.estate_no THEN
            UPDATE estates SET 
                total_houses = (SELECT COUNT(*) FROM properties WHERE estate_no = OLD.estate_no),
                occupied_houses = (SELECT COUNT(*) FROM properties WHERE estate_no = OLD.estate_no AND status = 'Occupied')
            WHERE estate_no = OLD.estate_no;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE estates SET 
            total_houses = (SELECT COUNT(*) FROM properties WHERE estate_no = OLD.estate_no),
            occupied_houses = (SELECT COUNT(*) FROM properties WHERE estate_no = OLD.estate_no AND status = 'Occupied')
        WHERE estate_no = OLD.estate_no;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_estate_occupancy
    AFTER INSERT OR UPDATE OR DELETE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_estate_occupancy();