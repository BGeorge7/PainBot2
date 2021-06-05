const Commando = require('discord.js-commando');
let fs = require("fs");
let path = require("path");
let reqPath = path.join(__dirname, '../../'); //get directory path of root folder for the bot

const userStatesInit = require(reqPath + './/utils/userStatesInit.js');

module.exports = class LeaderboardCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'leaderboard',
            aliases: ['leaderboard', 'lb'],
            group: 'misc',
            memberName: 'leaderboard',
            description: 'displays the top user balances',
        })
    }

    async run(message)
    {
        let userLoc = userStatesInit.findUser(message.guild.id, message.member.id);

        let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'));

        let allUsers = JSON.parse(JSON.stringify(userStates.Servers[userLoc.guildIndex].Users));
        
        let bubbleSort = (inputArr) => {
            let len = inputArr.length;
            for (let i = 0; i < len; i++) {
                for (let j = 0; j < len-1; j++) {
                    if (inputArr[j].Balance < inputArr[j + 1].Balance) {
                        let tmp = inputArr[j];
                        inputArr[j] = inputArr[j + 1];
                        inputArr[j + 1] = tmp;
                    }
                }
            }
            return inputArr;
        };
        
        bubbleSort(allUsers);

        let embed = {
            color: '#FFD700',
            title: "Top user balances!",
            thumbnail: {
                url: 'https://thankschamp.s3.us-east-2.amazonaws.com/podium.png',
            },
            author: {
                name: 'Pain Bot',
                icon_url: 'https://thankschamp.s3.us-east-2.amazonaws.com/PainChamp.png',
                url: 'https://www.google.com',
            },
            fields:[
            ],
            timestamp: new Date(),
        };

        let max = allUsers.length < 5 ? allUsers.length : 5;

        for(let i = 0; i < max; i++)
        {
            let emote;
            switch (i) {
                case 0:
                    emote = ":first_place: ";
                    break;
                case 1:
                    emote = ":second_place: ";
                    break;
                case 2:
                    emote = ":third_place: ";
                    break;
                default:
                    emote = "**" + (i+1) + ".**";
            }

            embed.fields.push({
                name: (i === 0) ? 'User' : '\u200B',
                value: emote + (message.guild.members.cache.get(allUsers[i].UserID).nickname ? message.guild.members.cache.get(allUsers[i].UserID).nickname : message.guild.members.cache.get(allUsers[i].UserID).user.username),
                inline: true
            },
            {
                name: (i === 0) ? 'Balance' : '\u200B',
                value: allUsers[i].Balance + "\t:coin:",
                inline: true
            },
            {
                name: '\u200B',
                value: '\u200B',
                inline: true
            });
        }

        message.channel.send({embed: embed});
    }
    
}