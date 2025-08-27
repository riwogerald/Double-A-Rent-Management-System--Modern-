const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupSQLiteDatabase() {
  console.log('🚀 Setting up Double A Property Management System - SQLite Database...\n');

  try {
    // Create database directory if it doesn't exist
    const dbDir = path.join(__dirname, 'database');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log('📁 Created database directory');
    }

    // Initialize SQLite database
    const dbPath = path.join(dbDir, 'property_management.db');
    const db = new Database(dbPath);
    
    console.log('📡 Initializing SQLite database...');
    console.log(`📍 Database location: ${dbPath}`);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Read and execute the SQL setup file
    const sqlFilePath = path.join(__dirname, 'database_setup_sqlite.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('📊 Executing database setup script...');
    
    // Execute SQL commands (split by semicolon and execute individually)
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        db.exec(statement.trim());
      }
    }
    
    console.log('✅ Database setup completed successfully!\n');
    
    // Verify the setup
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    const propertyCount = db.prepare('SELECT COUNT(*) as count FROM properties').get();
    const tenantCount = db.prepare('SELECT COUNT(*) as count FROM tenants').get();
    const paymentCount = db.prepare('SELECT COUNT(*) as count FROM rent_payments').get();
    
    console.log('📋 SQLite Database Summary:');
    console.log(`   👤 Demo Users: ${userCount.count}`);
    console.log(`   🏠 Properties: ${propertyCount.count}`);
    console.log(`   👥 Tenants: ${tenantCount.count}`);
    console.log(`   💰 Payment Records: ${paymentCount.count}\n`);
    
    console.log('🎯 Demo Login Accounts (Password: Demo123!):');
    console.log('   📧 admin@property.com - System Administrator');
    console.log('   📧 manager@property.com - Property Manager');
    console.log('   📧 agent1@property.com - David Mwangi (Agent)');
    console.log('   📧 agent2@property.com - Sarah Akinyi (Agent)');
    console.log('   📧 test@example.com - Test User\n');
    
    console.log('🌟 Your portfolio system is ready!');
    console.log('   💻 Run "npm run dev" to start the application');
    console.log('   🌐 Frontend: http://localhost:5173');
    console.log('   🔗 Backend API: http://localhost:5000/api');
    
    db.close();
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('   1. Ensure you have write permissions in the project directory');
    console.log('   2. Check if the database_setup_sqlite.sql file exists');
    console.log('   3. Make sure better-sqlite3 is properly installed');
    process.exit(1);
  }
}

// Run the setup
setupSQLiteDatabase();
