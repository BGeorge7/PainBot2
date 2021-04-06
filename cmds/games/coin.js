const Commando = require('discord.js-commando');
const Discord  = require('discord.js');

let fs = require("fs");
let path = require("path");
let reqPath = path.join(__dirname, '../../'); //get directory path of root folder for the bot

const utils = require(reqPath + './/utils/usefulFunctions.js');

let template = {
    "Name": "coin_flip",
    "isGameInProgress": 0,
    "state": 0,
    "stateOneInfo": 0,
    "stateTwoInfo": 0,
    "stateThreeInfo": 0
};
module.exports = class CoinCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'coin',
            group: 'games',
            memberName: 'coin',
            description: 'Simple coin flip game.',
            argsType: 'multiple',
        })
    }

    async run(message, args)
    {
        if(args.length > 1)
        {
            message.reply("Too many arguemnts...")
            return;
        }

        if(args[0] == 'x') //This is where the game will be held
        {
            let userLoc = utils.findUser(message.guild.id, message.member.id);
            let coinLoc = findCoin(userLoc)
            if(coinLoc < 0)
            {
                coinLoc = createCoin(userLoc)
            }
            
            let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'));
            let genNum = Math.floor((Math.random() * 100) + 1);
            genNum = (genNum <= 50) ? 0 : 1;

            if(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].isGameInProgress == 0)
            {
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].isGameInProgress = 1;
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].state = 1;

                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].stateOneInfo = genNum
                message.channel.send(createEmbed(genNum, userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].stateOneInfo, -1, -1))

                let data = JSON.stringify(userStates, null, 4);
                fs.writeFileSync(reqPath + '/info/userStates.json', data);
            }
            else if(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].state == 1)
            {
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].state = 2;
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].stateTwoInfo = genNum
                message.channel.send(createEmbed(genNum, userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].stateOneInfo, 
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].stateTwoInfo, -1))
                
                let data = JSON.stringify(userStates, null, 4);
                fs.writeFileSync(reqPath + '/info/userStates.json', data);
            }
            else if(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].state == 2)
            {
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].state = 3;
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].stateThreeInfo = genNum
                message.channel.send(createEmbed(genNum, userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].stateOneInfo, 
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].stateTwoInfo, 
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].stateThreeInfo))

                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].stateOneInfo = 0;
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].stateTwoInfo = 0;
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].isGameInProgress = 0;
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[coinLoc].state = 0;

                let data = JSON.stringify(userStates, null, 4);
                fs.writeFileSync(reqPath + '/info/userStates.json', data);
            }

            return;
        }

        let genNum = Math.floor(Math.random() * 2)
        if(genNum == 0)
            message.reply("You got tails!");
        else
            message.reply("You got heads!");

    }
}

//Returns the index of the coin state, if no coin state is found, returns -1
function findCoin(userLoc)
{
    let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'))

    let i = 0;
    for(const element of userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates)
    {
        if(element.Name == "coin_flip")
        {
            return i;
        }
        i+=1;
    }
    return -1
}

function createCoin(userLoc)
{
    let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'))
    let nextGame = userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates.length;
    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates.push(template);

    let data = JSON.stringify(userStates, null, 4);
    fs.writeFileSync(reqPath + '/info/userStates.json', data);

    return nextGame;
}

function createEmbed(currentFlip, flipOne, flipTwo, flipThree)
{
    let embed
    if(flipOne >=0 && flipTwo < 0 && flipThree < 0)
    {
        embed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle('You Got ' + (currentFlip == 0) ? 'Tails':'Heads')
            .setAuthor('Pain Bot', 'https://thankschamp.s3.us-east-2.amazonaws.com/PainChamp.png', 'https://www.google.com')
            .addFields(
                { name: 'Flip 1', value: (flipOne == 0) ? 'Tails':'Heads' },
            )
            .setImage((currentFlip == 0)? 'https://thankschamp.s3.us-east-2.amazonaws.com/tails.png':'https://thankschamp.s3.us-east-2.amazonaws.com/Heads.png')
            .setTimestamp();
    }
    else if(flipOne >=0 && flipTwo >=0 && flipThree < 0)
    {
        
        embed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle('You Got ' + (currentFlip == 0) ? 'Tails':'Heads')
            .setAuthor('Pain Bot', 'https://thankschamp.s3.us-east-2.amazonaws.com/PainChamp.png', 'https://www.google.com')
            .addFields(
                { name: 'Flip 1', value: (flipOne == 0) ? 'Tails':'Heads' },
                { name: 'Flip 2', value: (flipTwo == 0) ? 'Tails':'Heads' },
            )
            .setImage((currentFlip == 0)? 'https://thankschamp.s3.us-east-2.amazonaws.com/tails.png':'https://thankschamp.s3.us-east-2.amazonaws.com/Heads.png')
            .setTimestamp();
    }
    else if(flipOne >=0 && flipTwo >=0 && flipThree >= 0)
    {
        embed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle('You Got ' + (currentFlip == 0) ? 'Tails':'Heads')
            .setAuthor('Pain Bot', 'https://thankschamp.s3.us-east-2.amazonaws.com/PainChamp.png', 'https://www.google.com')
            .setDescription('Thanks for playing!\n Here are your flips.')
            .addFields(
                { name: 'Flip 1', value: (flipOne == 0) ? 'Tails':'Heads' },
                { name: 'Flip 2', value: (flipTwo == 0) ? 'Tails':'Heads' },
                { name: 'Flip 2', value: (flipThree == 0) ? 'Tails':'Heads' },
            )
            .setImage((currentFlip == 0)? 'https://thankschamp.s3.us-east-2.amazonaws.com/tails.png':'https://thankschamp.s3.us-east-2.amazonaws.com/Heads.png')
            .setTimestamp();
    }
    return embed;
}
