const Commando = require('discord.js-commando')
const path = require('path')
let reqPath = path.join(__dirname, '../../');
let fs = require("fs");

const userStatesInit = require(reqPath + './/utils/userStatesInit.js');

module.exports = class UserBal extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'userbal',
            group: 'moderation',
            memberName: 'userbal',
            description: 'adds balance to a user.',
            argsType: 'multiple',
            ownerOnly: true,
            argsPromptLimit: 0,
            args: [
                {
                    key: 'user',
                    prompt: 'Who\'s balance do you want to see?',
                    type: 'user'
                }
            ]
        })
    }

    async run(message, { user })
    {

        let userLoc = userStatesInit.findUser(message.guild.id, user.id);

        let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8')); //open the file

        message.channel.send(`**${user}** has a balance of **${userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance}**!`);

    }
}