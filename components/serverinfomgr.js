const {readfromfile} = require("./datamgr");
let serverinfo = [{servercalltimestamp: 0}];

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



module.exports = {serverinfo,getserverstatus,updateserverinfotimestamp};
