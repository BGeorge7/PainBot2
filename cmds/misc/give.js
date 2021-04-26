const Commando = require('discord.js-commando')
const path = require('path')
let reqPath = path.join(__dirname, '../../');
let fs = require("fs");

const userStatesInit = require(reqPath + './/utils/userStatesInit.js');

module.exports = class Give extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'give',
            group: 'misc',
            memberName: 'give',
            description: 'Lets users trade currency.',
            argsType: 'multiple',
            argsPromptLimit: 0,
            args: [
                {
                    key: 'user',
                    prompt: 'Which user do you want to give money to?',
                    type: 'user'
                },
                {
                    key: 'bal',
                    prompt: 'How much money would you like to give?',
                    type: 'integer'
                }
            ]
        })
    }

    async run(message, { user, bal })
    {
        if(bal <= 0)
        {
            message.reply("Please enter an amount greater than 0");
            return;
        }
        if(message.member.id == user.id)
        {
            message.reply("You tried.");
            return;
        }

        let userGiver = userStatesInit.findUser(message.guild.id, message.member.id)
        let userReceiver = userStatesInit.findUser(message.guild.id, user.id);

        let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8')); //open the file
        
        if(userStates.Servers[userGiver.guildIndex].Users[userGiver.userIndex].Balance-bal < 0 )
        {
            message.reply("Error insufficient funds.");
            return;
        }
        else
        {
            userStates.Servers[userReceiver.guildIndex].Users[userReceiver.userIndex].Balance += bal;
            userStates.Servers[userGiver.guildIndex].Users[userGiver.userIndex].Balance -= bal;
        }

        let data = JSON.stringify(userStates, null, 4);
        fs.writeFileSync(reqPath + '/info/userStates.json', data);
        
        message.channel.send(`${bal} added to user **${user}**!`);

    }
}