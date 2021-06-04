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
            description: 'displays the leaderboard for the server',
        })
    }

    async run(message)
    {
        // let userLoc = userStatesInit.findUser(message.guild.id, message.member.id);

        // let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'));

        // let allUsers = JSON.parse(JSON.stringify(userStates.Servers[userLoc.guildIndex].Users));
        
        // let bubbleSort = (inputArr) => {
        //     let len = inputArr.length;
        //     for (let i = 0; i < len; i++) {
        //         for (let j = 0; j < len-1; j++) {
        //             if (inputArr[j].Balance < inputArr[j + 1].Balance) {
        //                 let tmp = inputArr[j];
        //                 inputArr[j] = inputArr[j + 1];
        //                 inputArr[j + 1] = tmp;
        //             }
        //         }
        //     }
        //     return inputArr;
        // };
        
        // bubbleSort(allUsers);


        // let embed = {
        //     color: '0x00FF00',
        //     title: "Top user balances!",
        //     thumbnail: {
        //         url: 'https://thankschamp.s3.us-east-2.amazonaws.com/blackjacklogo.png',
        //     },
        //     author: {
        //         name: 'Pain Bot',
        //         icon_url: 'https://thankschamp.s3.us-east-2.amazonaws.com/PainChamp.png',
        //         url: 'https://www.google.com',
        //     },
        //     fields:[
        //         {
        //             name: 'User',
        //             value: ":first_place: "+message.guild.members.cache.get(allUsers[2].UserID)['nickname'],
        //             inline: true,
        //         },
                
        //     ],
        //     timestamp: new Date(),
        // };


        // message.channel.send({embed: embed});

        // // let x = ''
        // // for(const bal of allUsers)
        // //     x += bal.Balance + "\n";


        // console.log(Object.getOwnPropertyNames(message.guild.member(allUsers[2].UserID)['user']['username']));
        // // message.reply(JSON.stringify(userStates.Servers[userLoc.guildIndex].Users[0].balance);
    }
    
}