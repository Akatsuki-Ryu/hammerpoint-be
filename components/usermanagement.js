const {writetofile, readfromfile} = require("./datamgr");

let userlist = [
    {playername: "akabox218", uid: "1007820601979"},
    {playername: "terpko", uid: "1007820601979"},
    {playername: "hakipi", uid: "2545398846"},
    {playername: "TheGTRacer97", uid: "2299827182"},
    {playername: "The9axel5", uid: "2298814335"}
]


let userlistinitflag = 0;
let userdatapath = "./public/userlist";

function userlistinit() {
    // console.log(readfromfile(userdatapath+"-undefined.json"));
    if (userlistinitflag === 0 && readfromfile(userdatapath + "-undefined.json") === 1) {

        writetofile(userdatapath, userlist);
        console.log("written userlist =====================");
        userlistinitflag = 1;
    }

}

userlistinit();

// writetofile(userdatapath, userlist);

function getplayernames() {
    readfromfile(userdatapath + "-undefined.json", userlist);
    return userlist;

}

//todo we can get the uid from requesting

module.exports = {userlist, getplayernames};
