const Commando = require('discord.js-commando')
const path = require('path')

module.exports = class ThiccCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'thicc',
            group: 'memes',
            memberName: 'thicc',
            description: ':musical_note: DAMN BOY SHE THICC :musical_note: ',
        })
    }

    async run(message)
    {
        
        const {voice} = message.member;
        
        if(message.member.voice.channel == null)
        {
            message.reply("You are not in a voice channel.");
            return;
        }
        message.channel.send(":musical_note: THICC :musical_note:");
        const connection = await voice.channel.join();

        const dispatcher = connection.play('./effects/thicc.mp3',{volume: 0.4});

        dispatcher.on('start', () =>{
            console.log('Thicc is playing');
        });

        dispatcher.on('finish', () =>{
            console.log('Thicc is done playing');
            voice.channel.leave();
        });

    }
}