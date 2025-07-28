const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'property_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('Please ensure MySQL is running and database exists');
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
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    
    // Generate token
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.insertId, email }
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
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
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
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const [totalProperties] = await pool.execute('SELECT COUNT(*) as count FROM properties');
    const [occupiedProperties] = await pool.execute('SELECT COUNT(*) as count FROM properties WHERE status = "Occupied"');
    const [totalTenants] = await pool.execute('SELECT COUNT(*) as count FROM tenants WHERE is_active = 1');
    
    // Monthly collection (current month)
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const [monthlyPayments] = await pool.execute(
      'SELECT COALESCE(SUM(amount_paid), 0) as total FROM rent_payments WHERE DATE_FORMAT(payment_date, "%Y-%m") = ?',
      [currentMonth]
    );
    
    const stats = {
      totalProperties: totalProperties[0].count,
      occupiedProperties: occupiedProperties[0].count,
      vacantProperties: totalProperties[0].count - occupiedProperties[0].count,
      totalTenants: totalTenants[0].count,
      monthlyCollection: monthlyPayments[0].total,
      occupancyRate: totalProperties[0].count > 0 
        ? Math.round((occupiedProperties[0].count / totalProperties[0].count) * 100) 
        : 0
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Import and use route modules
const agentsRoutes = require('./routes/agents')(pool);
const landlordsRoutes = require('./routes/landlords')(pool);
const propertiesRoutes = require('./routes/properties')(pool);
const tenantsRoutes = require('./routes/tenants')(pool);
const rentPaymentsRoutes = require('./routes/rentPayments')(pool);
const estatesRoutes = require('./routes/estates')(pool);
const reportsRoutes = require('./routes/reports');

// Use routes with authentication middleware
app.use('/api/agents', authenticateToken, agentsRoutes);
app.use('/api/landlords', authenticateToken, landlordsRoutes);
app.use('/api/properties', authenticateToken, propertiesRoutes);
app.use('/api/tenants', authenticateToken, tenantsRoutes);
app.use('/api/rent-payments', authenticateToken, rentPaymentsRoutes);
app.use('/api/estates', authenticateToken, estatesRoutes);
app.use('/api/reports', authenticateToken, reportsRoutes);

// Mock data for testing
const { generateMockData } = require('./mockData');

app.post('/api/generate-mock-data', async (req, res) => {
  try {
    await generateMockData(pool);
    res.status(201).json({ 
      message: 'Comprehensive mock data generated successfully',
      accounts: [
        'admin@property.com / Admin123!',
        'manager@property.com / Manager123!',
        'agent1@property.com / Agent123!',
        'agent2@property.com / Agent123!',
        'test@example.com / Test123!'
      ]
    });
  } catch (error) {
    console.error('Mock data generation error:', error);
    res.status(500).json({ error: 'Failed to generate mock data' });
  }
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
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:5173`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  await testConnection();
});