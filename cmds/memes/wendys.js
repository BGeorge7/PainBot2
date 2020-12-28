const Commando = require('discord.js-commando')

module.exports = class WendysCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'wendys',
            group: 'memes',
            memberName: 'wendys',
            description: 'Drags nuts accross your chin',
        })
    }

    async run(message)
    {
        //message.reply('wen deez nuts go down your throat :joy:'); Reply @mentions the user
        message.channel.send('wen deez nuts go down your throat :joy:');
    }
}