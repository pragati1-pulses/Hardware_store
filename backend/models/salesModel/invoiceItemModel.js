const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Invoice = require('./invoiceModel');
const Product = require('../mastersModel/productModel');

const InvoiceItem = sequelize.define('InvoiceItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    invoice_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'invoice_items', timestamps: false });

// Relationships
Invoice.hasMany(InvoiceItem, { foreignKey: 'invoice_id', as: 'items' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoice_id' });
InvoiceItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = InvoiceItem;