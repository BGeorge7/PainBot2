const Commando = require('discord.js-commando');
let fs = require("fs");
let path = require("path");
let reqPath = path.join(__dirname, '../../'); //get directory path of root folder for the bot

const userStatesInit = require(reqPath + './/utils/userStatesInit.js');

module.exports = class DailyCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'bal',
            aliases: ['balance', 'bal'],
            group: 'misc',
            memberName: 'balance',
            description: 'balance',
        })
    }

    async run(message)
    {
        let userLoc = userStatesInit.findUser(message.guild.id, message.member.id);

        let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'));

        message.reply("Your current balance is " + userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance);
        
    }
}