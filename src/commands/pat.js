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
            builder.setName('headpat').setDescription('Give someone a headpat').addUserOption((option) => option.setName('user').setDescription('The user to pat.').setRequired(true))
            , {
                idHints: ['1250906614308012032']
            });
    }

    async chatInputRun(interaction) {
        await interaction.deferReply();


        const kissinguser = await interaction.options.getUser('user');

        if (interaction.user.id == kissinguser.id) {
            interaction.editReply("get someone else to give you pats <:sad:1084023335609978890>");
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

        const newkisses = result.pats + 1;

        await db.update(Members)
            .set({ pats: newkisses })
            .where(eq(Members.userid, kissinguser.id));

        return interaction.editReply(`**${interaction.user.username}** gave **${kissinguser.username}** a headpat c:\n**${kissinguser.username}** has now been patted **${newkisses}** time${newkisses != 1 ? "s" : ""}.`);
    }
}