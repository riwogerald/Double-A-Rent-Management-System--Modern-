const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Get all properties
  router.get('/', async (req, res) => {
    try {
      const [properties] = await pool.execute(`
        SELECT p.*, 
               l.name as landlord_name, 
               e.name as estate_name,
               a.name as agent_name,
               t.name as tenant_name,
               t.is_active as tenant_active
        FROM properties p 
        LEFT JOIN landlords l ON p.landlord_id = l.id 
        LEFT JOIN estates e ON p.estate_id = e.id
        LEFT JOIN agents a ON p.agent_id = a.id
        LEFT JOIN tenants t ON p.id = t.property_id AND t.is_active = 1
        ORDER BY p.created_at DESC
      `);
      res.json(properties);
    } catch (error) {
      console.error('Properties fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get vacant properties
  router.get('/vacant', async (req, res) => {
    try {
      const [properties] = await pool.execute(`
        SELECT p.*, l.name as landlord_name, e.name as estate_name
        FROM properties p 
        LEFT JOIN landlords l ON p.landlord_id = l.id 
        LEFT JOIN estates e ON p.estate_id = e.id
        WHERE p.status = 'Vacant'
        ORDER BY p.created_at DESC
      `);
      res.json(properties);
    } catch (error) {
      console.error('Vacant properties fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get property by ID
  router.get('/:id', async (req, res) => {
    try {
      const [properties] = await pool.execute(`
        SELECT p.*, 
               l.name as landlord_name, 
               e.name as estate_name,
               a.name as agent_name
        FROM properties p 
        LEFT JOIN landlords l ON p.landlord_id = l.id 
        LEFT JOIN estates e ON p.estate_id = e.id
        LEFT JOIN agents a ON p.agent_id = a.id
        WHERE p.id = ?
      `, [req.params.id]);
      
      if (properties.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      res.json(properties[0]);
    } catch (error) {
      console.error('Property fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create new property
  router.post('/', async (req, res) => {
    try {
      const { 
        estate_id, landlord_id, agent_id, house_number, 
        house_type, rent_amount, deposit_amount, description 
      } = req.body;
      
      const [result] = await pool.execute(
        `INSERT INTO properties (estate_id, landlord_id, agent_id, house_number, house_type, rent_amount, deposit_amount, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [estate_id, landlord_id, agent_id, house_number, house_type, rent_amount, deposit_amount, description]
      );
      
      res.status(201).json({ 
        message: 'Property created successfully', 
        id: result.insertId 
      });
    } catch (error) {
      console.error('Property creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update property
  router.put('/:id', async (req, res) => {
    try {
      const { 
        estate_id, landlord_id, agent_id, house_number, 
        house_type, rent_amount, deposit_amount, status, description 
      } = req.body;
      
      const [result] = await pool.execute(
        `UPDATE properties 
         SET estate_id = ?, landlord_id = ?, agent_id = ?, house_number = ?, 
             house_type = ?, rent_amount = ?, deposit_amount = ?, status = ?, description = ?
         WHERE id = ?`,
        [estate_id, landlord_id, agent_id, house_number, house_type, rent_amount, deposit_amount, status, description, req.params.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      res.json({ message: 'Property updated successfully' });
    } catch (error) {
      console.error('Property update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete property
  router.delete('/:id', async (req, res) => {
    try {
      // Check if property has active tenants
      const [tenants] = await pool.execute(
        'SELECT COUNT(*) as count FROM tenants WHERE property_id = ? AND is_active = 1',
        [req.params.id]
      );
      
      if (tenants[0].count > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete property with active tenants' 
        });
      }
      
      const [result] = await pool.execute(
        'DELETE FROM properties WHERE id = ?',
        [req.params.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      res.json({ message: 'Property deleted successfully' });
    } catch (error) {
      console.error('Property deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};