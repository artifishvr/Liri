module.exports = {
    name: 'leaderboard',
    description: 'global top 5 leaderboard',
    args: true,
    usage: '<kisses|hugs|dominations>',
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
            default:
                return message.channel.send('you need to provide a valid argument!\nsee `help leaderboard');
        }

        membersdb.sort(function (a, b) {
            return b[dbsearch] - a[dbsearch];
        });

        let mostKissed = membersdb.slice(0, 5);
        console.log(mostKissed)

        message.channel.send(
            `**Leaderboard - ${args[0]}**
            \n1. <@${mostKissed[0].userid || "nobody"} > with **${mostKissed[0].kissys || "0"}** ${args[0]}
            \n2. <@${mostKissed[1].userid || "nobody"}> with **${mostKissed[1].kissys || "0"}** ${args[0]}
            \n3. <@${mostKissed[2].userid || "nobody"}> with **${mostKissed[2].kissys || "0"}** ${args[0]}
            \n4. <@${mostKissed[3].userid || "nobody"}> with **${mostKissed[3].kissys || "0"}** ${args[0]}
            \n5. <@${mostKissed[4].userid || "nobody"}> with **${mostKissed[4].kissys || "0"}** ${args[0]}`,
            { allowedMentions: { parse: [] } });
    },
};