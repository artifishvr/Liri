import { SapphireClient, ApplicationCommandRegistries } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import '@sapphire/plugin-hmr/register';
import { Sequelize } from 'sequelize';
import fs from 'fs';

dotenv.config();

const client = new SapphireClient({
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    loadMessageCommandListeners: true,
    hmr: {
        enabled: process.env.NODE_ENV === 'development'
    }
});

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../db/uwu.db',
    logging: false,
});

try {
    if (!fs.existsSync('../db')) {
        fs.mkdirSync('../db');
    }

    await sequelize.authenticate();

    console.log('Connected to database successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
};

await sequelize.sync();

if (process.env.DISCORD_GUILD_ID) {
    ApplicationCommandRegistries.setDefaultGuildIds([process.env.DISCORD_GUILD_ID]);
}

client.login(process.env.DISCORD_CLIENT_TOKEN);

export {
    sequelize
}