const fs = require("fs");
const {Pool} = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, ssl: {
        rejectUnauthorized: false
    }
});
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
            // console.log(data);
            return data;

        } catch (err) {
            // console.error("file doesnt exist========================================== ");
            console.error(err);
            return 1;

        }
    },
    writetodb: async function ( data, playername, playeruid) {
        try {
            const client = await pool.connect();
            try {
                const result = await client.query('INSERT INTO "public"."bridgedata"("uid", "username") VALUES('+playeruid+', ' +playername+') RETURNING "uid", "username", "objdata";');
            }catch (err){
                console.log("this is the catch");
                // console.log(err);
                const result = await client.query('UPDATE "public"."bridgedata" SET "username"='+playername+' WHERE "uid"='+playeruid+' RETURNING "uid", "username", "objdata";\n');
            }

            // console.log(result);
            const results = {'results': (result) ? result.rows : null};

            console.log(results.results);
            client.release();

        } catch (err) {
            console.error(err);
        }

    }

}
