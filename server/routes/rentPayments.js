const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Get all rent payments
  router.get('/', async (req, res) => {
    try {
      const [payments] = await pool.execute(`
        SELECT rp.*, 
               t.name as tenant_name,
               p.house_number,
               e.name as estate_name,
               CONCAT(e.name, ' - ', p.house_number) as property_details
        FROM rent_payments rp
        LEFT JOIN tenants t ON rp.tenant_id = t.id
        LEFT JOIN properties p ON rp.property_id = p.id
        LEFT JOIN estates e ON p.estate_id = e.id
        ORDER BY rp.payment_date DESC
      `);
      res.json(payments);
    } catch (error) {
      console.error('Rent payments fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get payments by tenant
  router.get('/tenant/:tenantId', async (req, res) => {
    try {
      const [payments] = await pool.execute(`
        SELECT rp.*, 
               p.house_number,
               e.name as estate_name
        FROM rent_payments rp
        LEFT JOIN properties p ON rp.property_id = p.id
        LEFT JOIN estates e ON p.estate_id = e.id
        WHERE rp.tenant_id = ?
        ORDER BY rp.payment_date DESC
      `, [req.params.tenantId]);
      
      res.json(payments);
    } catch (error) {
      console.error('Tenant payments fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get defaulters (tenants with outstanding balances)
  router.get('/defaulters', async (req, res) => {
    try {
      const [defaulters] = await pool.execute(`
        SELECT DISTINCT t.id, t.name, t.phone,
               p.house_number, e.name as estate_name,
               p.rent_amount,
               COALESCE(SUM(rp.balance_after), p.rent_amount) as outstanding_balance,
               MAX(rp.payment_date) as last_payment_date,
               DATEDIFF(CURDATE(), COALESCE(MAX(rp.payment_date), t.move_in_date)) as days_overdue
        FROM tenants t
        JOIN properties p ON t.property_id = p.id
        LEFT JOIN estates e ON p.estate_id = e.id
        LEFT JOIN rent_payments rp ON t.id = rp.tenant_id
        WHERE t.is_active = 1
        GROUP BY t.id
        HAVING outstanding_balance > 0 OR days_overdue > 30
        ORDER BY outstanding_balance DESC
      `);
      
      res.json(defaulters);
    } catch (error) {
      console.error('Defaulters fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create new rent payment
  router.post('/', async (req, res) => {
    try {
      const { 
        tenant_id, property_id, amount_paid, rent_month, 
        payment_method, penalty_amount, balance_before, 
        receipt_number, notes 
      } = req.body;
      
      const balance_after = balance_before - amount_paid;
      
      const [result] = await pool.execute(
        `INSERT INTO rent_payments (tenant_id, property_id, amount_paid, rent_month, payment_method, penalty_amount, balance_before, balance_after, receipt_number, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [tenant_id, property_id, amount_paid, rent_month, payment_method, penalty_amount || 0, balance_before || 0, balance_after, receipt_number, notes]
      );
      
      res.status(201).json({ 
        message: 'Payment recorded successfully', 
        id: result.insertId 
      });
    } catch (error) {
      console.error('Payment creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update rent payment
  router.put('/:id', async (req, res) => {
    try {
      const { 
        tenant_id, property_id, amount_paid, rent_month, 
        payment_method, penalty_amount, balance_before, 
        receipt_number, notes 
      } = req.body;
      
      const balance_after = balance_before - amount_paid;
      
      const [result] = await pool.execute(
        `UPDATE rent_payments 
         SET tenant_id = ?, property_id = ?, amount_paid = ?, rent_month = ?, 
             payment_method = ?, penalty_amount = ?, balance_before = ?, 
             balance_after = ?, receipt_number = ?, notes = ?
         WHERE id = ?`,
        [tenant_id, property_id, amount_paid, rent_month, payment_method, penalty_amount, balance_before, balance_after, receipt_number, notes, req.params.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      
      res.json({ message: 'Payment updated successfully' });
    } catch (error) {
      console.error('Payment update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete rent payment
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.execute(
        'DELETE FROM rent_payments WHERE id = ?',
        [req.params.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      
      res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
      console.error('Payment deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};