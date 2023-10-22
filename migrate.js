const SimplDB = require('simpl.db');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');


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

        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    };

    await Member.sync({ force: true });


const dbpath = path.resolve('./db/');
const db = new SimplDB({
    dataFile: path.join(dbpath, 'db.json'),
    collectionsFolder: path.join(dbpath, 'collections'),
});

const Members = db.createCollection('members', {
    attemptedBans: 0,
    successfulBans: 0,
    kissys: 0,
});

let membersdb = Members.getAll();


membersdb.forEach(async member => {
    await Member.create({
        userid: member.id,
        kissys: member.kissys
    })
});


})();