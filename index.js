require('module-alias/register');

const path = require('path');
const Commando = require('discord.js-commando');

const config = require('./config.json');
const plainResponses = require("./responses/respond.js");

config.mainDir = __dirname;

const client = new Commando.CommandoClient({
  owner: '142756402912428032',
  commandPrefix: config.prefix,
});

client.on('ready', async () => {
  console.log('The client is ready!');

  client.user.setPresence({
    game: { 
        name: 'VS Code',
        type: 'Waiting for Frank to post the shitty meme again'
    },
  })

  client.registry
    .registerGroups([
      ['misc', 'misc commands'],
      ['moderation', 'moderation commands'],
      ['memes', 'meme commands'],
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'cmds')); //importing of the commands folder

});

client.on('message', async message => { // for non prefix commands\

    if(message.content.startsWith(config.prefix) || message.author.bot) return;
    plainResponses.run(message, config.mainDir);
});

client.login(config.token);