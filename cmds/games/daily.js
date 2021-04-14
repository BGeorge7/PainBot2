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

    async run(message, args)
    {
        let userLoc = userStatesInit.findUser(message.guild.id, message.member.id);

        let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8')); //open the file

        if(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch == undefined) //checks if the variable exists
        {

            let time = Date.now();
            let date = (time - (time % 86400000)); //takes the current time and rounds it down to the nearsest day. (In epoch format)

            userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance = 100;
            userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch = JSON.stringify(date)
            userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].dailyStreak = 1;

            message.reply("+100!\nYour new balance is " + userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance)

            let data = JSON.stringify(userStates, null, 4);
            fs.writeFileSync(reqPath + '/info/userStates.json', data);

        }
        else
        {
            let time = Date.now();
            let date = (time - (time % 86400000)); //takes the current time and rounds it down to the nearsest day. (In epoch format)

            const lastEcpoch = BigInt(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch) + BigInt(86400000); //saved date plus 1 day
            if(lastEcpoch <= BigInt(date)) //compare the two days
            {
                if(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].dailyStreak == undefined) //making sure that the dailyStreak variable exists
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].dailyStreak = 1;
                if(lastEcpoch == BigInt(date)) //if the user IS on a streak
                {
                    if(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].dailyStreak <= 5) //checks if the users streak is less than 5
                    {
                        
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += 100 * userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].dailyStreak
                        message.reply("+" + 100 * userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].dailyStreak 
                        +"!\nYour new balance is " + userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance);

                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].dailyStreak += 1;

                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch = JSON.stringify(date)
                    }
                    else //if it is more than 5 it limits the bonus to 500
                    {
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += 100 * 5;
                        message.reply("+" + 100 * 5 
                        +"!\nYour new balance is " + userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance);

                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].dailyStreak += 1;

                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch = JSON.stringify(date)
                    }
                }
                else if(lastEcpoch < BigInt(date)) //if the user is NOT on a streak
                {
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].dailyStreak = 1;
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += 100;
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch = JSON.stringify(date);
                    message.reply("+100!\nYour new balance is " + userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance);
                }
                

                let data = JSON.stringify(userStates, null, 4);
                fs.writeFileSync(reqPath + '/info/userStates.json', data);

            }
            else
            {
                const lastEcpoch = BigInt(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].lastDailyEpoch) + BigInt(86400000);

                let timeLeft = parseFloat(BigInt(lastEcpoch) - BigInt(time)); //reset time minus current time.
                message.reply("Your daily is not ready yet! \n" + (timeLeft/3600000).toPrecision(3) + " Hours left till next daily.");

            }
        }
        
    }
}