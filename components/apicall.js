const fs = require('fs');
let databases = undefined;
let bridgedata = undefined;
let gamedata = undefined;
let serverdata = undefined;
const localbridgepath = "./public/bridgedata";
const localgamepath = "./public/gamedata";

const usermanagementobj = require("./usermanagement")
const datamanagerobj = require("./datamgr")

let playername = "";

const request = require('request');
const {readfromfile} = require("./datamgr");
const {getplayeruid, highdemandlistmgr} = require("./usermanagement");
const {updateserverinfotimestamp, localserverpath} = require("./serverinfomgr");


module.exports = {
    callbridge: function (playername) {
        // console.log("call bridge========================="+playername);
        // func1 impl
        let playeruid = getplayeruid(playername);
        let optionsbridge = {
            'method': 'GET',
            'url': 'https://api.mozambiquehe.re/bridge?version=5&platform=PC&player=' + playername + '&auth=CrJTdFiQ8bFKtEHhIP5z',
            'headers': {}
        };
        // console.log(optionsbridge);// the request
        request(optionsbridge, function (error, response) {
            if (error) throw new Error(error);
            // console.log(response.body);
            bridgedata = JSON.parse(response.body);
            // console.log("call to write to file" + playername);
            datamanagerobj.writetofile(localbridgepath, bridgedata, playername);

            highdemandlistmgr(bridgedata, playername);

        });


        // console.log(fs);
        if (bridgedata) {
            // console.log("call to write file");
        }

    }, callgame: function (playername) {
        // func2 impl
        // console.log("call game=========================" + playername);
        let playeruid = getplayeruid(playername);

        let optionsgame = {
            'method': 'GET',
            'url': 'https://api.mozambiquehe.re/games?version=5&platform=PC&auth=7rggUEagkVtDVm3spk8Z&uid=' + playeruid,
            'headers': {}
        };
        // console.log(optionsgame);//the request
        request(optionsgame, function (error, response) {
            if (error) throw new Error(error);
            // console.log(response.body);
            gamedata = JSON.parse(response.body);
            datamanagerobj.writetofile(localgamepath, gamedata, playername)
        });



        return "manually remote call /game ";
    }, callserverstatus: function () {
        // func2 impl
        console.log("call serverstatus=========================");
        // let playeruid = getplayeruid(playername);

        let optionsserver = {
            'method': 'GET',
            'url': 'https://api.mozambiquehe.re/servers?auth=CrJTdFiQ8bFKtEHhIP5z',
            'headers': {}
        };
        // console.log(optionsgame);//the request
        request(optionsserver, function (error, response) {
            if (error) throw new Error(error);
            // console.log(response.body);
            serverdata = JSON.parse(response.body);
            datamanagerobj.writetofile(localserverpath, serverdata);
            updateserverinfotimestamp();
        });
        return "call remove server status  ";

    }
    , readjson: function (localpath) {
        let statuscode = -1;
        //file handling


        try {
            let contents = fs.readFileSync(localpath, 'utf8');

            databases = contents;

        } catch (err) {
            // console.error("file doesnt exist========================================== ");
            return 1;
            // console.error(err);
        }

    }, getdatabase: function () {
        return databases;
    }, getbridgedata: function (playernameval) {//todo if the user doesnt exist
//load local data first
        if (readfromfile(localbridgepath + "-" + playernameval + ".json", databases) === 1) {
            console.log("=====bridge file not exist for " + playernameval);
            return {'err': 'file not found'};
        } else {
            console.log("send bridgedata for" + playernameval);
            databases = readfromfile(localbridgepath + "-" + playernameval + ".json", databases);


            return databases;

        }


    }, getgamedata: function (playernameval) {

        if (readfromfile(localgamepath + "-" + playernameval + ".json", databases) === 1) {
            console.log("=====game file not exist for " + playernameval);
            return {'err': 'file not found'};
        } else {
            console.log("send game data for" + playernameval);
            databases = readfromfile(localgamepath + "-" + playernameval + ".json", databases);


            return databases;

        }


        if (!gamedata) {
            console.log("calling local game data");
            readfromfile(localgamepath, databases);
            return databases;
        } else {
            return gamedata;
        }

    }, setplayername: function (playernameval) {
        playername = playernameval;
        console.log("playername is " + playername);
    },


};
