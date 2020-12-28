const Commando = require('discord.js-commando')

module.exports = class ThatcherCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'thatcher',
            group: 'memes',
            memberName: 'thatcher',
            description: 'Checks if thatcher is dead',
        })
    }

    async run(message)
    {
        message.channel.send(":crab: :crab: :crab: :crab: :crab: :crab: :crab: :crab:");
        message.reply(`As of ${new Date().toLocaleDateString()} She's still dead`);
        message.channel.send("https://tenor.com/view/thatcher-sans-fortnite-thatcher-sans-grave-gif-18802854");
        message.channel.send(":crab: :crab: :crab: :crab: :crab: :crab: :crab: :crab:");
    }
}