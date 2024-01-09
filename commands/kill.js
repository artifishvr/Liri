module.exports = {
    name: 'kill',
    description: 'MURDER someone',
    aliases: ['publicly-execute', 'murder'],
    args: true,
    usage: '<user>',
    guildOnly: true,
    cooldown: 30,
    async execute(message, args) {
        const { Member } = require('..');

        if (!args) return message.reply("you gotta kill someone!!");

        let memberid = args[0].replace(/[\\<>@#&!]/g, "");
        if (args[0] == "myself") memberid = message.author.id;
        let member = message.guild.members.cache.get(memberid);

        if (!member.displayName) return message.reply("couldn't find that user!\nif you're using a user id, try mentioning them instead.");

        if (memberid == message.author.id) {
            message.react("<:sad:1084023335609978890>");
        }

        let [user, created] = await Member.findOrCreate({ where: { userid: memberid } });
        if (created) console.log(`New member added to the database: ${user.userid}`);

        const newdeaths = user.deaths + 1;

        await Member.update({ deaths: newdeaths }, {
            where: {
                userid: memberid
            }
        });

        message.delete();

        const murderer = message.guild.members.cache.get(message.author.id);

        try {
            if (memberid == message.author.id) return message.channel.send(`**${murderer.displayName}** killed themself :(`);
            message.channel.send(`**${murderer.displayName}** MURDERED **${member.displayName}**\n**${member.displayName}** has died **${newdeaths}** times`);
        } catch (error) {
            console.log(error);
        };
    },
};