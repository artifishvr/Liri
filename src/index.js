import { SapphireClient, ApplicationCommandRegistries } from '@sapphire/framework';
import '@sapphire/plugin-hmr/register';
import { GatewayIntentBits } from 'discord.js';
import { Sequelize, DataTypes } from 'sequelize';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const client = new SapphireClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    hmr: {
        enabled: process.env.NODE_ENV === 'development'
    }
});
if (process.env.DISCORD_GUILD_ID) ApplicationCommandRegistries.setDefaultGuildIds([process.env.DISCORD_GUILD_ID]);


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/uwu.db',
    logging: false,
});

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

try {
    if (!fs.existsSync('db')) {
        fs.mkdirSync('db');
    }

    await sequelize.authenticate();
    await sequelize.sync();

    console.log('Connected to database successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
};



client.login(process.env.DISCORD_CLIENT_TOKEN);
// funny line
export { sequelize };