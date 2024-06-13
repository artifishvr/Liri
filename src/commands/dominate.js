import { Command } from '@sapphire/framework';
import { db } from '../index.js';
import { Members } from '../schema.js';
import { eq } from 'drizzle-orm';

export class KissCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('dominate').setDescription('Dominate someone').addUserOption((option) => option.setName('user').setDescription('The user to dom.').setRequired(true))
            , {
                idHints: ['1242706354204966942'],
                guildIds: ['867259665682137098']
            });
    }

    async chatInputRun(interaction) {
        await interaction.deferReply();


        const kissinguser = await interaction.options.getUser('user');

        if (interaction.user.id == kissinguser.id) {
            interaction.editReply("how would that even work");
            return;
        }

        let result = await db.select().from(Members).where(eq(Members.userid, kissinguser.id));
        if (result.length == 0) {
            result = await db.insert(Members).values({
                userid: kissinguser.id,
                createdAt: 1,
                updatedAt: 1,
            }).returning();
        }
        result = result[0];

        const newkisses = result.dominated + 1;

        await db.update(Members)
            .set({ dominated: newkisses })
            .where(eq(Members.userid, kissinguser.id));

        return interaction.editReply(`**${interaction.user.username}** dominated **${kissinguser.username}** :flushed:\n**${kissinguser.username}** has now been dommed **${newkisses}** time${newkisses != 1 ? "s" : ""}.`);
    }
}