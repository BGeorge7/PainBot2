const Commando = require('discord.js-commando')
const path = require('path')
let reqPath = path.join(__dirname, '../../');
let fs = require("fs");

const userStatesInit = require(reqPath + './/utils/userStatesInit.js');

module.exports = class AddBal extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'addbal',
            group: 'moderation',
            memberName: 'addbal',
            description: 'adds balance to a user.',
            argsType: 'multiple',
            ownerOnly: true,
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
        
        console.log("Owner added " + bal + " to user " + user.id)

        let userLoc = userStatesInit.findUser(message.guild.id, user.id);

        let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8')); //open the file
        
        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += bal;

        let data = JSON.stringify(userStates, null, 4);
        fs.writeFileSync(reqPath + '/info/userStates.json', data);
        
        message.channel.send(`${bal} added to user **${user}**!`);

    }
}