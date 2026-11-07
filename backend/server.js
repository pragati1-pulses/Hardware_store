const seedUsers = require('./seeders/userSeeder');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const sequelize = require('./config/database'); 
const settingsRoutes = require('./routes/settingsRoutes');  
const unitRoutes = require('./routes/unitRoutes'); 
const customerRoutes = require('./routes/mastersRoutes/customerRoutes'); 
const supplierRoutes = require('./routes/mastersRoutes/supplierRoutes');
const productRoutes = require('./routes/mastersRoutes/productRoutes');
const gstRoutes = require('./routes/mastersRoutes/gstRoutes');
const bankRoutes = require('./routes/mastersRoutes/bankRoutes'); 
const authRoutes = require('./routes/authRoutes');
const salesRoutes = require('./routes/salesRoutes');

const app = express();

// ==========================================
// 👇 PKG FIX: Point folders to the .exe location
// ==========================================
const isPkg = typeof process.pkg !== 'undefined';
const baseDir = isPkg ? path.dirname(process.execPath) : __dirname;

// Create 'uploads' folder automatically if it doesn't exist
const uploadsDir = path.join(baseDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`📁 Created uploads folder at: ${uploadsDir}`);
}

// ==========================================
// 1. MIDDLEWARE
// ==========================================
app.use(cors()); 
app.use(express.json()); 
app.use('/uploads', express.static(uploadsDir)); 

// ==========================================
// 2. ROUTES
// ==========================================
app.use('/api/masters/units', unitRoutes); 
app.use('/api/masters/customers', customerRoutes);
app.use('/api/masters/suppliers', supplierRoutes);
app.use('/api/masters/products', productRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/masters/gst', gstRoutes);
app.use('/api/masters/banks', bankRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/auth', authRoutes);
// Health Check
app.get('/api/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ message: "Backend is running!" });
    } catch (error) {
        res.status(500).json({ error: "Database connection failed." });
    }
});

// ==========================================
// 3. START SERVER
// ==========================================
// ==========================================
// 3. START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

// 👇 Changed { alter: true } to just sync() for pendrive safety
sequelize.sync().then(async () => {  // <-- Notice the 'async' added here
    console.log('✅ Database connected and models synced.'); 

    // 👇 RUN THE SEEDER HERE BEFORE STARTING THE SERVER
    await seedUsers();

    // ==========================================
    // 👇 ADD THIS TO SERVE THE ANGULAR FRONTEND
    // ==========================================
    // Serve static files from the 'public' folder
    app.use(express.static(path.join(baseDir, 'public')));

    // Fallback for Angular routing: if no API route matches, send index.html
    app.get(/.*/, (req, res) => {
        if (!req.url.startsWith('/api')) {
            res.sendFile(path.join(baseDir, 'public', 'index.html'));
        }
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('❌ Failed to sync database:', err);
});