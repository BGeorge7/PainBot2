require('module-alias/register');

const { MongoClient } = require('mongodb').MongoClient;
const MongoDBProvider = require('commando-provider-mongo');
const path = require('path');
const Commando = require('discord.js-commando');

const config = require('./config.json');
const plainResponses = require("./responses/respond.js");

let selfID

config.mainDir = __dirname;

const client = new Commando.CommandoClient({
  owner: '142756402912428032',
  commandPrefix: config.prefix,
});

client.on('ready', async () => {
  console.log('The client is ready!');
  
  client.registry
    .registerGroups([
      ['misc', 'misc commands'],
      ['moderation', 'moderation commands'],
      ['memes', 'meme commands'],
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'cmds')); //importing of the commands folder

  selfID = client.user.id 
  if(selfID === config.BetaBranchID)
  {
    console.log("Running on the beta branch")
    client.user.setActivity("VSCode and Pain");
  }
  else if(selfID === config.ProductionBranchID)
  {
    console.log("Running on the production branch")
    client.user.setActivity("Type -help");
  }

});

client.on('message', async message => { // for non prefix commands\


    if(message.content.startsWith(config.prefix) || message.author.bot) return;

    if(selfID === config.ProductionBranchID && message.guild.member(config.BetaBranchID).presence.status != "offline")
    {
      console.log("Beta branch is online.\nIgnoring message...")
      return;
    }

    //console.log(client.users.cache.get(config.ProductionBranchID).presence.status); //<- This is how you read info on a user that the bot is in a server with
    //console.log(message.guild.member(config.ProductionBranchID).presence.status) // <- this one is only works on the particular guild that the message was sent on

    //-----------Code to run goes here--------------//
    plainResponses.run(message, config.mainDir);
});

client.login(config.token);