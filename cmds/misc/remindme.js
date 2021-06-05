const Commando = require('discord.js-commando');
let fs = require("fs");
let path = require("path");
let reqPath = path.join(__dirname, '../../'); //get directory path of root folder for the bot

const userStatesInit = require(reqPath + './/utils/userStatesInit.js');

let template = {
    UserID: "0000000000",
    ChannelID:"000000",
    ReminderTime: "1",
    Reminder: ""
}

module.exports = class LeaderboardCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'remindme',
            aliases: ['rdm'],
            group: 'misc',
            memberName: 'remindme',
            description: 'creates a reminder on a specific time',
            argsType: 'multiple',
            argsPromptLimit: 0,
            args: [

                {
                    key: 'time',
                    prompt: 'How much money would you like to give?',
                    type: 'string'
                },
                {
                    key: 'reminder',
                    prompt: 'Which user do you want to give money to?',
                    type: 'string'
                },
                
            ]
        })
    }

    async run(message, {time, reminder})
    {
        let serverLoc = userStatesInit.findSever(message.guild.id);

        const regex = '^([0-9]+[dsym]{1})$'
        let regexCheck = time.match(regex);

        if(!regexCheck)
        {
            message.channel.send("Incorrect formating\n"+
            "Command: -rdm <time <number><d,m,y> > <reminder message>\n"+
            "Example: -rdm 2d check my email");
            return;
        }

        let copy = JSON.parse(JSON.stringify(template));

        copy.UserID = message.member.id;
        copy.ChannelID = message.channel.id;
        copy.ReminderTime = translateTime(time);
        copy.Reminder = reminder;

        let serverStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8')); //open the file

        serverStates.Servers[serverLoc.guildIndex].Reminders.push(copy);
        let data = JSON.stringify(serverStates, null, 4);
        fs.writeFileSync(reqPath + '/info/userStates.json', data);

        console.log(`User: ${message.member.id} has set a reminder`);

        let timeText;
        switch (time[time.length-1])
        {
            case 's':
                timeText = "Second(s)";
                break;
            case 'm':
                timeText = "Minute(s)";
                break;
            case 'd':
                timeText = "Day(s)";
                break;
            case 'y':
                timeText = "Year(s)";
                break;
        }
        
        message.reply(`Reminding you in **${time.slice(0,time.length-1)} ${timeText}** to **${reminder}**`);

    } 
    
}
//returns the time that the alarm is to go off.
function translateTime(time)
{
    let currentTime = Math.floor(new Date().getTime()/1000.0);
    let num = parseInt(time.slice(0,time.length-1));
    switch (time[time.length-1])
    {
        case 's':
            return (1 * num) + currentTime;
        case 'm':
            return (60 * num) + currentTime;
        case 'd':
            return (86400 * num) + currentTime;
        case 'y':
            return (31536000 * num) + currentTime;
    }

}