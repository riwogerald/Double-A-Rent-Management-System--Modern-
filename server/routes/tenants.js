const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Get all tenants
  router.get('/', async (req, res) => {
    try {
      const [tenants] = await pool.execute(`
        SELECT t.*, 
               p.house_number, 
               p.house_type,
               p.rent_amount,
               e.name as estate_name,
               CONCAT(e.name, ' - ', p.house_number) as property_details
        FROM tenants t 
        LEFT JOIN properties p ON t.property_id = p.id 
        LEFT JOIN estates e ON p.estate_id = e.id
        ORDER BY t.created_at DESC
      `);
      res.json(tenants);
    } catch (error) {
      console.error('Tenants fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get active tenants
  router.get('/active', async (req, res) => {
    try {
      const [tenants] = await pool.execute(`
        SELECT t.*, 
               p.house_number, 
               p.house_type,
               p.rent_amount,
               e.name as estate_name
        FROM tenants t 
        LEFT JOIN properties p ON t.property_id = p.id 
        LEFT JOIN estates e ON p.estate_id = e.id
        WHERE t.is_active = 1
        ORDER BY t.created_at DESC
      `);
      res.json(tenants);
    } catch (error) {
      console.error('Active tenants fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get tenant by ID
  router.get('/:id', async (req, res) => {
    try {
      const [tenants] = await pool.execute(`
        SELECT t.*, 
               p.house_number, 
               p.house_type,
               p.rent_amount,
               e.name as estate_name
        FROM tenants t 
        LEFT JOIN properties p ON t.property_id = p.id 
        LEFT JOIN estates e ON p.estate_id = e.id
        WHERE t.id = ?
      `, [req.params.id]);
      
      if (tenants.length === 0) {
        return res.status(404).json({ error: 'Tenant not found' });
      }
      
      // Get tenant's payment history
      const [payments] = await pool.execute(
        'SELECT * FROM rent_payments WHERE tenant_id = ? ORDER BY payment_date DESC',
        [req.params.id]
      );
      
      res.json({ ...tenants[0], payments });
    } catch (error) {
      console.error('Tenant fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create new tenant
  router.post('/', async (req, res) => {
    try {
      const { 
        property_id, name, phone, email, id_number, gender, 
        occupation, emergency_contact, emergency_phone, 
        move_in_date, deposit_paid 
      } = req.body;
      
      // Check if property is available
      const [property] = await pool.execute(
        'SELECT status FROM properties WHERE id = ?',
        [property_id]
      );
      
      if (property.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      if (property[0].status !== 'Vacant') {
        return res.status(400).json({ error: 'Property is not available' });
      }
      
      const [result] = await pool.execute(
        `INSERT INTO tenants (property_id, name, phone, email, id_number, gender, occupation, emergency_contact, emergency_phone, move_in_date, deposit_paid) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [property_id, name, phone, email, id_number, gender, occupation, emergency_contact, emergency_phone, move_in_date, deposit_paid]
      );
      
      // Update property status to occupied
      await pool.execute(
        'UPDATE properties SET status = "Occupied" WHERE id = ?',
        [property_id]
      );
      
      res.status(201).json({ 
        message: 'Tenant created successfully', 
        id: result.insertId 
      });
    } catch (error) {
      console.error('Tenant creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update tenant
  router.put('/:id', async (req, res) => {
    try {
      const { 
        property_id, name, phone, email, id_number, gender, 
        occupation, emergency_contact, emergency_phone, 
        move_in_date, move_out_date, deposit_paid, is_active 
      } = req.body;
      
      // Get current tenant data
      const [currentTenant] = await pool.execute(
        'SELECT property_id, is_active FROM tenants WHERE id = ?',
        [req.params.id]
      );
      
      if (currentTenant.length === 0) {
        return res.status(404).json({ error: 'Tenant not found' });
      }
      
      const [result] = await pool.execute(
        `UPDATE tenants 
         SET property_id = ?, name = ?, phone = ?, email = ?, id_number = ?, gender = ?, 
             occupation = ?, emergency_contact = ?, emergency_phone = ?, move_in_date = ?, 
             move_out_date = ?, deposit_paid = ?, is_active = ?
         WHERE id = ?`,
        [property_id, name, phone, email, id_number, gender, occupation, emergency_contact, emergency_phone, move_in_date, move_out_date, deposit_paid, is_active, req.params.id]
      );
      
      // Update property status if tenant becomes inactive
      if (currentTenant[0].is_active && !is_active) {
        await pool.execute(
          'UPDATE properties SET status = "Vacant" WHERE id = ?',
          [currentTenant[0].property_id]
        );
      } else if (!currentTenant[0].is_active && is_active) {
        await pool.execute(
          'UPDATE properties SET status = "Occupied" WHERE id = ?',
          [property_id]
        );
      }
      
      res.json({ message: 'Tenant updated successfully' });
    } catch (error) {
      console.error('Tenant update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete tenant
  router.delete('/:id', async (req, res) => {
    try {
      // Get tenant's property
      const [tenant] = await pool.execute(
        'SELECT property_id FROM tenants WHERE id = ?',
        [req.params.id]
      );
      
      if (tenant.length === 0) {
        return res.status(404).json({ error: 'Tenant not found' });
      }
      
      const [result] = await pool.execute(
        'DELETE FROM tenants WHERE id = ?',
        [req.params.id]
      );
      
      // Update property status to vacant
      if (tenant[0].property_id) {
        await pool.execute(
          'UPDATE properties SET status = "Vacant" WHERE id = ?',
          [tenant[0].property_id]
        );
      }
      
      res.json({ message: 'Tenant deleted successfully' });
    } catch (error) {
      console.error('Tenant deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};