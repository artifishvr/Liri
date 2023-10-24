const { Client, GatewayIntentBits, ActivityType, Collection } = require("discord.js");
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
dotenv.config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/db.sqlite',
    logging: false,
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
    },
    hugged: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    dominated: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    deaths: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
});

(async () => {
    if (!fs.existsSync(path.join(__dirname, 'db'))) fs.mkdirSync(path.join(__dirname, 'db'));

    try {
        await sequelize.authenticate();

        console.log('Connected to database successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    };

    await sequelize.sync({ alter: true });
})();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildModeration,
    ],
    allowedMentions: { parse: [] }
});

const prefix = process.env.PREFIX || "!";

client.commands = new Collection();
const cooldowns = new Collection();

client.on("ready", () => {
    updatePresence()

    console.log(`Logged in as ${client.user.tag}!`);

    setInterval(updatePresence, 1000 * 60 * 60);
})


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.on("messageCreate", async (message) => {

    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        ?? client.commands.find(cmd => cmd.aliases?.includes(commandName));

    if (!command) return;

    if (command.guildOnly && !message.guild) {
        return message.reply('You can\'t use that command in DMs');
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`chill out! wait ${timeLeft.toFixed(1)} more second(s) before trying to \`${command.name}\` again.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

function updatePresence() {
    client.user.setPresence({
        activities: [{ name: `kisses :3`, type: ActivityType.Competing }],
        status: 'dnd',
    });
}

client.login(process.env.DISCORD_CLIENT_TOKEN);
module.exports = { Member, prefix };