let requesttype = -1;
const apicall = require("./apicall");
const usermanagementobj = require("./usermanagement")
let userindex = 0;
let looptimeoutcontrol = 0;
let looprequestflag = 0;

const requestloop = setInterval(function () {
    // console.log("reqeust loop is running " + requesttype);
    // for (let i in usermanagementobj.userlist) {

    //set timeout logic
    looptimeoutcontrol = looptimeoutcontrol + 1;
    if (looptimeoutcontrol > 40) { //40 is the breaking time in between before refreshing the playerlist bridge
        looprequestflag = 1;
        // console.log("make request for bridge");
        // looptimeoutcontrol = 0;
    }
    if (looprequestflag === 1) {

//run the request for player
//         console.log("test request for " + usermanagementobj.playerlist[userindex].playername);
        if (looptimeoutcontrol % 2) {
            apicall.callbridge(usermanagementobj.playerlist[userindex].playername);
        } else {
            apicall.callgame(usermanagementobj.playerlist[userindex].playername);
            userindex = userindex + 1;
        }

        if (userindex === usermanagementobj.playerlist.length) {
            looprequestflag = 0;
            looptimeoutcontrol = 0;
            userindex = 0;
            console.log("listening ...");
        }
    }


//go around players
//     console.log("test request for " + usermanagementobj.userlist[userindex].playername);


    if (requesttype === "game") {
        // apicall.callgame();
    } else if (requesttype === "bridge") {
        // apicall.callbridge(usermanagementobj.userlist[userindex].playername);
    }

}, 1 * 6 * 1000); //6 sec as one unit

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
