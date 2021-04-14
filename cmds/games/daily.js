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
            argsType: 'multiple',
        })
    }

    async run(message, args)
    {
        let userLoc = userStatesInit.findUser(message.guild.id, message.member.id);

        let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'));
        
        // if(args[0] = 'y')
        // {
            
        //     let time = Date.now();
        //     let date = (time - (time % 86400000));
        //     message.channel.send(date.toLocaleString('en-GB', { hour12:false } ));
        //     //message.channel.send(new Date(Date.UTC(c.getFullYear(),c.getMonth(), c.getDate())));
        //     return;
        // }

        if(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch == undefined)
        {

            let time = Date.now();
            let date = (time - (time % 86400000));

            userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance = 100;
            userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch = JSON.stringify(date)

            message.reply("+100!\nYour new balance is " + userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance)

            let data = JSON.stringify(userStates, null, 4);
            fs.writeFileSync(reqPath + '/info/userStates.json', data);

        }
        else
        {
            let time = Date.now();
            let date = (time - (time % 86400000));

            const lastEcpoch = BigInt(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch) + BigInt(86400000);
            if(lastEcpoch <= BigInt(date))
            {
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += 100;
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch = JSON.stringify(date)

                message.reply("+100!\nYour new balance is " + userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance)

                let data = JSON.stringify(userStates, null, 4);
                fs.writeFileSync(reqPath + '/info/userStates.json', data);

            }
            else
            {
                let time = Date.now();
                const lastEcpoch = BigInt(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch) + BigInt(86400000);

                let timeLeft = parseFloat(BigInt(lastEcpoch) - BigInt(time));
                message.reply("Your daily is not ready yet! \n" + (timeLeft/3600000).toPrecision(3) + " Hours left till next daily.");

            }
        }
        
    }
}