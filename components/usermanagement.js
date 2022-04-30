const {writetofile, readfromfile, writetoplayerlistdb} = require("./datamgr");

let playerlist = [{
    profilename: "akabox",
    "profilephoto": "https://cdn.discordapp.com/avatars/215068545552351250/5a600bbca2331678b276125998c16ecc.png?size=1024",
    playername: "akabox218",
    uid: "1007820601979",
    online: 0,
    ingame: 0,
    needcallgame: 0,
    highrequestlist: 0,
    highrequesttimestamp: 0
}, {
    profilename: "terpko",
    "profilephoto": "https://cdn.discordapp.com/avatars/171358872684986368/cc87dcbae8d37e8b5aed2e8da34d4e71.png?size=1024",
    playername: "terpko",
    uid: "2297370779",
    online: 0,
    ingame: 0,
    needcallgame: 0,
    highrequestlist: 0,
    highrequesttimestamp: 0
}, {
    profilename: "hakipi",
    "profilephoto": "https://cdn.discordapp.com/avatars/284391184393306112/a390ffac93ac94f7a91fbdea0057cc1e.png?size=1024",
    playername: "hakipi",
    uid: "2545398846",
    online: 0,
    ingame: 0,
    needcallgame: 0,
    highrequestlist: 0,
    highrequesttimestamp: 0
}, {
    profilename: "GT",
    "profilephoto": "https://cdn.discordapp.com/avatars/127868875810406400/ba92a07ff12d732b24c9d7c57478b621.png?size=1024",
    playername: "TheGTRacer97",
    uid: "2299827182",
    online: 0,
    ingame: 0,
    needcallgame: 0,
    highrequestlist: 0,
    highrequesttimestamp: 0
}, {
    profilename: "serveri",
    "profilephoto": "https://cdn.discordapp.com/avatars/222299113713041408/847fbea14b00f3a87385fd7912313948.png?size=1024",
    playername: "The9axel5",
    uid: "2298814335",
    online: 0,
    ingame: 0,
    needcallgame: 0,
    highrequestlist: 0,
    highrequesttimestamp: 0
}, {
    profilename: "Maidaki",
    "profilephoto": "https://cdn.discordapp.com/avatars/251744309735456768/d5122ec107ac109880460b5252c454e6.png?size=1024",
    playername: "Lundaki",
    uid: "2381075935",
    online: 0,
    ingame: 0,
    needcallgame: 0,
    highrequestlist: 0,
    highrequesttimestamp: 0
}

];


let highdemandlist = [];


let playerlistinitflag = 0;
let playerlistdatapath = "./public/playerlist";

function playerlistinit() {
    // console.log(readfromfile(userdatapath+"-undefined.json"));
    if (playerlistinitflag === 0 && readfromfile(playerlistdatapath + "-undefined.json") === 1) {
        writetofile(playerlistdatapath, playerlist);
        console.log("written playerlist =====================");
        playerlistinitflag = 1;

        for (let i = 0; i < playerlist.length; i++) {
            // writetoplayerlistdb(playerlist[i]);
        }
    }


}

playerlistinit();

// writetofile(userdatapath, userlist);

function getplayerlist() {
    if (readfromfile(playerlistdatapath + "-undefined.json", playerlist) === 1) {
        playerlistinit();
        return {err: "fail to get player list, please try again"};

    }
    readfromfile(playerlistdatapath + "-undefined.json", playerlist);
    console.log("<<<get players");
    return playerlist;

}

function getplayeruid(playername) {
    let rta = playerlist.filter(it => it.playername === playername);
    return rta[0].uid;

}

//todo we can get the uid from requesting


let freehighdemandcredit = -1;

function getfreehighdemandcredit() {

    return freehighdemandcredit;
}

function highdemandlistmgr(bridgedata, playername) {
    freehighdemandcredit = 5;
    let timestampnow = new Date();
    timestampnow = Date.now();
    for (let i = 0; i < playerlist.length; i++) {
        if (timestampnow - playerlist[i].highrequesttimestamp < 60 * 60 * 1000) {
            freehighdemandcredit--;
            if (freehighdemandcredit < 0) {
                freehighdemandcredit = 0; //restrict the credit max to 5
            }
        }

    }
    console.log("free credit = " + freehighdemandcredit);
    let rta = playerlist.filter(it => it.playername === playername);
    let ref = highdemandlist.filter(it => it.playername === playername);

    if (bridgedata.realtime.isOnline === 1) {
        // if online , add to highdemand list

        rta[0].online = 1;
        if (ref.length === 0) {//never added to the high demand list
            if (freehighdemandcredit === 0) {
                console.log("highdemand queue full , not adding this player");
                return 0;
            }
            if (bridgedata.realtime.isInGame === 1) {
                rta[0].ingame = 1;
            }

            rta[0].highrequesttimestamp = timestampnow;//timestamp of calling highdemand
            rta[0].highrequestlist = 1;//highdemand list flag


            highdemandlist.push(rta[0]);
            console.log("add to the high demand list   " + playername);

            //write to db with rta[0]
            writetoplayerlistdb(rta[0]);

            // console.log(highdemandlist);
        } else { //had been in high demand list
            rta[0].highrequesttimestamp = timestampnow;//timestamp of calling highdemand
            if (bridgedata.realtime.isInGame === 1) {
                ref[0].ingame = 1;
            } else { //player is not in game anymore
                if (ref[0].ingame === 1) {// previous is ingame , meaning this player quit the match
                    //need to call game to update data
                    ref[0].needcallgame = 1;
                    ref[0].ingame = 0;
                }


            }
            //write to db rta[0]
            writetoplayerlistdb(rta[0]);

        }


    } else if (bridgedata.realtime.isOnline === 0) {
        //if offline , remove from highdemand list
        rta[0].online = 0;
        rta[0].ingame = 0;
        rta[0].highrequestlist = 0;//highdemand list flag
        let index = highdemandlist.findIndex(it => it.playername === playername);
        if (index > -1) {
            highdemandlist.splice(index, 1);
            console.log("removed from the high demand list   " + playername);
        }
//write to db rta[0]
        writetoplayerlistdb(rta[0]);

    }

}

function gethighdemandlist() {

    console.log("get highdemand list ");
    return highdemandlist;

}

module.exports = {
    playerlist,
    highdemandlist,
    getplayerlist,
    getplayeruid,
    highdemandlistmgr,
    gethighdemandlist,
    getfreehighdemandcredit
};
