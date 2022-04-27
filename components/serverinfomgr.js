const {readfromfile} = require("./datamgr");
let serverinfo = [{servercalltimestamp: 0}];
const localserverpath = "./public/serverdata";
const localmappath = "./public/mapdata";

function getserverstatus  () {
    let data = "something";
    if (readfromfile(localserverpath + "-undefined.json", data) === 1) {
        return {err: "fail to get server status, please try again"};

    }
    data = readfromfile(localserverpath + "-undefined.json", data);
    return data;


}

function updateserverinfotimestamp() {
    let timestamp = new Date();
    timestamp = Date.now();
    serverinfo[0].servercalltimestamp = timestamp;


}

function getmaprotation  () {
    let data = "something";
    if (readfromfile(localmappath + "-undefined.json", data) === 1) {
        return {err: "fail to get map rotation status, please try again"};

    }
    data = readfromfile(localmappath + "-undefined.json", data);
    return data;


}




module.exports = {serverinfo,localserverpath,localmappath,getserverstatus,updateserverinfotimestamp,getmaprotation};
