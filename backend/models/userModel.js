const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { 
        // This creates an Enum type in PostgreSQL. Only these 3 values are allowed!
        type: DataTypes.ENUM('super_admin', 'admin', 'staff'), 
        allowNull: false,
        defaultValue: 'staff'
    }, 


 created_by: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
    },


 enabled_modules: { 
        type: DataTypes.JSON, 
        allowNull: true, 
        defaultValue: [] 
    },


     // NEW FIELDS
    reset_password_token: { type: DataTypes.STRING, allowNull: true },
    reset_password_expires: { type: DataTypes.DATE, allowNull: true }

}, { tableName: 'users', timestamps: true });

module.exports = User;