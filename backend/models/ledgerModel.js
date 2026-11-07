const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ledger = sequelize.define('Ledger', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    description: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // 'INFLOW' or 'OUTFLOW'
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    reference_id: { type: DataTypes.STRING, allowNull: true } 
}, { tableName: 'ledger', timestamps: true });

module.exports = Ledger;