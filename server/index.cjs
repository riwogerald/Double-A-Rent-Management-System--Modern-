const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbPath = path.join(__dirname, '..', 'database', 'property_management.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Test database connection
function testConnection() {
  try {
    const result = db.prepare('SELECT 1').get();
    console.log('✅ Connected to SQLite database');
    console.log(`📍 Database location: ${dbPath}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const result = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);
    
    // Generate token
    const token = jwt.sign(
      { id: result.lastInsertRowid, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.lastInsertRowid, email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  try {
    const totalProperties = db.prepare('SELECT COUNT(*) as count FROM properties').get();
    const occupiedProperties = db.prepare('SELECT COUNT(*) as count FROM properties WHERE status = "Occupied"').get();
    const totalTenants = db.prepare('SELECT COUNT(*) as count FROM tenants WHERE is_active = 1').get();
    
    // Monthly collection (current month)
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const monthlyPayments = db.prepare(
      'SELECT COALESCE(SUM(amount_paid), 0) as total FROM rent_payments WHERE strftime("%Y-%m", payment_date) = ?'
    ).get(currentMonth);
    
    const stats = {
      totalProperties: totalProperties.count,
      occupiedProperties: occupiedProperties.count,
      vacantProperties: totalProperties.count - occupiedProperties.count,
      totalTenants: totalTenants.count,
      monthlyCollection: monthlyPayments.total,
      occupancyRate: totalProperties.count > 0 
        ? Math.round((occupiedProperties.count / totalProperties.count) * 100) 
        : 0
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Properties routes
app.get('/api/properties', authenticateToken, (req, res) => {
  try {
    const properties = db.prepare(`
      SELECT p.*, e.name as estate_name, e.location as estate_location,
             l.first_name as landlord_first_name, l.last_name as landlord_last_name,
             a.first_name as agent_first_name, a.last_name as agent_last_name
      FROM properties p
      LEFT JOIN estates e ON p.estate_id = e.id
      LEFT JOIN landlords l ON p.landlord_id = l.id  
      LEFT JOIN agents a ON p.agent_id = a.id
      ORDER BY p.created_at DESC
    `).all();
    res.json(properties);
  } catch (error) {
    console.error('Properties fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Tenants routes
app.get('/api/tenants', authenticateToken, (req, res) => {
  try {
    const tenants = db.prepare('SELECT * FROM tenants ORDER BY created_at DESC').all();
    res.json(tenants);
  } catch (error) {
    console.error('Tenants fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Agents routes
app.get('/api/agents', authenticateToken, (req, res) => {
  try {
    const agents = db.prepare('SELECT * FROM agents ORDER BY created_at DESC').all();
    res.json(agents);
  } catch (error) {
    console.error('Agents fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Landlords routes  
app.get('/api/landlords', authenticateToken, (req, res) => {
  try {
    const landlords = db.prepare('SELECT * FROM landlords ORDER BY created_at DESC').all();
    res.json(landlords);
  } catch (error) {
    console.error('Landlords fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rent payments routes
app.get('/api/rent-payments', authenticateToken, (req, res) => {
  try {
    const payments = db.prepare(`
      SELECT rp.*, t.first_name as tenant_first_name, t.last_name as tenant_last_name,
             p.unit_number, e.name as estate_name
      FROM rent_payments rp
      LEFT JOIN tenants t ON rp.tenant_id = t.id
      LEFT JOIN properties p ON rp.property_id = p.id
      LEFT JOIN estates e ON p.estate_id = e.id
      ORDER BY rp.due_date DESC
    `).all();
    res.json(payments);
  } catch (error) {
    console.error('Rent payments fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock data for testing endpoint (data is already loaded via setup script)
app.post('/api/generate-mock-data', (req, res) => {
  res.status(200).json({ 
    message: 'Mock data already loaded via database setup',
    accounts: [
      'admin@property.com / Demo123!',
      'manager@property.com / Demo123!',
      'agent1@property.com / Demo123!',
      'agent2@property.com / Demo123!',
      'test@example.com / Demo123!'
    ]
  });
});

// Business logic functions
const calculatePenalty = (outstandingAmount, daysPastDue) => {
  const dailyRate = 0.005; // 0.5%
  return outstandingAmount * Math.pow(1 + dailyRate, daysPastDue) - outstandingAmount;
};

const calculateCommission = (rentAmount, isAgent = false) => {
  const rate = isAgent ? 0.01 : 0.05; // 1% for agents, 5% for company
  return rentAmount * rate;
};

// Utility endpoints
app.get('/api/utils/calculate-penalty', authenticateToken, (req, res) => {
  const { amount, days } = req.query;
  const penalty = calculatePenalty(parseFloat(amount), parseInt(days));
  res.json({ penalty });
});

app.get('/api/utils/calculate-commission', authenticateToken, (req, res) => {
  const { amount, isAgent } = req.query;
  const commission = calculateCommission(parseFloat(amount), isAgent === 'true');
  res.json({ commission });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:5173`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  testConnection();
});
