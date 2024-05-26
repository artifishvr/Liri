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
            builder.setName('hug').setDescription('Give someone a hug :3').addUserOption((option) => option.setName('user').setDescription('The user to hug.').setRequired(true))
            , {
                idHints: ['1242706354204966942']
            });
    }

    async chatInputRun(interaction) {
        await interaction.deferReply();


        const kissinguser = await interaction.options.getUser('user');

        if (interaction.user.id == kissinguser.id) {
            interaction.editReply("get someone else to hug you <:sad:1084023335609978890>");
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

        const newkisses = result.hugged + 1;

        await db.update(Members)
            .set({ hugged: newkisses })
            .where(eq(Members.userid, kissinguser.id));

        return interaction.editReply(`**${interaction.user.username}** hugged **${kissinguser.username}** :3\n**${kissinguser.username}** has now been hugged **${newkisses}** time${newkisses != 1 ? "s" : ""}.`);
    }
}