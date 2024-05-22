import { Command } from '@sapphire/framework';
import { Member } from '../index.js';

export class KissCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('hug').setDescription('Give someone a hug :3').addUserOption((option) => option.setName('user').setDescription('The user to hug.').setRequired(true)));
    }

    async chatInputRun(interaction) {
        await interaction.deferReply();


        const kissinguser = await interaction.options.getUser('user');

        if (interaction.user.id == kissinguser.id) {
            interaction.editReply("get someone else to hug you <:sad:1084023335609978890>");
            return;
        }

        let [user, created] = await Member.findOrCreate({ where: { userid: kissinguser.id } });
        if (created) console.log(`New member added to the database: ${user.userid}`);

        const newkisses = user.hugged + 1;
        await Member.update({ hugged: newkisses }, {
            where: {
                userid: kissinguser.id
            }
        });

        return interaction.editReply(`**${interaction.user.username}** hugged **${kissinguser.username}** :3\n**${kissinguser.username}** has now been hugged **${newkisses}** time${newkisses != 1 ? "s" : ""}.`);
    }
}