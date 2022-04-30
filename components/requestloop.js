let requesttype = -1;
const apicall = require("./apicall");
const usermanagementobj = require("./usermanagement")
const {serverinfo} = require("./serverinfomgr");
const {readfromplayerlistdb} = require("./datamgr");
let regularuserindex = 0;
let highdemanuserindex = 0;
let looptimeoutcontrol = 0;
let loopstage = 1; //1 serverstatus , 2 map rotation 3 regularlist, 4 highdemand


const requestloop = setInterval(async function () {

    let timestampnow = new Date();
    timestampnow = Date.now();

    if (process.env.ENVVAL === "dev") {
        console.log("reqeust loop is running on stage " + loopstage);
    }


    if (looptimeoutcontrol > 40) { //40 is the breaking time in between before refreshing the playerlist bridge

        loopstage = 1;
        looptimeoutcontrol = 0;
    } else if (looptimeoutcontrol > 2 && looptimeoutcontrol < 40) {
        // loopstage = 2;
    }


    if (loopstage === 1) {

        //download the playerlist from db
        console.log("^^^ read playerlist from db");
        usermanagementobj.playerlist = await readfromplayerlistdb(usermanagementobj.playerlist);
        usermanagementobj.setplayerlist(usermanagementobj.playerlist);


        //check serverstatus
        console.log(">>> call server status-------------------- ");
        if (process.env.ENVVAL === "prod") {
            apicall.callserverstatus();
        }


        //go to next stage
        loopstage = 2;
    } else if (loopstage === 2) {
        console.log(">>> call map rotation -------------------- ");
        if (process.env.ENVVAL === "prod") {
            apicall.callmaprotation();
        }

        //go to next stage
        loopstage = 3;

    } else if (loopstage === 3) {

//run the request for player
//         console.log("test request for " + usermanagementobj.playerlist[userindex].playername);
        if (looptimeoutcontrol % 2 || 1) {

            console.log(">>> call bridge ---------------------regualr " + usermanagementobj.playerlist[regularuserindex].playername);
            if (process.env.ENVVAL === "prod") {
                apicall.callbridge(usermanagementobj.playerlist[regularuserindex].playername);
            }

            regularuserindex = regularuserindex + 1;
        } else {
            //we dont call game , only call game when people in the high demand
            // if (timestampnow - usermanagementobj.playerlist[regularuserindex].highrequesttimestamp > 60 * 60 * 1000) {
            //     if (process.env.ENVVAL === "prod")
            //         apicall.callgame(usermanagementobj.playerlist[regularuserindex].playername);
            //     console.log(">>> call game ---------------------regular " + usermanagementobj.playerlist[regularuserindex].playername);
            // }


        }

        if (regularuserindex === usermanagementobj.playerlist.length) {
            loopstage = 4;
            regularuserindex = 0;
            console.log("listening ...");
        }
    } else if (loopstage === 4) {
        if (usermanagementobj.highdemandlist.length !== 0) {
            //run high demand quest
            if (usermanagementobj.highdemandlist[highdemanuserindex].needcallgame === 1) {
                console.log(">>>  call game =====================highdemand " + usermanagementobj.highdemandlist[highdemanuserindex].playername);
                if (process.env.ENVVAL === "prod")
                    apicall.callgame(usermanagementobj.highdemandlist[highdemanuserindex].playername);

                usermanagementobj.highdemandlist[highdemanuserindex].needcallgame = 0;
            } else {
                // console.log(">>>  call bridge====================highdemand " + usermanagementobj.highdemandlist[highdemanuserindex].playername);
                // if (process.env.ENVVAL === "prod")
                //     apicall.callbridge(usermanagementobj.highdemandlist[highdemanuserindex].playername);

            }


            highdemanuserindex = highdemanuserindex + 1;
            if (highdemanuserindex === usermanagementobj.highdemandlist.length) {
                highdemanuserindex = 0;
            }
        }


    }
    //set timeout logic
    looptimeoutcontrol = looptimeoutcontrol + 1;
    // console.log(looptimeoutcontrol);

}, 10 * 1000); //6 sec as one unit


//io to other modules
function getrequesttype() {
    return requesttype;
}

function setrequesttype(_requesttype) {
    requesttype = _requesttype
}

//
// module.exports = {
//     requesttypeexp: requesttype,
//     paraswitchexp: function paraswitch()
//
// }
module.exports.getrequesttypeexp = getrequesttype;
module.exports.setrequesttypeexp = setrequesttype;

// module.exports.requesttypeexp = requesttype;
// exports.requesttypeexp = requesttype;
