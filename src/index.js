import { SapphireClient, ApplicationCommandRegistries } from '@sapphire/framework';
import '@sapphire/plugin-hmr/register';
import { GatewayIntentBits, ActivityType, PresenceUpdateStatus } from 'discord.js';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from 'better-sqlite3';
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

client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag);
    client.user.setPresence({ activities: [{ name: 'catgirl gex', type: ActivityType.Playing }], status: PresenceUpdateStatus.Idle });
    setInterval(() => {
        client.user.setPresence({ activities: [{ name: 'catgirl gex', type: ActivityType.Playing }], status: PresenceUpdateStatus.Idle });
    }, 1000 * 60 * 60);
});



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

if (!fs.existsSync('db')) {
    fs.mkdirSync('db');
}

const sqlite = new Database('db/uwu.db');
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "drizzle" });

client.login(process.env.DISCORD_CLIENT_TOKEN);

export { db };