import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function setupPortfolioDatabase() {
  console.log('🚀 Setting up Double A Property Management System - Portfolio Database...\n');

  // First, connect without database to create it
  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  };

  try {
    console.log('📡 Connecting to MySQL server...');
    const connection = await mysql.createConnection(connectionConfig);
    
    console.log('✅ Connected to MySQL server');
    
    // Read and execute the SQL setup file
    const sqlFilePath = path.join(__dirname, 'database_setup_portfolio.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('📊 Executing database setup script...');
    await connection.query(sqlContent);
    
    console.log('✅ Database setup completed successfully!\n');
    
    // Verify the setup
    await connection.query('USE property_management_portfolio');
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [propertyCount] = await connection.query('SELECT COUNT(*) as count FROM properties');
    const [tenantCount] = await connection.query('SELECT COUNT(*) as count FROM tenants');
    const [paymentCount] = await connection.query('SELECT COUNT(*) as count FROM rent_payments');
    
    console.log('📋 Portfolio Database Summary:');
    console.log(`   👤 Demo Users: ${userCount[0].count}`);
    console.log(`   🏠 Properties: ${propertyCount[0].count}`);
    console.log(`   👥 Tenants: ${tenantCount[0].count}`);
    console.log(`   💰 Payment Records: ${paymentCount[0].count}\n`);
    
    console.log('🎯 Demo Login Accounts (Password: Demo123!):');
    console.log('   📧 admin@property.com - System Administrator');
    console.log('   📧 manager@property.com - Property Manager');
    console.log('   📧 agent1@property.com - Sarah Johnson (Agent)');
    console.log('   📧 agent2@property.com - Michael Chen (Agent)');
    console.log('   📧 test@example.com - Test User\n');
    
    console.log('🌟 Your portfolio system is ready!');
    console.log('   💻 Run "npm run dev" to start the application');
    console.log('   🌐 Frontend: http://localhost:5173');
    console.log('   🔗 Backend API: http://localhost:5000/api');
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('   1. Ensure MySQL server is running');
    console.log('   2. Check your .env file database credentials');
    console.log('   3. Make sure you have MySQL installed');
    console.log('   4. Try running MySQL as administrator/root');
    process.exit(1);
  }
}

// Run the setup
setupPortfolioDatabase();
