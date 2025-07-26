const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'property_management'
};

// Rent Collection Report
router.get('/rent-collection', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const connection = await mysql.createConnection(dbConfig);

    const query = `
      SELECT 
        t.first_name as tenant_first_name,
        t.last_name as tenant_last_name,
        p.address as property_address,
        p.rent_amount,
        rp.amount_paid,
        rp.payment_date,
        rp.due_date
      FROM tenants t
      LEFT JOIN properties p ON t.property_id = p.id
      LEFT JOIN rent_payments rp ON t.id = rp.tenant_id
      WHERE rp.due_date BETWEEN ? AND ?
      ORDER BY rp.due_date DESC
    `;

    const [rows] = await connection.execute(query, [startDate, endDate]);
    
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching rent collection data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Agent Earnings Report
router.get('/agent-earnings', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const connection = await mysql.createConnection(dbConfig);

    const query = `
      SELECT 
        a.first_name as agent_first_name,
        a.last_name as agent_last_name,
        COUNT(DISTINCT p.id) as property_count,
        SUM(rp.amount_paid) as total_rent_collected,
        a.commission_rate,
        SUM(rp.amount_paid * a.commission_rate / 100) as commission_earned
      FROM agents a
      LEFT JOIN properties p ON a.id = p.agent_id
      LEFT JOIN tenants t ON p.id = t.property_id
      LEFT JOIN rent_payments rp ON t.id = rp.tenant_id
      WHERE rp.payment_date BETWEEN ? AND ?
      GROUP BY a.id, a.first_name, a.last_name, a.commission_rate
      ORDER BY commission_earned DESC
    `;

    const [rows] = await connection.execute(query, [startDate, endDate]);
    
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching agent earnings data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Defaulters Report
router.get('/defaulters', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const query = `
      SELECT 
        t.first_name as tenant_first_name,
        t.last_name as tenant_last_name,
        p.address as property_address,
        p.rent_amount,
        MAX(rp.payment_date) as last_payment_date,
        (p.rent_amount - COALESCE(SUM(rp.amount_paid), 0)) as outstanding_amount,
        DATEDIFF(CURDATE(), MAX(rp.due_date)) as days_overdue,
        MAX(rp.due_date) as due_date
      FROM tenants t
      JOIN properties p ON t.property_id = p.id
      LEFT JOIN rent_payments rp ON t.id = rp.tenant_id
      GROUP BY t.id, t.first_name, t.last_name, p.address, p.rent_amount
      HAVING outstanding_amount > 0 OR last_payment_date IS NULL
      ORDER BY outstanding_amount DESC
    `;

    const [rows] = await connection.execute(query);
    
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching defaulters data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Financial Summary
router.get('/financial-summary', async (req, res) => {
  try {
    const { month } = req.query;
    const connection = await mysql.createConnection(dbConfig);

    // Get total revenue for the month
    const revenueQuery = `
      SELECT 
        SUM(amount_paid) as total_revenue,
        COUNT(*) as total_payments
      FROM rent_payments
      WHERE DATE_FORMAT(payment_date, '%Y-%m') = ?
    `;

    const [revenueRows] = await connection.execute(revenueQuery, [month]);

    // Get expected revenue for the month
    const expectedQuery = `
      SELECT 
        SUM(p.rent_amount) as total_expected
      FROM properties p
      JOIN tenants t ON p.id = t.property_id
      WHERE t.lease_start <= LAST_DAY(STR_TO_DATE(?, '%Y-%m'))
        AND (t.lease_end IS NULL OR t.lease_end >= STR_TO_DATE(?, '%Y-%m-01'))
    `;

    const [expectedRows] = await connection.execute(expectedQuery, [month, month]);

    // Get outstanding amounts
    const outstandingQuery = `
      SELECT 
        SUM(p.rent_amount - COALESCE(rp.amount_paid, 0)) as outstanding_amount
      FROM properties p
      JOIN tenants t ON p.id = t.property_id
      LEFT JOIN rent_payments rp ON t.id = rp.tenant_id
        AND DATE_FORMAT(rp.due_date, '%Y-%m') = ?
      WHERE t.lease_start <= LAST_DAY(STR_TO_DATE(?, '%Y-%m'))
        AND (t.lease_end IS NULL OR t.lease_end >= STR_TO_DATE(?, '%Y-%m-01'))
    `;

    const [outstandingRows] = await connection.execute(outstandingQuery, [month, month, month]);

    // Get property occupancy
    const occupancyQuery = `
      SELECT 
        COUNT(*) as total_properties,
        SUM(CASE WHEN t.id IS NOT NULL THEN 1 ELSE 0 END) as occupied_properties
      FROM properties p
      LEFT JOIN tenants t ON p.id = t.property_id
        AND t.lease_start <= LAST_DAY(STR_TO_DATE(?, '%Y-%m'))
        AND (t.lease_end IS NULL OR t.lease_end >= STR_TO_DATE(?, '%Y-%m-01'))
    `;

    const [occupancyRows] = await connection.execute(occupancyQuery, [month, month]);

    const revenue = revenueRows[0]?.total_revenue || 0;
    const expected = expectedRows[0]?.total_expected || 0;
    const outstanding = Math.max(0, outstandingRows[0]?.outstanding_amount || 0);
    const totalProperties = occupancyRows[0]?.total_properties || 0;
    const occupiedProperties = occupancyRows[0]?.occupied_properties || 0;
    const vacantProperties = totalProperties - occupiedProperties;
    const collectionRate = expected > 0 ? (revenue / expected) * 100 : 0;
    const occupancyRate = totalProperties > 0 ? (occupiedProperties / totalProperties) * 100 : 0;

    await connection.end();

    res.json({
      total_revenue: revenue,
      total_expected: expected,
      collection_rate: collectionRate,
      outstanding_amount: outstanding,
      total_properties: totalProperties,
      occupied_properties: occupiedProperties,
      vacant_properties: vacantProperties,
      occupancy_rate: occupancyRate
    });
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Revenue Breakdown
router.get('/revenue-breakdown', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const query = `
      SELECT 
        'Rent' as category,
        SUM(amount_paid) as amount
      FROM rent_payments
      WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
      
      UNION ALL
      
      SELECT 
        'Late Fees' as category,
        SUM(late_fee) as amount
      FROM rent_payments
      WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
        AND late_fee > 0
      
      UNION ALL
      
      SELECT 
        'Other Income' as category,
        0 as amount
    `;

    const [rows] = await connection.execute(query);
    
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching revenue breakdown:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
