const Commando = require('discord.js-commando')
const path = require('path')

module.exports = class TrollingCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'trolling',
            group: 'soundboard',
            memberName: 'trolling',
            description: ':musical_note: We do a little trolling :musical_note: ',
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
        message.channel.send(":musical_note: I\'m trolling :musical_note:");
        const connection = await voice.channel.join();

        const dispatcher = connection.play('./effects/trolling.mp3', {volume: 1.0});

        dispatcher.on('start', () =>{
            console.log('Trolling is playing');
        });

        dispatcher.on('finish', () =>{
            console.log('Trolling is done playing');
            voice.channel.leave();
        });
        

    }
}