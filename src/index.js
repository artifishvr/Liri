import { SapphireClient, ApplicationCommandRegistries } from '@sapphire/framework';
import '@sapphire/plugin-hmr/register';
import { GatewayIntentBits, ActivityType, PresenceUpdateStatus } from 'discord.js';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import dotenv from 'dotenv';

dotenv.config();

const client = new SapphireClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    hmr: {
        enabled: process.env.NODE_ENV === 'development'
    }
});


const db = drizzle('db/uwu.db');


if (process.env.DISCORD_GUILD_ID) ApplicationCommandRegistries.setDefaultGuildIds([process.env.DISCORD_GUILD_ID]);

client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag);
    client.user.setPresence({ activities: [{ name: 'catgirl gex', type: ActivityType.Custom }], status: PresenceUpdateStatus.Idle });
    setInterval(() => {
        client.user.setPresence({ activities: [{ name: 'catgirl gex', type: ActivityType.Custom }], status: PresenceUpdateStatus.Idle });
    }, 1000 * 60 * 60);
});


migrate(db, { migrationsFolder: "drizzle" });

client.login(process.env.DISCORD_CLIENT_TOKEN);
export { db };