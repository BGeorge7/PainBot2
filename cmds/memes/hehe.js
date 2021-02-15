const Commando = require('discord.js-commando')
const path = require('path')

module.exports = class HeheCumCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'hehe',
            group: 'memes',
            memberName: 'hehe',
            description: ':musical_note: Cardi B Laugh :musical_note: ',
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
        message.channel.send(":musical_note: hehehehe :musical_note:");
        const connection = await voice.channel.join();

        const dispatcher = connection.play('./effects/hehe.mp3',{volume: 0.7});

        dispatcher.on('start', () =>{
            console.log('hehe is playing');
        });

        dispatcher.on('finish', () =>{
            console.log('hehe is done playing');
            voice.channel.leave();
        });

    }
}