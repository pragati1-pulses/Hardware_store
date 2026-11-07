const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Invoice = sequelize.define('Invoice', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    invoice_no: { type: DataTypes.STRING, allowNull: false, unique: true }, 
    customer_id: { type: DataTypes.INTEGER, allowNull: true }, 
    sub_total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    tax_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_mode: { type: DataTypes.STRING, allowNull: false }, 
    status: { type: DataTypes.STRING, defaultValue: 'Paid' } 
}, { tableName: 'invoices', timestamps: true });

module.exports = Invoice;