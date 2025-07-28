const bcrypt = require('bcryptjs');

// Mock data generator for comprehensive testing
const generateMockData = async (pool) => {
  console.log('🚀 Generating mock data...');

  try {
    // Mock Users
    const mockUsers = [
      { email: 'admin@property.com', password: 'Admin123!' },
      { email: 'manager@property.com', password: 'Manager123!' },
      { email: 'agent1@property.com', password: 'Agent123!' },
      { email: 'agent2@property.com', password: 'Agent123!' },
      { email: 'test@example.com', password: 'Test123!' }
    ];

    for (const user of mockUsers) {
      const [existing] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [user.email]
      );

      if (existing.length === 0) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await pool.execute(
          'INSERT INTO users (email, password) VALUES (?, ?)',
          [user.email, hashedPassword]
        );
      }
    }

    // Mock Estates
    const mockEstates = [
      { name: 'Sunrise Heights', location: 'Westlands, Nairobi', description: 'Modern residential complex with premium amenities' },
      { name: 'Garden View Apartments', location: 'Karen, Nairobi', description: 'Luxury apartments with garden views' },
      { name: 'City Central Plaza', location: 'CBD, Nairobi', description: 'Commercial and residential mixed development' },
      { name: 'Lakeside Villas', location: 'Runda, Nairobi', description: 'Executive villas with lake access' },
      { name: 'Pine Grove Estate', location: 'Kileleshwa, Nairobi', description: 'Family-friendly residential estate' }
    ];

    for (const estate of mockEstates) {
      const [existing] = await pool.execute(
        'SELECT id FROM estates WHERE name = ?',
        [estate.name]
      );

      if (existing.length === 0) {
        await pool.execute(
          'INSERT INTO estates (name, location, description) VALUES (?, ?, ?)',
          [estate.name, estate.location, estate.description]
        );
      }
    }

    // Mock Landlords
    const mockLandlords = [
      { 
        first_name: 'John', last_name: 'Kamau', email: 'john.kamau@email.com', 
        phone: '+254701234567', id_number: '12345678', address: 'Westlands, Nairobi',
        commission_rate: 5.0
      },
      { 
        first_name: 'Mary', last_name: 'Wanjiku', email: 'mary.wanjiku@email.com', 
        phone: '+254702345678', id_number: '23456789', address: 'Karen, Nairobi',
        commission_rate: 4.5
      },
      { 
        first_name: 'Peter', last_name: 'Ochieng', email: 'peter.ochieng@email.com', 
        phone: '+254703456789', id_number: '34567890', address: 'CBD, Nairobi',
        commission_rate: 5.5
      },
      { 
        first_name: 'Grace', last_name: 'Njeri', email: 'grace.njeri@email.com', 
        phone: '+254704567890', id_number: '45678901', address: 'Runda, Nairobi',
        commission_rate: 4.0
      }
    ];

    for (const landlord of mockLandlords) {
      const [existing] = await pool.execute(
        'SELECT id FROM landlords WHERE email = ?',
        [landlord.email]
      );

      if (existing.length === 0) {
        await pool.execute(
          `INSERT INTO landlords (first_name, last_name, email, phone, id_number, address, commission_rate) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [landlord.first_name, landlord.last_name, landlord.email, landlord.phone, 
           landlord.id_number, landlord.address, landlord.commission_rate]
        );
      }
    }

    // Mock Agents
    const mockAgents = [
      { 
        first_name: 'David', last_name: 'Mwangi', email: 'david.mwangi@property.com', 
        phone: '+254705678901', id_number: '56789012', address: 'Kilimani, Nairobi',
        commission_rate: 2.0, hire_date: '2023-01-15'
      },
      { 
        first_name: 'Sarah', last_name: 'Akinyi', email: 'sarah.akinyi@property.com', 
        phone: '+254706789012', id_number: '67890123', address: 'Lavington, Nairobi',
        commission_rate: 2.5, hire_date: '2023-03-20'
      },
      { 
        first_name: 'Michael', last_name: 'Kiprop', email: 'michael.kiprop@property.com', 
        phone: '+254707890123', id_number: '78901234', address: 'Parklands, Nairobi',
        commission_rate: 1.8, hire_date: '2023-06-10'
      }
    ];

    for (const agent of mockAgents) {
      const [existing] = await pool.execute(
        'SELECT id FROM agents WHERE email = ?',
        [agent.email]
      );

      if (existing.length === 0) {
        await pool.execute(
          `INSERT INTO agents (first_name, last_name, email, phone, id_number, address, commission_rate, hire_date) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [agent.first_name, agent.last_name, agent.email, agent.phone, 
           agent.id_number, agent.address, agent.commission_rate, agent.hire_date]
        );
      }
    }

    // Get inserted IDs for relationships
    const [estates] = await pool.execute('SELECT id, name FROM estates');
    const [landlords] = await pool.execute('SELECT id, first_name, last_name FROM landlords');
    const [agents] = await pool.execute('SELECT id, first_name, last_name FROM agents');

    // Mock Properties
    const propertyTypes = ['Apartment', 'Villa', 'Townhouse', 'Studio', 'Penthouse'];
    const statuses = ['Available', 'Occupied', 'Under Maintenance'];
    
    for (let i = 1; i <= 20; i++) {
      const estate = estates[Math.floor(Math.random() * estates.length)];
      const landlord = landlords[Math.floor(Math.random() * landlords.length)];
      const agent = i % 3 === 0 ? agents[Math.floor(Math.random() * agents.length)] : null;
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const rent = Math.floor(Math.random() * 80000) + 20000; // 20k to 100k
      const bedrooms = Math.floor(Math.random() * 4) + 1;
      const bathrooms = Math.floor(Math.random() * 3) + 1;

      const [existing] = await pool.execute(
        'SELECT id FROM properties WHERE unit_number = ? AND estate_id = ?',
        [`Unit-${String(i).padStart(3, '0')}`, estate.id]
      );

      if (existing.length === 0) {
        await pool.execute(
          `INSERT INTO properties (unit_number, property_type, bedrooms, bathrooms, rent_amount, 
           status, estate_id, landlord_id, agent_id, description) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            `Unit-${String(i).padStart(3, '0')}`, propertyType, bedrooms, bathrooms, rent,
            status, estate.id, landlord.id, agent?.id, 
            `${bedrooms} bedroom ${propertyType.toLowerCase()} in ${estate.name}`
          ]
        );
      }
    }

    // Mock Tenants
    const firstNames = ['James', 'Jane', 'Robert', 'Maria', 'William', 'Patricia', 'Charles', 'Jennifer'];
    const lastNames = ['Mutua', 'Wanjiku', 'Ochieng', 'Njeri', 'Kiplagat', 'Akinyi', 'Mwangi', 'Chebet'];

    for (let i = 1; i <= 15; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`;

      const [existing] = await pool.execute(
        'SELECT id FROM tenants WHERE email = ?',
        [email]
      );

      if (existing.length === 0) {
        await pool.execute(
          `INSERT INTO tenants (first_name, last_name, email, phone, id_number, 
           address, emergency_contact, emergency_phone, is_active, move_in_date) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            firstName, lastName, email, `+25470${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
            `${Math.floor(Math.random() * 90000000) + 10000000}`, `Address ${i}, Nairobi`,
            `Emergency ${i}`, `+25471${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
            Math.random() > 0.2 ? 1 : 0, // 80% active tenants
            new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
          ]
        );
      }
    }

    // Mock Rent Payments
    const [properties] = await pool.execute('SELECT id, rent_amount FROM properties WHERE status = "Occupied"');
    const [tenants] = await pool.execute('SELECT id FROM tenants WHERE is_active = 1');

    if (properties.length > 0 && tenants.length > 0) {
      for (let i = 0; i < Math.min(properties.length, tenants.length); i++) {
        const property = properties[i];
        const tenant = tenants[i];
        
        // Create payments for last 6 months
        for (let month = 0; month < 6; month++) {
          const paymentDate = new Date();
          paymentDate.setMonth(paymentDate.getMonth() - month);
          
          const isPaid = Math.random() > 0.15; // 85% payment rate
          const amountPaid = isPaid ? property.rent_amount : 0;
          const status = isPaid ? 'Paid' : 'Outstanding';

          await pool.execute(
            `INSERT INTO rent_payments (tenant_id, property_id, amount_due, amount_paid, 
             payment_date, due_date, status, payment_method) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              tenant.id, property.id, property.rent_amount, amountPaid,
              isPaid ? paymentDate : null, paymentDate, status,
              isPaid ? ['Bank Transfer', 'Cash', 'M-Pesa'][Math.floor(Math.random() * 3)] : null
            ]
          );
        }
      }
    }

    console.log('✅ Mock data generated successfully!');
    console.log('📧 Test accounts created:');
    mockUsers.forEach(user => {
      console.log(`   ${user.email} / ${user.password}`);
    });

  } catch (error) {
    console.error('❌ Error generating mock data:', error);
    throw error;
  }
};

module.exports = { generateMockData };
