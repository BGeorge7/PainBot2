const Commando = require('discord.js-commando')
const path = require('path')

module.exports = class BangCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'bang',
            group: 'memes',
            memberName: 'bang',
            description: ':musical_note: We\'ll bang ok :musical_note: ',
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
        message.channel.send(":musical_note: I\'m banging :musical_note:");
        const connection = await voice.channel.join();

        const dispatcher = connection.play('./effects/bang.mp3', {volume: 1.9});

        dispatcher.on('start', () =>{
            console.log('Bang is playing');
        });

        dispatcher.on('finish', () =>{
            console.log('Bang is done playing');
            voice.channel.leave();
        });
        

    }
}