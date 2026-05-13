const connection = require('../config/database');
const { DataTypes } = require('sequelize');

const User = connection.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
}, {
    tableName: "users",
    timestamps: true
});

module.exports = User;