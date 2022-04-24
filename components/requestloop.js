let requesttype = -1;
const apicall = require("./apicall");
const usermanagementobj = require("./usermanagement")
let regularuserindex = 0;
let highdemanuserindex = 0;
let looptimeoutcontrol = 0;
let regularlooprequestflag = 0;


const requestloop = setInterval(function () {

    let timestampnow = new Date();
    timestampnow = Date.now();
    console.log("reqeust loop is running " + requesttype);

    //set timeout logic
    looptimeoutcontrol = looptimeoutcontrol + 1;
    if (looptimeoutcontrol > (process.env.ENVVAL === "dev" ? 10 : 40)) { //40 is the breaking time in between before refreshing the playerlist bridge

        regularlooprequestflag = 1;
    }
    //run the regular quest
    if (regularlooprequestflag === 1) {

//run the request for player
//         console.log("test request for " + usermanagementobj.playerlist[userindex].playername);
        if (looptimeoutcontrol % 2) {
            if (process.env.ENVVAL === "prod") {
                apicall.callbridge(usermanagementobj.playerlist[regularuserindex].playername);
            }

            console.log(" call bridge ---------------------regualr " + usermanagementobj.playerlist[regularuserindex].playername);
        } else {
            if (timestampnow - usermanagementobj.playerlist[regularuserindex].highrequesttimestamp > 60 * 60 * 1000) {
                if (process.env.ENVVAL === "prod")
                    apicall.callgame(usermanagementobj.playerlist[regularuserindex].playername);
                console.log(" call game ---------------------regular " + usermanagementobj.playerlist[regularuserindex].playername);
            }


            regularuserindex = regularuserindex + 1;
        }

        if (regularuserindex === usermanagementobj.playerlist.length) {
            regularlooprequestflag = 0;
            looptimeoutcontrol = 0;
            regularuserindex = 0;
            console.log("listening ...");
        }
    } else if (regularlooprequestflag === 0) {
        if (usermanagementobj.highdemandlist.length !== 0) {
            //run high demand quest
            if (usermanagementobj.highdemandlist[highdemanuserindex].needcallgame === 1) {
                if (process.env.ENVVAL === "prod")
                    apicall.callgame(usermanagementobj.highdemandlist[highdemanuserindex].playername);
                console.log("  call game =====================highdemand " + usermanagementobj.highdemandlist[highdemanuserindex].playername);
                usermanagementobj.highdemandlist[highdemanuserindex].needcallgame = 0;
            } else {
                if (process.env.ENVVAL === "prod")
                    apicall.callbridge(usermanagementobj.highdemandlist[highdemanuserindex].playername);
                console.log("  call bridge====================highdemand " + usermanagementobj.highdemandlist[highdemanuserindex].playername);
            }


            highdemanuserindex = highdemanuserindex + 1;
            if (highdemanuserindex === usermanagementobj.highdemandlist.length) {
                highdemanuserindex = 0;
            }
        }


    }

}, 1 * 5 * 1000); //6 sec as one unit

//for testing
function paraswitch() {
    if (requesttype === "game") {
        requesttype = "bridge";

    } else if (requesttype === "bridge") {

        requesttype = "none";


    } else {
        requesttype = "game";
    }
    // module.exports.requesttypeexp = requesttype;
}

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
module.exports.paraswitchexp = paraswitch;
module.exports.getrequesttypeexp = getrequesttype;
module.exports.setrequesttypeexp = setrequesttype;

// module.exports.requesttypeexp = requesttype;
// exports.requesttypeexp = requesttype;
