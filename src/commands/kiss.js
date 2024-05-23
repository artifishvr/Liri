import { Command } from '@sapphire/framework';
import { Member } from '../index.js';

export class KissCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('kiss').setDescription('Kiss someone!').addUserOption((option) => option.setName('user').setDescription('The user to kiss.').setRequired(true)), {
            idHints: ['1242678695882264641']
        });
    }

    async chatInputRun(interaction) {
        await interaction.deferReply();


        const kissinguser = await interaction.options.getUser('user');

        if (interaction.user.id == kissinguser.id) {
            interaction.editReply("get someone else to kiss you <:sad:1084023335609978890>");
            return;
        }

        let [user, created] = await Member.findOrCreate({ where: { userid: kissinguser.id } });
        if (created) console.log(`New member added to the database: ${user.userid}`);

        const newkisses = user.kissys + 1;
        await Member.update({ kissys: newkisses }, {
            where: {
                userid: kissinguser.id
            }
        });

        return interaction.editReply(`**${interaction.user.username}** kissed **${kissinguser.username}** ❤️\n**${kissinguser.username}** has now been kissed **${newkisses}** time${newkisses != 1 ? "s" : ""} :3`);
    }
}