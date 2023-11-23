module.exports = {
    name: 'fish',
    description: 'fish',
    args: true,
    usage: '<user>',
    guildOnly: true,
    cooldown: 5,
    async execute(message, args) {

        if (!args) {
            message.channel.send("you gotta fish someone!!");
            return;
        }

        let memberid = args[0].replace(/[\\<>@#&!]/g, "");
        let member = message.guild.members.cache.get(memberid);

        if (!member.displayName) {
            message.reply("couldn't find that user!\nif you're using a user id, try mentioning them instead.");
        };

        if (memberid == message.author.id) {
            message.channel.send("get someone else to fish you <:sad:1084023335609978890>");
            return;
        }

        message.delete();

        const kissingmember = message.guild.members.cache.get(message.author.id);

        try {
            message.channel.send(`**${kissingmember.displayName}** fished **${member.displayName}**!`);
        } catch (error) {
            console.log(error);
        };
    },
};