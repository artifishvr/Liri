module.exports = {
    name: 'leaderboard',
    description: 'global top 5 leaderboard',
    args: true,
    usage: '<kisses|hugs|dominations|deaths>',
    async execute(message, args) {
        const { Member } = require('..');

        let membersdb = await Member.findAll();

        let dbsearch

        switch (args[0]) {
            case 'kisses':
                dbsearch = "kissys"
                break;
            case 'hugs':
                dbsearch = "hugged"
                break;
            case 'dominations':
                dbsearch = "dominated"
                break;
            case 'deaths':
                dbsearch = "deaths"
                break;
            default:
                return message.channel.send('you need to provide a valid argument!\nsee `help leaderboard');
        }

        membersdb.sort(function (a, b) {
            return b[dbsearch] - a[dbsearch];
        });

        let mostKissed = membersdb.slice(0, 4);
        
        try {
        message.channel.send(
            `**Leaderboard - ${args[0]}**
            \n1. <@${mostKissed[0].userid}> with **${mostKissed[0][dbsearch] || "0"}** ${args[0]}
            \n2. <@${mostKissed[1].userid}> with **${mostKissed[1][dbsearch] || "0"}** ${args[0]}
            \n3. <@${mostKissed[2].userid}> with **${mostKissed[2][dbsearch] || "0"}** ${args[0]}
            \n4. <@${mostKissed[3].userid}> with **${mostKissed[3][dbsearch] || "0"}** ${args[0]}
            \n5. <@${mostKissed[4].userid}> with **${mostKissed[4][dbsearch] || "0"}** ${args[0]}`,
            { allowedMentions: { parse: [] } });
        } catch (error) {
            console.error(error)
        }
    },
};