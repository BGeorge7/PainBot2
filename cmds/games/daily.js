const Commando = require('discord.js-commando');
let fs = require("fs");
let path = require("path");
let reqPath = path.join(__dirname, '../../'); //get directory path of root folder for the bot

const userStatesInit = require(reqPath + './/utils/userStatesInit.js');

module.exports = class DailyCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'daily',
            group: 'games',
            memberName: 'daily',
            description: 'Gives you your daily points',
        })
    }

    async run(message)
    {
        let userLoc = userStatesInit.findUser(message.guild.id, message.member.id);

        let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'));

        if(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch == undefined)
        {

            userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance = 100;
            userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch = JSON.stringify(Date.now())

            message.reply("+100!\nYour new balance is " + userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance)

            let data = JSON.stringify(userStates, null, 4);
            fs.writeFileSync(reqPath + '/info/userStates.json', data);

        }
        else
        {
            const lastEcpoch = BigInt(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch) + BigInt(86400);
            if(lastEcpoch < BigInt(Date.now()))
            {
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += 100;
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch = JSON.stringify(Date.now())

                message.reply("+100!\nYour new balance is " + userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance)

                let data = JSON.stringify(userStates, null, 4);
                fs.writeFileSync(reqPath + '/info/userStates.json', data);

            }
            else
            {
                message.reply("Your daily is not ready yet!")
            }
        }
        
    }
}