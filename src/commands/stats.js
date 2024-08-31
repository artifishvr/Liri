import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import { db } from '../index.js';
import { Members } from '../schema.js';
import { eq } from 'drizzle-orm';

export class StatsCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('stats').setDescription('get the stats of a user!').addUserOption((option) => option.setName('user').setDescription('The user to get stats for.').setRequired(true)), {
            idHints: ['1250906528588894258']
        });
    }

    async chatInputRun(interaction) {
        await interaction.deferReply();

        const result = await db.select().from(Members).where(eq(Members.userid, interaction.options.getUser('user').id));

        if (result.length == 0) return interaction.editReply(`Couldn't find that user in the database!`);

        const Embed = new EmbedBuilder()
            .setColor(0xff7175)
            .setTitle('Stats for ' + interaction.options.getUser('user').username)
            .addFields(
                { name: 'Kisses', value: `${result[0].kissys}`, inline: true },
                { name: 'Hugs', value: `${result[0].hugged}`, inline: true },
                { name: 'Deaths', value: `${result[0].deaths}`, inline: true },
                { name: 'Headpats', value: `${result[0].pats}`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Liri', iconURL: 'https://cdn.discordapp.com/avatars/853136518259802112/48e8f1d5560a848491cbb331d4617a72.png?size=4096&format=webp&quality=lossless&width=0&height=230' });

        return interaction.editReply({ embeds: [Embed] });
    }
}