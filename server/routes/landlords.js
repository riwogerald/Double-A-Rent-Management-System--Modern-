const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Get all landlords
  router.get('/', async (req, res) => {
    try {
      const [landlords] = await pool.execute(`
        SELECT l.*, 
               COUNT(p.id) as property_count,
               COALESCE(SUM(p.rent_amount), 0) as total_rent_value
        FROM landlords l
        LEFT JOIN properties p ON l.id = p.landlord_id
        GROUP BY l.id
        ORDER BY l.created_at DESC
      `);
      res.json(landlords);
    } catch (error) {
      console.error('Landlords fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get landlord by ID
  router.get('/:id', async (req, res) => {
    try {
      const [landlords] = await pool.execute(
        'SELECT * FROM landlords WHERE id = ?',
        [req.params.id]
      );
      
      if (landlords.length === 0) {
        return res.status(404).json({ error: 'Landlord not found' });
      }
      
      // Get landlord's properties
      const [properties] = await pool.execute(
        'SELECT * FROM properties WHERE landlord_id = ?',
        [req.params.id]
      );
      
      res.json({ ...landlords[0], properties });
    } catch (error) {
      console.error('Landlord fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create new landlord
  router.post('/', async (req, res) => {
    try {
      const { 
        name, phone, email, gender, bank_account, 
        bank_name, id_number, address 
      } = req.body;
      
      const [result] = await pool.execute(
        `INSERT INTO landlords (name, phone, email, gender, bank_account, bank_name, id_number, address) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, phone, email, gender, bank_account, bank_name, id_number, address]
      );
      
      res.status(201).json({ 
        message: 'Landlord created successfully', 
        id: result.insertId 
      });
    } catch (error) {
      console.error('Landlord creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update landlord
  router.put('/:id', async (req, res) => {
    try {
      const { 
        name, phone, email, gender, bank_account, 
        bank_name, id_number, address, is_active 
      } = req.body;
      
      const [result] = await pool.execute(
        `UPDATE landlords 
         SET name = ?, phone = ?, email = ?, gender = ?, bank_account = ?, 
             bank_name = ?, id_number = ?, address = ?, is_active = ?
         WHERE id = ?`,
        [name, phone, email, gender, bank_account, bank_name, id_number, address, is_active, req.params.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Landlord not found' });
      }
      
      res.json({ message: 'Landlord updated successfully' });
    } catch (error) {
      console.error('Landlord update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete landlord
  router.delete('/:id', async (req, res) => {
    try {
      // Check if landlord has properties
      const [properties] = await pool.execute(
        'SELECT COUNT(*) as count FROM properties WHERE landlord_id = ?',
        [req.params.id]
      );
      
      if (properties[0].count > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete landlord with existing properties' 
        });
      }
      
      const [result] = await pool.execute(
        'DELETE FROM landlords WHERE id = ?',
        [req.params.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Landlord not found' });
      }
      
      res.json({ message: 'Landlord deleted successfully' });
    } catch (error) {
      console.error('Landlord deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};