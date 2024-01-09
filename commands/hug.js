module.exports = {
    name: 'hug',
    description: 'give someone a hug',
    args: true,
    usage: '<user>',
    guildOnly: true,
    cooldown: 5,
    async execute(message, args) {
        const { Member } = require('..');

        if (!args) return message.reply("you gotta hug someone!!");

        let memberid = args[0].replace(/[\\<>@#&!]/g, "");
        let member = message.guild.members.cache.get(memberid);

        if (!member.displayName) return message.reply("couldn't find that user!\nif you're using a user id, try mentioning them instead.");

        if (memberid == message.author.id) {
            message.channel.send("get someone else to hug you <:sad:1084023335609978890>");
            return;
        }

        let [user, created] = await Member.findOrCreate({ where: { userid: memberid } });
        if (created) console.log(`New member added to the database: ${user.userid}`);

        const newhugs = user.hugged + 1;

        await Member.update({ hugged: newhugs }, {
            where: {
                userid: memberid
            }
        });

        message.delete();

        const huggingmember = message.guild.members.cache.get(message.author.id);

        try {
            message.channel.send(`<:hug:1181142582412189736>`);
            message.channel.send(`**${huggingmember.displayName}** hugged **${member.displayName}** uwu\n**${member.displayName}** has now been hugged **${newhugs}** times :3`);
        } catch (error) {
            console.log(error);
        };
    },
};