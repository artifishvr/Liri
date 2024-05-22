import { SapphireClient, ApplicationCommandRegistries } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import '@sapphire/plugin-hmr/register';

dotenv.config();

const client = new SapphireClient({
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    loadMessageCommandListeners: true,
    hmr: {
        enabled: process.env.NODE_ENV === 'development'
    }
});

if (process.env.DISCORD_GUILD_ID) {
    ApplicationCommandRegistries.setDefaultGuildIds([process.env.DISCORD_GUILD_ID]);
}

client.login(process.env.DISCORD_CLIENT_TOKEN);