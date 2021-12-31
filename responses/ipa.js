const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');

module.exports = {

    run: async function(message)
    {
        message.channel.send("https://imageproxy.ifunny.co/crop:x-20,resize:640x,quality:90x75/images/df02212f44f46e9e3132f005b0e0d1e8af627312f559050c380fa845f233a36f_1.jpg")
    }
}