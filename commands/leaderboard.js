module.exports = {
    name: 'leaderboard',
    description: 'global top 5 leaderboard',
    args: true,
    usage: '<kisses|hugs|dominations>',
    async execute(message, args) {
        const { Member } = require('..');

        let membersdb = await Member.findAll();

        let dbsearch

        switch (args) {
            case 'kisses':
                dbsearch = kissys
                break;
            case 'hugs':
                dbsearch = hugged
                break;
            case 'dominations':
                dbsearch = dominated
                break;
            default:
                message.channel.send('you need to provide a valid argument!\nsee `help leaderboard')
                break;
        }

        // TODO incomplete!
        membersdb.sort(function (a, b) {
            return b[dbsearch] - a[dbsearch];
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