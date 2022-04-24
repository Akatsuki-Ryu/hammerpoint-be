const {writetofile, readfromfile} = require("./datamgr");
const {callbridge} = require("./apicall");

let playerlist = [
    {playername: "akabox218", uid: "1007820601979", ingame: 0,needcallgame:0,highrequesttimestamp:0},
    {playername: "terpko", uid: "2297370779", ingame: 0,needcallgame:0,highrequesttimestamp:0},
    {playername: "hakipi", uid: "2545398846", ingame: 0,needcallgame:0,highrequesttimestamp:0},
    {playername: "TheGTRacer97", uid: "2299827182", ingame: 0,needcallgame:0,highrequesttimestamp:0},
    {playername: "The9axel5", uid: "2298814335", ingame: 0,needcallgame:0,highrequesttimestamp:0}
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
    }

}

playerlistinit();

// writetofile(userdatapath, userlist);

function getplayernames() {
    if (readfromfile(playerlistdatapath + "-undefined.json", playerlist) === 1) {
        playerlistinit();
        return {err: "fail to get player list, please try again"};

    }
    readfromfile(playerlistdatapath + "-undefined.json", playerlist);
    console.log("get players");
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
    freehighdemandcredit = 0;
    let timestampnow = new Date();
    timestampnow = Date.now();
    for (let i = 0; i < playerlist.length; i++) {
        if(timestampnow - playerlist[i].highrequesttimestamp > 60 * 60 * 1000)
        {
            freehighdemandcredit++;
            if (freehighdemandcredit >5) {
                freehighdemandcredit = 5; //restrict the credit max to 5
            }
        }

    }
    console.log("free credit = " + freehighdemandcredit);

    if (bridgedata.realtime.isOnline === 1) {// if online , add to highdemand list
        let rta = playerlist.filter(it => it.playername === playername);
        let ref = highdemandlist.filter(it => it.playername === playername);
        if (ref.length === 0) {//never added to the high demand list
            if (freehighdemandcredit===0) {
                console.log("highdemand queue full , not adding this player");
                return 0;
            }
            if (bridgedata.realtime.isInGame === 1) {
                rta[0].ingame = 1;
            }

                rta[0].highrequesttimestamp = timestampnow;//timestamp of calling highdemand


            highdemandlist.push(rta[0]);
            console.log("add to the high demand list   " + playername);
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

        }


    } else if (bridgedata.realtime.isOnline === 0) { //if offline , remove from highdemand list
        let index = highdemandlist.findIndex(it => it.playername === playername);
        if (index > -1) {
            highdemandlist.splice(index, 1);
            console.log("removed from the high demand list   " + playername);
        }


    }

}

function gethighdemandlist() {

    console.log("get highdemand list ");
    return highdemandlist;

}

module.exports = {playerlist, highdemandlist, getplayernames, getplayeruid, highdemandlistmgr, gethighdemandlist,getfreehighdemandcredit};
