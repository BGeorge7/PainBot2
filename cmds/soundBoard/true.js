const Commando = require('discord.js-commando')

module.exports = class TrollingCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'true',
            group: 'soundboard',
            memberName: 'true',
            description: ':musical_note: Yeah that true dude :musical_note: ',
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
        message.channel.send(":musical_note: Yeah thats true :musical_note:");
        const connection = await voice.channel.join();

        const dispatcher = connection.play('./effects/true.mp3', {volume: 1.0});

        dispatcher.on('start', () =>{
            console.log('True is playing');
        });

        dispatcher.on('finish', () =>{
            console.log('True is done playing');
            voice.channel.leave();
        });
        

    }
}