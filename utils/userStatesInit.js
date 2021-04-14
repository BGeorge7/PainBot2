//User 1 and Server 1 are templates with which all others can be created
let path = require("path");
let reqPath = path.join(__dirname, '../'); //get directory path of root folder for the bot
let fs = require("fs");

let template = {
    "ServerID": "00000000000",
    "Users": [
        {
            "UserID": "00000000000",
            "Balance": 0,
            "lastDailyEpoch": "1",
            "dailyStreak": 1,
            "GameStates": [

            ]
        }
    ]
};

module.exports = {

    findUser: function(guildID, userID)
    {
        let serverIndex = doesServerExist(guildID);
        let userIndex;
        if(serverIndex < 0)
        {
            return createServer(guildID, userID);
        }
        else
        {
            userIndex = doesUserExist(serverIndex, userID);
            if(userIndex < 0)
            {
                return createUser(serverIndex, userID);
            }
            else
            {
                return {"guildIndex": serverIndex, "userIndex": userIndex};
            }
        }

    },
    
}//Returns the index of the Server. If the server does not exist returns -1
function doesServerExist(guildID)
{
    let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'))
    let i = 0;
    for(const element of userStates.Servers)
    {
        if(element.ServerID == guildID)
        {
            return i;
        }
        i+=1;
    }
    return -1;
    
}
//Returns the index of the user. If the user does not exists returns -1
function doesUserExist(serverIndex, userID)
{
    let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'))
    let i = 0;
    for(const element of userStates.Servers[serverIndex].Users)
    {
        if(element.UserID == userID)
        {
            return i;
        }
        i+=1;
    }
    return -1;
    
}

function createServer(guildID, userID)
{
    //console.log("Creating entry for server (" + guildID + ") and user (" + userID + ")");
    let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'))
    let nextBlankServer = userStates.Servers.length;

    userStates.Servers.push(template);
    userStates.Servers[nextBlankServer].ServerID = guildID;
    userStates.Servers[nextBlankServer].Users[0].UserID = userID;

    let data = JSON.stringify(userStates, null, 4);
    fs.writeFileSync(reqPath + '/info/userStates.json', data);

    console.log("Server ("+guildID+") and user ("+userID+") has been added");
    return {"guildIndex": nextBlankServer, "userIndex": 0};

}

function createUser(serverIndex, userID)
{
    let userStates = JSON.parse(fs.readFileSync(reqPath + './/info/userStates.json', 'utf8'))
    let nextBlankUser = userStates.Servers[serverIndex].Users.length;

    userStates.Servers[serverIndex].Users.push(template.Users[0]);
    userStates.Servers[serverIndex].Users[nextBlankUser].UserID = userID;

    let data = JSON.stringify(userStates, null, 4);
    fs.writeFileSync(reqPath + '/info/userStates.json', data);

    console.log("User ("+userID+") has been added");
    return {"guildIndex": serverIndex, "userIndex": nextBlankUser};

}