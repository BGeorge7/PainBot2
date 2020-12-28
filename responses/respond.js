const Discord = require('discord.js');
const fs = require('fs');
const bridge = require('./bridge.js');
const frank = require('./frank.js');
const pain = require('./pain.js');

module.exports = {

    run: async function(message, mainDir) //This is not part of commando I just created this to hanndle non prefix commands.
    {
        dict = require(mainDir + "\\dict.json")
        bridgeDict = dict.Bridge.Dictionary

        text = message.content.toLowerCase();

        if(text.includes(bridgeDict[5], 0)) //Checks if the message contains the key word in the dictionary json
        {
            bridge.run(message, mainDir);
            return;
        }
        for(i = 0; i < bridgeDict.length; i++)//checks if the message in its entirety is any of the key words
        {
            if(text === bridgeDict[i])
            {
                bridge.run(message, mainDir);
                return;
            }
        }

        if(text === 'pain')
        {
            pain.run(message);
        }
        else if(text === "https://cdn.discordapp.com/attachments/301853447886471169/782725751216406578/video0.mp4")
        {
            frank.run(message)
        }
    
    }
}