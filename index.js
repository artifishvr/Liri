const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildModeration,
    ],
});

const prefix = process.env.PREFIX || "!";

function updatePresence() {
    client.user.setPresence({
        activities: [{ name: `kisses :3`, type: ActivityType.Competing }],
        status: 'dnd',
    });
}

client.on("ready", () => {
    updatePresence()

    console.log(`Logged in as ${client.user.tag}!`);

    setInterval(updatePresence, 1000 * 60 * 60);
})

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/db.sqlite'
});

const Member = sequelize.define('Member', {
    userid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kissys: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
});

(async () => {
    try {
        await sequelize.authenticate();

        console.log('Connected to database successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    };

    await Member.sync();
})();

// Create the db directory if it doesn't exist
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

client.on("messageCreate", async (message) => {

    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let memberid = args[0].replace(/[\\<>@#&!]/g, "");
    let member = message.guild.members.cache.get(memberid);

    if (!member) {
        await message.guild.members.fetch()
        member = message.guild.members.cache.get(args);
    };

    if (command === "kiss") {

        if (!memberid) {
            message.channel.send("you gotta kiss someone!!");
            return;
        }
        if (memberid == message.author.id) {
            message.channel.send("get someone else to kiss you <:sad:1084023335609978890>");
            return;
        }

        let [user, created] = await Member.findOrCreate({ where: { userid: memberid } });
        if (created) console.log(`New member added to the database: ${user.userid}`);

        const newkisses = user.kissys + 1;

        await Member.update({ kissys: newkisses }, {
            where: {
                userid: memberid
            }
        });

        message.delete();

        const kissingmember = message.guild.members.cache.get(message.author.id);

        try {
            message.channel.send(`**${kissingmember.displayName}** kissed **${member.displayName}** ❤️\n**${member.displayName}** has now been kissed **${newkisses}** times :3`);
        } catch (error) {
            console.log(error);
        };
    };

    if (message.content.startsWith("!mostkissed")) {
        return message.channel.send("this command is disabled for now");
        let membersdb = Members.getAll();

        membersdb.sort(function (a, b) {
            return b.kissys - a.kissys;
        });

        let mostKissed = membersdb.slice(0, 3);

        message.delete();

        message.channel.send(`**Most Kissed:**
            \n1. <@${mostKissed[0].id}> with **${mostKissed[0].kissys}** kisses
            \n2. <@${mostKissed[1].id}> with **${mostKissed[1].kissys}** kisses
            \n3. <@${mostKissed[2].id}> with **${mostKissed[2].kissys}** kisses`, { allowedMentions: { parse: [] } });
    }
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
