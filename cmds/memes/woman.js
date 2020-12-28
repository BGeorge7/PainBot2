const Commando = require('discord.js-commando')
const path = require('path')

module.exports = class WomanCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'woman',
            group: 'memes',
            memberName: 'woman',
            description: ':musical_note: Bernie is tired of woman :musical_note: ',
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
        message.channel.send(":musical_note: I\'m tired of woman :musical_note:");
        const connection = await voice.channel.join();

        const dispatcher = connection.play('./effects/woman.mp3');

        dispatcher.on('start', () =>{
            console.log('Woman is playing');
        });

        dispatcher.on('finish', () =>{
            console.log('Woman is done playing');
            voice.channel.leave();
        });

    }
}