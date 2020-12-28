const Commando = require('discord.js-commando')
const path = require('path')

module.exports = class BangCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'woo',
            group: 'memes',
            memberName: 'woo',
            description: ':musical_note: Woo yeah baby :musical_note: ',
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
        message.channel.send(":musical_note: wooooooo :musical_note:");
        const connection = await voice.channel.join();

        const dispatcher = connection.play('./effects/woo.mp3', {volume: 0.9});

        dispatcher.on('start', () =>{
            console.log('Woo is playing');
        });

        dispatcher.on('finish', () =>{
            console.log('Woo is done playing');
            voice.channel.leave();
        });
        

    }
}