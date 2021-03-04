const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');

module.exports = {

    run: async function(message)
    {
        message.reply("https://thankschamp.s3.us-east-2.amazonaws.com/video0.mp4")
    }
}