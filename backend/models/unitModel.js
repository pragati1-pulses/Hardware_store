const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Unit = sequelize.define('Unit', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }, // e.g., "Bags"
    short_name: { type: DataTypes.STRING, allowNull: false }, // e.g., "Bgs"
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'units', timestamps: true });

module.exports = Unit;