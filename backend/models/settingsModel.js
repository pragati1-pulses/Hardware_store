const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Settings = sequelize.define('Settings', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    company_name: { type: DataTypes.STRING, allowNull: false },
    logo_url: { type: DataTypes.TEXT, defaultValue: '' },
    workspace_name: { type: DataTypes.STRING, allowNull: false },
    owner_name: { type: DataTypes.STRING, allowNull: false },
    gstin: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    pincode: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    
    // NEW: Store enabled modules as a JSON array
    enabled_modules: {
        type: DataTypes.JSON,
        defaultValue: ['dashboard', 'sales', 'inventory', 'purchases', 'customers', 'suppliers', 'ledgers', 'reports', 'masters', 'settings']
    }
}, { tableName: 'settings', timestamps: true, createdAt: false, updatedAt: 'updated_at' });

module.exports = Settings;