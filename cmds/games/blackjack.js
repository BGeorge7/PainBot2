const Commando = require('discord.js-commando');
const Discord  = require('discord.js');
let fs = require("fs");
let path = require("path");
let reqPath = path.join(__dirname, '../../'); //get directory path of root folder for the bot

let cardsFile = require(reqPath + './/info/cards.json');

const userStatesInit = require(reqPath + './/utils/userStatesInit.js');
const blackJackUtils = require(reqPath + './/utils/blackJackUtils.js');

let template = {
    "Name": "black_jack",
    "isGameInProgress": 0,
    "betAmount": 0,
    "userDeck": [],
    "dealerDeck": [],
    "gameDeck": []
};

module.exports = class BlackJackCommand extends Commando.Command {
    constructor(client) {
        super(client,  {
            name: 'blackjack',
            group: 'games',
            memberName: 'blackjack',
            description: 'Plays Black Jack',
            argsPromptLimit: 0,
            args: [
                {
                    key: 'text',
                    prompt: 'Blackjack sub-command',
                    type: 'string',
                    default: ''
                },
                {
                    key: 'bal',
                    prompt: 'How much you are betting',
                    type: 'integer',
                    default: ''
                },
                
            ]
        })
    }

    async run(message, {text, bal})
    {
        

        if(!text)
        {
            message.reply("To start playing\n-blackjack bet <bet amount>");
        }
        else
        {
            if(text == "bet" && bal) //block for the start of a game
            {
                let betAmount = Math.floor(bal)
                if(betAmount <= 0) //Make sure the bet is above zero
                {
                    message.reply("Bet amount must at least 1!");
                    return;
                }
                let userLoc = userStatesInit.findUser(message.guild.id, message.member.id);
                let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'));

                if(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance < betAmount) //make sure that the user has enough funds for the bet
                {
                    message.reply("Insufficient funds for this bet!");
                    return;
                }

                let blackJackLoc = findBlackJack(userLoc);
                userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8')); //reopens the file now that the new blackjack game state has been added
                if(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].isGameInProgress == 1)
                {
                    message.reply("Game is already in progres\n" + '```Command: -blackjack [hit | stand | double]```');
                    return;
                }
                
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance -= betAmount

                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].gameDeck = JSON.parse(JSON.stringify(cardsFile.Cards)); 
                //janky way of cloning an array. Has to be this way because javascript is dumb. don't @ me


                blackJackUtils.shuffleDeck(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].gameDeck); //Shuffles the deck


                blackJackUtils.gameDeal(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck, //Deal the initial hands
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].gameDeck)

                
                let embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                    "playing", message.member.user.username + " is playing blackjack!", false)    
               
                message.channel.send({embed: embedDisplay}); //send the current hands

                let dealerTotal = blackJackUtils.handTotal(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck);
                let userTotal = blackJackUtils.handTotal(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck);

                if(userTotal == 21 && dealerTotal == 21) //tied with the dealer
                {
                    embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                        "playing", message.member.user.username + " tied with the dealer!", false);
                        
                    message.channel.send({embed: embedDisplay});
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc] = JSON.parse(JSON.stringify(template)); //game reset
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += betAmount

                    return;
                }
                else if(userTotal == 21)
                {   
                    embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                        "win", message.member.user.username + " got blackjack!", false);

                    message.channel.send({embed: embedDisplay});
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc] = JSON.parse(JSON.stringify(template));
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += betAmount * 2.5

                    let data = JSON.stringify(userStates, null, 4);
                    fs.writeFileSync(reqPath + '/info/userStates.json', data);
                    return;
                    
                }
                else if(dealerTotal == 21)
                {
                    embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                        "lose", "Dealer got blackjack! " + message.member.user.username + " lost!", false);
                    message.channel.send({embed: embedDisplay});

                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc] = JSON.parse(JSON.stringify(template));

                    let data = JSON.stringify(userStates, null, 4);
                    fs.writeFileSync(reqPath + '/info/userStates.json', data);
                    return;
                }
                
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].isGameInProgress = 1;
                userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].betAmount = betAmount;

                let data = JSON.stringify(userStates, null, 4);
                fs.writeFileSync(reqPath + '/info/userStates.json', data);
                return;
            }
            else if(text == "hit")
            {
                let userLoc = userStatesInit.findUser(message.guild.id, message.member.id);
                let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'));

                let blackJackLoc = findBlackJack(userLoc);
                userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8')); //reopens the file now that the new blackjack game state has been added
                let betAmount = userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].betAmount
                if(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].isGameInProgress != 1)
                {
                    message.reply("No game currently in progress\n" + '```Command: -blackjack bet <bet amount>```');
                    return;
                }
                
                blackJackUtils.userHit(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].gameDeck);


                let embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                    "playing", message.member.user.username + " Hit!" , true);

                message.channel.send({embed: embedDisplay});

                let dealerTotal = blackJackUtils.handTotal(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck);
                let userTotal = blackJackUtils.handTotal(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck);

                if(userTotal == 21 && dealerTotal == 21) //tied with the dealer
                {
                    embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                        "playing", message.member.user.username + " tied with the dealer!", false);
                        
                    message.channel.send({embed: embedDisplay});
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc] = JSON.parse(JSON.stringify(template)); //game reset

                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += betAmount;

                    let data = JSON.stringify(userStates, null, 4);
                    fs.writeFileSync(reqPath + '/info/userStates.json', data);
                    return;
                }
                else if(userTotal > 21) //user busts
                {
                    embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                        "lose", message.member.user.username + " busted with a " + userTotal +"!" , false);
                        
                    message.channel.send({embed: embedDisplay});
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc] = JSON.parse(JSON.stringify(template)); //game reset
                    let data = JSON.stringify(userStates, null, 4);
                    fs.writeFileSync(reqPath + '/info/userStates.json', data);
                    return;
                }
                else if(userTotal == 21)
                {
                    blackJackUtils.dealerHit(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].gameDeck, 
                        blackJackUtils.handTotal(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck));

                    dealerTotal = blackJackUtils.handTotal(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck);

                    if(dealerTotal == 21) //tied with the dealer
                    {
                        embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                            userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                            userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                            "playing", message.member.user.username + " tied with the dealer!", false);

                        message.channel.send({embed: embedDisplay});
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc] = JSON.parse(JSON.stringify(template));

                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += betAmount

                        let data = JSON.stringify(userStates, null, 4);
                        fs.writeFileSync(reqPath + '/info/userStates.json', data);
                        return;
                    }
                    else if(dealerTotal < 21) //user wins
                    {
                        
                        embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                            userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                            userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                            "win", message.member.user.username + " Wins with a " + userTotal + "!", false);
                        message.channel.send({embed: embedDisplay});
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += betAmount * 2.5;
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc] = JSON.parse(JSON.stringify(template));

                        let data = JSON.stringify(userStates, null, 4);
                        fs.writeFileSync(reqPath + '/info/userStates.json', data);
                        return;
                        
                    }
                    else //user wins
                    {
                        
                        embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                            userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                            userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                            "win", message.member.user.username + " Wins. Dealer busts with a " + dealerTotal + "!", false);
                        message.channel.send({embed: embedDisplay});
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += betAmount * 2.5;
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc] = JSON.parse(JSON.stringify(template));

                        let data = JSON.stringify(userStates, null, 4);
                        fs.writeFileSync(reqPath + '/info/userStates.json', data);
                        return;
                    }
                    
                }
                
                let data = JSON.stringify(userStates, null, 4);
                fs.writeFileSync(reqPath + '/info/userStates.json', data);

            }
            else if(text == "stay")
            {
                let userLoc = userStatesInit.findUser(message.guild.id, message.member.id);
                let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'));
                let embedDisplay

                let blackJackLoc = findBlackJack(userLoc);
                userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8')); //reopens the file now that the new blackjack game state has been added
                let betAmount = userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].betAmount
                if(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].isGameInProgress != 1)
                {
                    message.reply("No game currently in progress\n" + '```Command: -blackjack bet <bet amount>```');
                    return;
                }

                blackJackUtils.dealerHit(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].gameDeck, 
                    blackJackUtils.handTotal(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck));

                let dealerTotal = blackJackUtils.handTotal(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck);
                let userTotal = blackJackUtils.handTotal(userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck);

                if(dealerTotal > 21) //dealer bust
                {
                    embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                        "win", message.member.user.username + " Wins. Dealer busts with a " + dealerTotal + "!", false);
                    message.channel.send({embed: embedDisplay});
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += betAmount * 2.5;
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc] = JSON.parse(JSON.stringify(template));

                    let data = JSON.stringify(userStates, null, 4);
                    fs.writeFileSync(reqPath + '/info/userStates.json', data);
                    return;
                }
                if(dealerTotal == userTotal) //tied with the dealer
                {
                    
                    embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                        "playing", message.member.user.username + " tied with the dealer!", false);

                    message.channel.send({embed: embedDisplay});
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc] = JSON.parse(JSON.stringify(template));

                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += betAmount;

                    let data = JSON.stringify(userStates, null, 4);
                    fs.writeFileSync(reqPath + '/info/userStates.json', data);
                    return;
                }
                else if(dealerTotal < userTotal) //user wins
                {
                    
                    embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                        "win", message.member.user.username + " Wins with a " + userTotal + "!", false);
                    message.channel.send({embed: embedDisplay});
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += betAmount * 2.5;
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc] = JSON.parse(JSON.stringify(template));

                    let data = JSON.stringify(userStates, null, 4);
                    fs.writeFileSync(reqPath + '/info/userStates.json', data);
                    return;
                    
                }
                else if(dealerTotal > userTotal) //dealer wins
                {
                    
                    embedDisplay = blackJackUtils.formEmbed(betAmount,  //Display the Hand
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].userDeck,
                        userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc].dealerDeck,
                        "lose", "Dealer wins with a " + dealerTotal + "!", false);
                    message.channel.send({embed: embedDisplay});
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].Balance += betAmount * 2.5;
                    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates[blackJackLoc] = JSON.parse(JSON.stringify(template));

                    let data = JSON.stringify(userStates, null, 4);
                    fs.writeFileSync(reqPath + '/info/userStates.json', data);
                    return;
                }

            }

            
        }
        
    }

}

function findBlackJack(userLoc) //Locates the index of the blackjack game state for a particular user
{
    let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'))

    let i = 0;
    for(const element of userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates)
    {
        if(element.Name == "black_jack")
        {
            return i;
        }
        i+=1;
    }
    return createBlackJack(userLoc);
}

function createBlackJack(userLoc)//if the game state does not exist, creates a blank one with the template
{
    let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'))
    let nextGame = userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates.length;
    userStates.Servers[userLoc.guildIndex].Users[userLoc.userIndex].GameStates.push(JSON.parse(JSON.stringify(template)));

    let data = JSON.stringify(userStates, null, 4);
    fs.writeFileSync(reqPath + '/info/userStates.json', data);

    return nextGame;
}

function embedsShit()
{
    let exampleEmbed = {
        color: 0x0099ff,
        title: 'BlackJack!',
        thumbnail: {
            url: 'https://thankschamp.s3.us-east-2.amazonaws.com/blackjacklogo.png',
        },
        author: {
            name: 'Pain Bot',
            icon_url: 'https://thankschamp.s3.us-east-2.amazonaws.com/PainChamp.png',
            url: 'https://www.google.com',
        },
        description: 'Your wager: 500',
        fields:[
            {
                name: 'Your Hand!',
                value: cardsFile.Cards[3].SuitEmoji + cardsFile.Cards[3].Symbol + "\t" + cardsFile.Cards[29].SuitEmoji + cardsFile.Cards[29].Symbol+ "\t" + cardsFile.Cards[48].SuitEmoji + cardsFile.Cards[48].Symbol + "\t" + cardsFile.Cards[19].SuitEmoji + cardsFile.Cards[19].Symbol +
                "\n" + "Hand Value: **19**",
                inline: true,
            },
            {
                name: '\u200B',
                value: '\u200B',
                inline: true
            },
            {
                name: 'Dealer Hand!',
                value:  cardsFile.Cards[37].SuitEmoji + cardsFile.Cards[37].Symbol + "\t" + cardsFile.Cards[1].SuitEmoji + cardsFile.Cards[1].Symbol +
                "\n" + "Hand Value: **19**",
                inline: true,
            },
            {
                name: '\u200B',
                value: '```Command: -blackjack [hit | stand | double]```'
            }
            
        ],
        timestamp: new Date(),
    };

    message.channel.send({embed: exampleEmbed });

    //message.channel.send(embed );

    exampleEmbed = {
        color: 0x0099ff,
        title: 'Hit!',
        author: {
            name: 'Pain Bot',
            icon_url: 'https://thankschamp.s3.us-east-2.amazonaws.com/PainChamp.png',
            url: 'https://www.google.com',
        },
        description: 'Your wager: 500',
        thumbnail: {
            url: 'https://thankschamp.s3.us-east-2.amazonaws.com/blackjacklogo.png',
        },
        fields:[
            {
                name: 'Your Hand!',
                value: cardsFile.Cards[3].SuitEmoji + cardsFile.Cards[3].Symbol + "\t" + cardsFile.Cards[29].SuitEmoji + cardsFile.Cards[29].Symbol+ "\t" + cardsFile.Cards[48].SuitEmoji + cardsFile.Cards[48].Symbol + "\t" + cardsFile.Cards[19].SuitEmoji + cardsFile.Cards[19].Symbol +
                "\n" + "Hand Value: **19**",
                inline: true,
            },
            {
                name: '\u200B',
                value: '\u200B',
                inline: true
            },
            {
                name: 'Dealer Hand!',
                value:  cardsFile.Cards[37].SuitEmoji + cardsFile.Cards[37].Symbol + "\t" + cardsFile.Cards[1].SuitEmoji + cardsFile.Cards[1].Symbol +
                "\n" + "Hand Value: **19**",
                inline: true,
            },
            {
                name: '\u200B',
                value: '```Command: -blackjack [hit | stand | double]```'
            }
            
        ],
        image: {
            url: cardsFile.Cards[37].CardURL,
        },
        timestamp: new Date(),
    };

    message.channel.send({embed: exampleEmbed });
}