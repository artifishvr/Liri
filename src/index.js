import { SapphireClient, ApplicationCommandRegistries } from '@sapphire/framework';
import '@sapphire/plugin-hmr/register';
import { GatewayIntentBits, ActivityType, PresenceUpdateStatus } from 'discord.js';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const client = new SapphireClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    hmr: {
        enabled: process.env.NODE_ENV === 'development'
    }
});

const sqlite = new Database('db/uwu.db');
const db = drizzle(sqlite);


if (process.env.DISCORD_GUILD_ID) ApplicationCommandRegistries.setDefaultGuildIds([process.env.DISCORD_GUILD_ID]);

client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag);
    client.user.setPresence({ activities: [{ name: 'catgirl gex', type: ActivityType.Playing }], status: PresenceUpdateStatus.Idle });
    setInterval(() => {
        client.user.setPresence({ activities: [{ name: 'catgirl gex', type: ActivityType.Playing }], status: PresenceUpdateStatus.Idle });
    }, 1000 * 60 * 60);
});


migrate(db, { migrationsFolder: "drizzle" });

client.login(process.env.DISCORD_CLIENT_TOKEN);
export { db };