let path = require("path");
let reqPath = path.join(__dirname, '../'); //get directory path of root folder for the bot
let fs = require("fs");
const Discord  = require('discord.js');


module.exports = {

    shuffleDeck: function(deck)
    {
        let currentIndex = deck.length, temporaryValue, randomIndex;
  
        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = deck[currentIndex];
            deck[currentIndex] = deck[randomIndex];
            deck[randomIndex] = temporaryValue;
        }

    },
    gameDeal: function(userDeck, dealerDeck, deck)
    {
        userDeck.push(deck.shift());

        dealerDeck.push(deck.shift());

        userDeck.push(deck.shift());

        dealerDeck.push(deck.shift());
    },

    dealerHit: function(dealerDeck, deck, userTotal)
    {

        while(true)
        {
            if(handTotal(dealerDeck) > userTotal)
                return;
            else if(handTotal(dealerDeck) < userTotal)
                dealerDeck.push(deck.shift());
            else if(handTotal(dealerDeck) == userTotal && userTotal >= 17)
                return;
            else
                dealerDeck.push(deck.shift()); //In the situation where the dealer and the player have the same amount and the number is less than 17
        }
    },
    userHit: function(userDeck, deck)
    {
        userDeck.push(deck.shift());
    },
    
    handTotal: function(array)
    {
        return handTotal(array); //helper function
    },

    formEmbed: function(wager, userDec, dealerDeck, state, titalMessage, userHit)
    {
        let stateColor;
        switch (state)
        {
            case 'win':
                stateColor = 0x00FF00;
                break;
            case 'lose':
                stateColor = 0xFF0000
                break;
            default:
                stateColor = 0x0099ff;
        }
        let embed = {
            color: stateColor,
            title: titalMessage,
            thumbnail: {
                url: 'https://thankschamp.s3.us-east-2.amazonaws.com/blackjacklogo.png',
            },
            author: {
                name: 'Pain Bot',
                icon_url: 'https://thankschamp.s3.us-east-2.amazonaws.com/PainChamp.png',
                url: 'https://www.google.com',
            },
            description: 'Your wager: **' + wager + '**',
            fields:[
                {
                    name: 'Your Hand!',
                    value: handString(userDec) +
                    "\nHand Value: **" + handTotal(userDec) + "**",
                    inline: true,
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: 'Dealer Hand!',
                    value:  handString(dealerDeck) +
                    "\nHand Value: **" + handTotal(dealerDeck) + "**",
                    inline: true,
                }
            ],
            timestamp: new Date(),
        };
        if(state == "playing")
        {
            embed.fields.push(
                {
                    name: '\u200B',
                    value: '```Command: -blackjack [hit | stay | double]```'
                }
            )
        }
        if(userHit)
            embed.image = {
                url: userDec[userDec.length-1].CardURL,
            }
        return embed;
    }
    
}

function handTotal(array)
{
    let arrNoAce = [];
    let arrAce = [];

    let i;
    for(i = 0; i < array.length; i++) // we move aces to the back so that our logic can work
    {
        if(array[i].Symbol == "A")
            arrAce.push(array[i]);
        else
            arrNoAce.push(array[i]);
    }
    return handTotalHelper(arrNoAce.concat(arrAce)); //helper function
}

function handString(hand)
{
    //console.log(hand[0].Symbol + " " + hand[0].SuitEmoji)
    let x = ""
    for(const element of hand)
    {
        x += element.Symbol + element.SuitEmoji + "\t";
    }
    return x;
}

function handTotalHelper(array)
{
    let total = 0;
    let i;
    for(i = 0; i < array.length; i++)
    {
        switch(array[i].Symbol)
        {
            case "J":
            case "Q":
            case "K":
                total += 10;
                break;
            case "A":
                if(total+11 > 21)
                    total += 1;
                else
                    total += 11;
                break;
            default:
                total += parseInt(array[i].Symbol);
                break;
        }
    }
    return total;
}