const Commando = require('discord.js-commando')
const path = require('path')

module.exports = class kekwCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'kekw',
            group: 'soundboard',
            memberName: 'kekw',
            description: ':musical_note: kekw laugh :musical_note: ',
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
        message.channel.send(":musical_note: kekw :musical_note:");
        const connection = await voice.channel.join();

        const dispatcher = connection.play('./effects/KEKW.mp3');

        dispatcher.on('start', () =>{
            console.log('kekw is playing');
        });

        dispatcher.on('finish', () =>{
            console.log('kekw is done playing');
            voice.channel.leave();
        });

    }
}