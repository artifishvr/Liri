import { Command } from '@sapphire/framework';
import { Member } from '../index.js';
import { EmbedBuilder } from 'discord.js';

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

        let user = await Member.findOne({ where: { userid: interaction.options.getUser('user').id } });
        if (!user) return interaction.editReply(`Couldn't find that user in the database!`);

        const Embed = new EmbedBuilder()
            .setColor(0xff7b00)
            .setTitle('Stats for ' + interaction.options.getUser('user').username)
            .addFields(
                { name: 'Kisses', value: `${user.kissys}`, inline: true },
                { name: 'Hugs', value: `${user.hugged}`, inline: true },
                { name: 'Deaths', value: `${user.deaths}`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'uwu haiiii' });

        return interaction.editReply({ embeds: [Embed] });
    }
}