const fs = require('fs');
let databases = undefined;


module.exports = {
    callbridge: function () {
        // func1 impl

        console.log("call bridge");
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
                console.log(`Error reading file from disk: ${err}`);
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
    }
};