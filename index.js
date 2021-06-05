require('module-alias/register');

let fs = require("fs");
const path = require('path');
const Commando = require('discord.js-commando');
const Discord  = require('discord.js');

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
      ['soundboard', 'sound board commands'],
      ['games', 'game commands']
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

  let timerId = setInterval(() => {
    //console.log("TEST!");
    //channel = client.channels.cache.get('766432412955181076');
    //channel.send("HELLO!");

    let currentTime = Math.floor(new Date().getTime()/1000.0);

    let info = JSON.parse(fs.readFileSync('.//info/userStates.json', 'utf8')); //open the file
    for(let i = 0;i < info.Servers.length;i++)
    {
      for(let j = 0;j < info.Servers[i].Reminders.length;j++)
      {
        //console.log(`${currentTime >= info.Servers[i].Reminders[j].ReminderTime} Current time ${currentTime} <= My Time: ${info.Servers[i].Reminders[j].ReminderTime}`);
        if(currentTime >= info.Servers[i].Reminders[j].ReminderTime)
        {
          channel = client.channels.cache.get(info.Servers[i].Reminders[j].ChannelID);

          let embedDisplay = { 
            color: '#264160',
            title: `Reminder for ${channel.guild.members.cache.get(info.Servers[i].Reminders[j].UserID).user.username}`,
            thumbnail: {
                url: 'https://thankschamp.s3.us-east-2.amazonaws.com/bell.png',
            },
            author: {
                name: 'Pain Bot',
                icon_url: 'https://thankschamp.s3.us-east-2.amazonaws.com/PainChamp.png',
                url: 'https://www.google.com',
            },
            description: `**${info.Servers[i].Reminders[j].Reminder}**`,
            timestamp: new Date(),
          };

          channel.send(`Hey, ${channel.guild.members.cache.get(info.Servers[i].Reminders[j].UserID)} here is your reminder: `);
          channel.send({embed: embedDisplay});

          info.Servers[i].Reminders = info.Servers[i].Reminders.filter((element) =>{
            return element.ReminderTime != info.Servers[i].Reminders[j].ReminderTime;
          });

          let data = JSON.stringify(info, null, 4);
          fs.writeFileSync('.//info/userStates.json', data);
        }
      }
    }
  }, 800);


});

client.on('message', async message => { // for non prefix commands\


    if(message.content.startsWith(config.prefix) || message.author.bot) return;

    try {
      if(selfID === config.ProductionBranchID && message.guild.member(config.BetaBranchID).presence.status != "offline")
      {
        console.log("Beta branch is online.\nIgnoring message...")
        return;
      }
    } catch (error) {
      console.log("Exception caught: Beta branch not on this server");
    }
   

    //console.log(client.users.cache.get(config.ProductionBranchID).presence.status); //<- This is how you read info on a user that the bot is in a server with
    //console.log(message.guild.member(config.ProductionBranchID).presence.status) // <- this one is only works on the particular guild that the message was sent on

    //-----------Code to run goes here--------------//
    plainResponses.run(message, config.mainDir);
});

client.login(config.token);