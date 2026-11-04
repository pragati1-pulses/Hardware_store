const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Set up PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 1. Test route
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ 
            message: "Backend server is running perfectly!",
            database_time: result.rows[0].now 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection failed." });
    }
});

// ==========================================
// INVENTORY ROUTES
// ==========================================

// GET: Fetch all inventory items
app.get('/api/inventory', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inventory ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch inventory" });
    }
});

// POST: Add a new inventory item
app.post('/api/inventory', async (req, res) => {
    try {
        const { item_id, name, unit, cost_price, selling_price, stock_level } = req.body;
        
        const newItem = await pool.query(
            `INSERT INTO inventory (item_id, name, unit, cost_price, selling_price, stock_level) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [item_id, name, unit, cost_price, selling_price, stock_level]
        );
        
        res.status(201).json(newItem.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add inventory item. Item ID might already exist." });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});