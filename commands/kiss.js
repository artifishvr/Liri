

module.exports = {
    name: 'kiss',
    description: 'give someone a kiss',
    args: true,
    usage: '<user>',
    guildOnly: true,
    cooldown: 5,
    async execute(message, args) {
        const { Member } = require('..');

        if (!args) {
            message.channel.send("you gotta kiss someone!!");
            return;
        }

        let memberid = args[0].replace(/[\\<>@#&!]/g, "");
        let member = message.guild.members.cache.get(memberid);

        if (!member.displayName) {
            message.reply("couldn't find that user!\nif you're using a user id, try mentioning them instead.");
        };

        if (memberid == message.author.id) {
            message.channel.send("get someone else to kiss you <:sad:1084023335609978890>");
            return;
        }

        let [user, created] = await Member.findOrCreate({ where: { userid: memberid } });
        if (created) console.log(`New member added to the database: ${user.userid}`);

        const newkisses = user.kissys + 1;

        await Member.update({ kissys: newkisses }, {
            where: {
                userid: memberid
            }
        });

        message.delete();

        const kissingmember = message.guild.members.cache.get(message.author.id);

        try {
            message.channel.send(`**${kissingmember.displayName}** kissed **${member.displayName}** ❤️\n**${member.displayName}** has now been kissed **${newkisses}** times :3`);
        } catch (error) {
            console.log(error);
        };
    },
};