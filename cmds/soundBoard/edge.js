const Commando = require('discord.js-commando')
const path = require('path')

module.exports = class BangCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'edge',
            group: 'soundboard',
            memberName: 'edge',
            description: ':musical_note: Do not cum :musical_note: ',
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
        message.channel.send(":musical_note: Do not cum :musical_note:");
        const connection = await voice.channel.join();

        const dispatcher = connection.play('./effects/edge.mp3', {volume: 1.2});

        dispatcher.on('start', () =>{
            console.log('edge is playing');
        });

        dispatcher.on('finish', () =>{
            console.log('edge is done playing');
            voice.channel.leave();
        });
        

    }
}