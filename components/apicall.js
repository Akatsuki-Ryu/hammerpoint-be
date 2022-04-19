const fs = require('fs');
let databases = undefined;
let bridgedata = undefined;
let gamedata = undefined;
const localbridgepath = "./public/bridgedata.json";
const localgamepath = "./public/gamedata.json";

let playername = "";

const request = require('request');




module.exports = {
    callbridge: function () {

        // func1 impl
        let optionsbridge = {
            'method': 'GET',
            'url': 'https://api.mozambiquehe.re/bridge?version=5&platform=PC&player='+playername+'&auth=7rggUEagkVtDVm3spk8Z',
            'headers': {}
        };
        console.log(optionsbridge);
        request(optionsbridge, function (error, response) {
            if (error) throw new Error(error);
            // console.log(response.body);
            bridgedata = JSON.parse(response.body);
        });

        console.log("call bridge=========================");
        // console.log(fs);
        if (bridgedata) {
            const data = JSON.stringify(bridgedata);
            fs.writeFile(localbridgepath, data, 'utf8', (err) => {

                if (err) {
                    console.log(`Error writing file: ${err}`);
                } else {
                    console.log(`bridge File is written successfully!`);
                }

            });
        }

    },
    callgame: function () {
        // func2 impl

        let optionsgame = {
            'method': 'GET',
            'url': 'https://api.mozambiquehe.re/games?version=5&platform=PC&auth=7rggUEagkVtDVm3spk8Z&uid=1007820601979',
            'headers': {}
        };

        request(optionsgame, function (error, response) {
            if (error) throw new Error(error);
            // console.log(response.body);
            gamedata = JSON.parse(response.body);
        });

        console.log("call game=====");
        if (gamedata) {
            const data = JSON.stringify(gamedata);
            fs.writeFile(localgamepath, data, 'utf8', (err) => {

                if (err) {
                    console.log(`Error writing file: ${err}`);
                } else {
                    console.log(`gamedata file is written successfully!`);
                }

            });
        }
    },
    readjson: function (localpath) {
        //file handling
        fs.readFile(localpath, 'utf8', (err, data) => {

            if (err) {
                console.log(`Error reading file from file: ${err}`);
            } else {

                // parse JSON string to JSON object
                databases = JSON.parse(data);

                // print all databases
                // databases.forEach(db => {
                //     console.log(`${db.name}: ${db.type}`);
                // });
                // console.log(databases);
                // return databases;w
            }

        });
    },
    getdatabase: function () {
        return databases;
    },
    getbridgedata: function () {
        if (!bridgedata) {
            console.log("calling local bridge data");
            this.readjson(localbridgepath);
            return databases;
        } else {
            return bridgedata;
        }

    },
    getgamedata: function () {
        if (!gamedata) {
            console.log("calling local game data");
            this.readjson(localgamepath);
            return databases;
        } else {
            return gamedata;
        }

    },
    setplayername:function (playernameval) {
        playername = playernameval;
        console.log("playername is " + playername);
    }

};
