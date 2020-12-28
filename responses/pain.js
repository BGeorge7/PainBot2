const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');

module.exports = {

    run: async function(message)
    {
        message.channel.send('<:painchamp:764605948253044736>');
        message.delete();
    }
}