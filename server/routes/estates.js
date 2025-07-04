const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Get all estates
  router.get('/', async (req, res) => {
    try {
      const [estates] = await pool.execute(`
        SELECT e.*, 
               COUNT(p.id) as actual_properties,
               COUNT(CASE WHEN p.status = 'Occupied' THEN 1 END) as actual_occupied
        FROM estates e
        LEFT JOIN properties p ON e.id = p.estate_id
        GROUP BY e.id
        ORDER BY e.created_at DESC
      `);
      res.json(estates);
    } catch (error) {
      console.error('Estates fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get estate by ID
  router.get('/:id', async (req, res) => {
    try {
      const [estates] = await pool.execute(
        'SELECT * FROM estates WHERE id = ?',
        [req.params.id]
      );
      
      if (estates.length === 0) {
        return res.status(404).json({ error: 'Estate not found' });
      }
      
      // Get estate's properties
      const [properties] = await pool.execute(`
        SELECT p.*, t.name as tenant_name
        FROM properties p
        LEFT JOIN tenants t ON p.id = t.property_id AND t.is_active = 1
        WHERE p.estate_id = ?
        ORDER BY p.house_number
      `, [req.params.id]);
      
      res.json({ ...estates[0], properties });
    } catch (error) {
      console.error('Estate fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create new estate
  router.post('/', async (req, res) => {
    try {
      const { name, location, description, total_houses } = req.body;
      
      const [result] = await pool.execute(
        `INSERT INTO estates (name, location, description, total_houses) 
         VALUES (?, ?, ?, ?)`,
        [name, location, description, total_houses || 0]
      );
      
      res.status(201).json({ 
        message: 'Estate created successfully', 
        id: result.insertId 
      });
    } catch (error) {
      console.error('Estate creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update estate
  router.put('/:id', async (req, res) => {
    try {
      const { name, location, description, total_houses } = req.body;
      
      const [result] = await pool.execute(
        `UPDATE estates 
         SET name = ?, location = ?, description = ?, total_houses = ?
         WHERE id = ?`,
        [name, location, description, total_houses, req.params.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Estate not found' });
      }
      
      res.json({ message: 'Estate updated successfully' });
    } catch (error) {
      console.error('Estate update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete estate
  router.delete('/:id', async (req, res) => {
    try {
      // Check if estate has properties
      const [properties] = await pool.execute(
        'SELECT COUNT(*) as count FROM properties WHERE estate_id = ?',
        [req.params.id]
      );
      
      if (properties[0].count > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete estate with existing properties' 
        });
      }
      
      const [result] = await pool.execute(
        'DELETE FROM estates WHERE id = ?',
        [req.params.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Estate not found' });
      }
      
      res.json({ message: 'Estate deleted successfully' });
    } catch (error) {
      console.error('Estate deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};