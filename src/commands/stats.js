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
            idHints: ['1242707883809050635']
        });
    }

    async chatInputRun(interaction) {
        await interaction.deferReply();

        const result = await db.select().from(Members).where(eq(Members.userid, interaction.options.getUser('user').id));

        if (result.length == 0) return interaction.editReply(`Couldn't find that user in the database!`);

        const Embed = new EmbedBuilder()
            .setColor(0xff7b00)
            .setTitle('Stats for ' + interaction.options.getUser('user').username)
            .addFields(
                { name: 'Kisses', value: `${result[0].kissys}`, inline: true },
                { name: 'Hugs', value: `${result[0].hugged}`, inline: true },
                { name: 'Deaths', value: `${result[0].deaths}`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'uwu haiiii' });

        return interaction.editReply({ embeds: [Embed] });
    }
}