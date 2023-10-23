module.exports = {
    name: 'mostkissed',
    description: 'leaderboard of most kissed people (global top 5)',
    async execute(message) {
        const { Member } = require('..');

        let membersdb = await Member.findAll();

        membersdb.sort(function (a, b) {
            return b.kissys - a.kissys;
        });

        let mostKissed = membersdb.slice(0, 5);

        message.channel.send(
            `**Most Kissed:**
            \n1. <@${mostKissed[0].userid}> with **${mostKissed[0].kissys}** kisses
            \n2. <@${mostKissed[1].userid}> with **${mostKissed[1].kissys}** kisses
            \n3. <@${mostKissed[2].userid}> with **${mostKissed[2].kissys}** kisses
            \n4. <@${mostKissed[3].userid}> with **${mostKissed[3].kissys}** kisses
            \n5. <@${mostKissed[4].userid}> with **${mostKissed[4].kissys}** kisses`,
            { allowedMentions: { parse: [] } });
    },
};