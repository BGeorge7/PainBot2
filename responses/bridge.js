const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
const spawn = require("child_process").spawn;

module.exports = {

    run: async function(message, mainDir)
    {
        const bridgeDir = mainDir + "\\features\\bridge\\";
        console.log(message.author.username.toString() + " Said the N word (" + message.content + ")");
        message.channel.send('<:FeelsWeirdMan:700131181588643902>');
        pfp = message.author.avatarURL.toString();
        let pfpString = message.author.avatarURL().toString(); //gets the url string
        let pfpStringLength = pfpString.length; //length of the string
        let pfpStringNPng = pfpString.substring(0, pfpStringLength-4); //substring with webp removed

        pfpStringNPng = pfpStringNPng + "png";

        pfpStringNPng = pfpStringNPng.replace("https", "http"); //make link http

        async function download() {
            const response = await fetch(pfpStringNPng);
            const buffer = await response.buffer();
            fs.writeFile(mainDir + "\\features\\bridge\\user_pfp\\" + message.author.id.toString() + ".png", buffer, () => 
                console.log('Downloaded image for: ' + message.author.id.toString()));
        
        }

        await download(); //calls the download image function

        const pythonProcess = spawn('python',[bridgeDir + "bridge_paste.py", bridgeDir + "user_pfp\\" + message.author.id.toString() + ".png", message.author.id.toString() + ".png"]);
        //console.log(".\\user_pfp\\" + message.author.id.toString() + ".png");

        console.log("Bridge Dir: " + bridgeDir + "bridge_paste.py", bridgeDir + "user_pfp\\" + message.author.id.toString() + ".png", message.author.id.toString() + ".png");

        pythonProcess.stdout.on('data', (data) => {
            const attachment = new Discord.MessageAttachment(mainDir + "\\features\\bridge\\Bridged_Images\\Bridged"+ message.author.id.toString()+ ".png");
            message.channel.send(attachment);
        });
        message.delete();
    
    }

}