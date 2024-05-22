import { DataTypes } from 'sequelize';
import { sequelize } from '../index.js';

export const Member = sequelize.define('Member', {
    userid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kissys: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    hugged: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    dominated: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    deaths: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
});