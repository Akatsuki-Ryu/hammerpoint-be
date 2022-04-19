const {writetofile, readfromfile} = require("./datamgr");

let playerlist = [
    {playername: "akabox218", uid: "1007820601979"},
    {playername: "terpko", uid: "2297370779"},
    {playername: "hakipi", uid: "2545398846"},
    {playername: "TheGTRacer97", uid: "2299827182"},
    {playername: "The9axel5", uid: "2298814335"}
]


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

module.exports = {playerlist, getplayernames, getplayeruid};
