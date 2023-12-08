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

        if (!args) {
            message.channel.send("you gotta dominate someone");
            return;
        }

        let memberid = args[0].replace(/[\\<>@#&!]/g, "");
        let member = message.guild.members.cache.get(memberid);

        if (!member.displayName) {
            message.reply("couldn't find that user!\nif you're using a user id, try mentioning them instead.");
        };

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

        let quote = ""
        switch (member.displayName.toLowerCase()) {
            case "drake":
                quote = "\"said they a bottom, girl me too\""
                break;
            default:
        }

        try {
            message.channel.send(`**${huggingmember.displayName}** just dominated **${member.displayName}** :flushed:\n**${member.displayName}** has now been dommed **${newdoms}** times!\n${quote || ""}`);
        } catch (error) {
            console.log(error);
        };
    },
};