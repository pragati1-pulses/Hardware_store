const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sku: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    unit_id: { type: DataTypes.INTEGER, allowNull: false }, 
    gst_id: { type: DataTypes.INTEGER, allowNull: true }, // <-- NEW: Link to GST Master
    cost_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    selling_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock_level: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    min_stock: { type: DataTypes.DECIMAL(10, 2), defaultValue: 5 }
}, { tableName: 'products', timestamps: true });

module.exports = Product;