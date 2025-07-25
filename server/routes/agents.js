const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Get all agents
  router.get('/', async (req, res) => {
    try {
      const [agents] = await pool.execute(`
        SELECT a.*, 
               COUNT(p.id) as property_count,
               COALESCE(SUM(p.rent_amount), 0) as total_rent_value
        FROM agents a
        LEFT JOIN properties p ON a.id = p.agent_id
        GROUP BY a.id
        ORDER BY a.created_at DESC
      `);
      res.json(agents);
    } catch (error) {
      console.error('Agents fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get agent by ID
  router.get('/:id', async (req, res) => {
    try {
      const [agents] = await pool.execute(
        'SELECT * FROM agents WHERE id = ?',
        [req.params.id]
      );
      
      if (agents.length === 0) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      
      res.json(agents[0]);
    } catch (error) {
      console.error('Agent fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create new agent
  router.post('/', async (req, res) => {
    try {
      const { name, phone, email, gender, commission_rate } = req.body;
      
      const [result] = await pool.execute(
        `INSERT INTO agents (name, phone, email, gender, commission_rate) 
         VALUES (?, ?, ?, ?, ?)`,
        [name, phone, email, gender, commission_rate || 1.00]
      );
      
      res.status(201).json({ 
        message: 'Agent created successfully', 
        id: result.insertId 
      });
    } catch (error) {
      console.error('Agent creation error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // Update agent
  router.put('/:id', async (req, res) => {
    try {
      const { name, phone, email, gender, commission_rate, is_active } = req.body;
      
      const [result] = await pool.execute(
        `UPDATE agents 
         SET name = ?, phone = ?, email = ?, gender = ?, commission_rate = ?, is_active = ?
         WHERE id = ?`,
        [name, phone, email, gender, commission_rate, is_active, req.params.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      
      res.json({ message: 'Agent updated successfully' });
    } catch (error) {
      console.error('Agent update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete agent
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.execute(
        'DELETE FROM agents WHERE id = ?',
        [req.params.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      
      res.json({ message: 'Agent deleted successfully' });
    } catch (error) {
      console.error('Agent deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};