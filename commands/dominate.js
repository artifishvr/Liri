module.exports = {
    name: 'dominate',
    description: 'dom someone :flushed:',
    aliases: ['dom'],
    args: true,
    usage: '<user>',
    guildOnly: true,
    cooldown: 5,
    async execute(message, args) {
        const { Member } = require('..');

        if (!args) return message.reply("you gotta dominate someone");

        let memberid = args[0].replace(/[\\<>@#&!]/g, "");
        let member = message.guild.members.cache.get(memberid);

        if (!member.displayName) return message.reply("couldn't find that user!\nif you're using a user id, try mentioning them instead.");

        if (memberid == message.author.id) {
            message.channel.send("how would that even work");
            return;
        }

        let [user, created] = await Member.findOrCreate({ where: { userid: memberid } });
        if (created) console.log(`New member added to the database: ${user.userid}`);

        const newdoms = user.dominated + 1;

        await Member.update({ dominated: newdoms }, {
            where: {
                userid: memberid
            }
        });

        message.delete();

        const huggingmember = message.guild.members.cache.get(message.author.id);

        try {
            message.channel.send(`**${huggingmember.displayName}** just dominated **${member.displayName}** :flushed:\n**${member.displayName}** has now been dommed **${newdoms}** times!`);
        } catch (error) {
            console.log(error);
        };
    },
};