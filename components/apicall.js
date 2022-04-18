const fs = require('fs');
let databases = undefined;
let bridgedata = undefined;

const request = require('request');
const options = {
    'method': 'GET',
    'url': 'https://api.mozambiquehe.re/bridge?version=5&platform=PC&player=akabox218&auth=7rggUEagkVtDVm3spk8Z',
    'headers': {}
};

module.exports = {
    callbridge: function () {
        // func1 impl

        request(options, function (error, response) {
            if (error) throw new Error(error);
            // console.log(response.body);
            bridgedata = JSON.parse(response.body);
        });

        console.log("call bridge=========================");
        // console.log(fs);
    },
    callgame: function () {
        // func2 impl
        console.log("call game");
    },
    readjson: function () {
        //file handling
        fs.readFile('./public/datasetgame.json', 'utf8', (err, data) => {

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
        return bridgedata;
    }
};
