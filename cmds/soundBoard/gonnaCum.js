const Commando = require('discord.js-commando')
const path = require('path')

module.exports = class GonnaCumCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'cum',
            group: 'soundboard',
            memberName: 'cum',
            description: ':musical_note: I\'m gonna cum :musical_note: ',
        })
    }

    async run(message)
    {
        
        const {voice} = message.member
        
        if(message.member.voice.channel == null)
        {
            message.reply("You are not in a voice channel.");
            return;
        }
        message.channel.send(":musical_note: I\'m cumming :musical_note:");
        const connection = await voice.channel.join();

        const dispatcher = connection.play('./effects/cum.mp3');

        dispatcher.on('start', () =>{
            console.log('Cum is playing');
        });

        dispatcher.on('finish', () =>{
            console.log('Cum is done playing');
            voice.channel.leave();
        });

    }
}