const fs = require("fs");
module.exports = {
    writetofile: function (localpath, data, playername) {
        data = JSON.stringify(data);
        fs.writeFile(localpath + "-" + playername + ".json", data, 'utf8', (err) => {

            if (err) {
                console.log(`Error writing file: ${err}`);
            } else {
                console.log(`File is written successfully for player ` + playername);
            }

        });

    },
    readfromfile: function (localpath, data) {
        try {
            let contents = fs.readFileSync(localpath, 'utf8');

            data = contents;
            return 0;

        } catch (err) {
            // console.error("file doesnt exist========================================== ");
            console.error(err);
            return 1;

        }
    }
}
