const Commando = require('discord.js-commando')

module.exports = class CapCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'cap',
            group: 'soundboard',
            memberName: 'cap',
            description: ':musical_note: I accuse you of capping! :musical_note: ',
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
        message.channel.send(":musical_note: I accuse you of capping! :musical_note:");
        const connection = await voice.channel.join();

        const dispatcher = connection.play('./effects/cap.mp3', {volume: 0.6});

        dispatcher.on('start', () =>{
            console.log('Cap is playing');
        });

        dispatcher.on('finish', () =>{
            console.log('Cap is done playing');
            voice.channel.leave();
        });
        
    }
}