const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'stats',
    description: 'get someone\'s statistics',
    usage: '[user]',
    async execute(message, args) {
        const { Member } = require('..');

        let memberid;

        if (args[0]) memberid = args[0].replace(/[\\<>@#&!]/g, "");
        if (!args[0]) memberid = message.author.id;


        let member = message.guild.members.cache.get(memberid);

        if (!member.displayName) {
            message.reply("couldn't find that user!\nif you're using a user id, try mentioning them instead.");
        };


        let user = await Member.findOne({ where: { userid: memberid } });
        if (!user) console.log(`Couldn't find that user!`);

        const Embed = new EmbedBuilder()
            .setColor(0xff7b00)
            .setTitle('Stats for ' + member.displayName)
            .setThumbnail(member.avatarURL())
            .addFields(
                { name: 'Kisses', value: `${user.kissys}`, inline: true },
                { name: 'Hugs', value: `${user.hugged}`, inline: true },
                { name: 'Dominations', value: `${user.dominated}`, inline: true },
                { name: 'Deaths', value: `${user.deaths}`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'uwu haiiii', iconURL: message.client.user.avatarURL() });

        message.channel.send({ embeds: [Embed] });
    },
};