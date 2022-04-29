require('dotenv').config({path: ".env." + process.env.NODE_ENV}); //load the env file accordingly
const fs = require("fs");
const {Pool} = require('pg');
const datapool = new Pool({
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
                console.log(`VVV File is written successfully for player ` + playername);
            }

        });

    }, readfromfile: function (localpath, data) {
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
    }, writetobridgedb: async function (data, playername, playeruid) {

        //purefy the dataset to remove unusual characters
        data = JSON.stringify(data);
        data = data.replace(/'/g, '');


        // console.log(data);
        try {
            const client = await datapool.connect();
            try {
                const result = await client.query(`
                    INSERT INTO public.bridgedata (uid, username, objdata)
                    VALUES ('` + playeruid + `'::text, '` + playername + `'::text, '` + data + `'::jsonb)
                returning uid;

            `);
            } catch (err) {
                // console.log("user exist ");
                // console.log(err);
                try {
                    const result = await client.query(`
                        UPDATE public.bridgedata
                        SET username = '` + playername + `'::text, 
                    objdata = '` + data + `'::jsonb
                    WHERE
                        uid = '` + playeruid + `'::text;

                `);
                } catch (err) {
                    console.log("soemthing go wrong withdata base for " + playername);
                    console.log(err);
                }

            }

            // console.log(result);
            // const results = {'results': (result) ? result.rows : null};

            // console.log(results.results);
            console.log("VVV bridge write to db for " + playername);
            client.release();

        } catch (err) {
            console.error(err);
        }

    }, writetogamedb: async function (data, playername) {

        //purefy the dataset to remove unusual characters
        let datapurified = JSON.stringify(data);
        datapurified = datapurified.replace(/'/g, '');
        datapurified = JSON.parse(datapurified);


        // console.log(data);
        try {
            const client = await datapool.connect();
            try {

                for (let i = data.length - 1; i >= 0; i--) {
                    // console.log("i " + i + "  " + data[i].gameStartTimestamp + " ");

                    const result = await client.query(`
                        INSERT INTO public."gamedata-` + playername + `" (
"timestamp", timeindex, playername, gamedata) VALUES (
'` + data[i].gameStartTimestamp + `'::text, '1'::text, '` + playername + `'::text, '` + JSON.stringify(datapurified[i]) + `'::jsonb)
 ON CONFLICT ("timestamp") DO UPDATE 
                        SET timeindex = '1'::text, playername = '` + playername + `'::text, gamedata = '` + JSON.stringify(datapurified[i]) + `'::jsonb ;

            `);
                }
            } catch (err) {
                console.log(err);
            }

            // console.log(result);
            // const results = {'results': (result) ? result.rows : null};

            // console.log(results.results);
            client.release();
            console.log("VVV game data written to db for " + playername);

        } catch (err) {
            console.error(err);
        }

    }, readfromgamedb: async function (data, playername) {
        let gamedataarray = [];
        //purefy the dataset to remove unusual characters
        // data = JSON.stringify(data);
        //data = data.replace(/'/g, '');


        // console.log(data);
        try {
            const client = await datapool.connect();
            try {

                const result = await client.query(`
                    SELECT gamedata
                    FROM public."gamedata-` + playername + `"
ORDER BY timestamp DESC 

            `);
                for (let i = 0; i < result.rows.length; i++) {
                    gamedataarray.push(result.rows[i].gamedata);
                    // console.log(result.rows[i].gamedata);
                }
                data = gamedataarray;

            } catch (err) {
                console.log(err);
            }

            // console.log(result);
            // const results = {'results': (result) ? result.rows : null};

            // console.log(results.results);
            client.release();
            console.log("<<<get gamedata from db for " + playername);
            return data;
        } catch (err) {
            console.error(err);
        }

    }, readfrombridgedb: async function (data, playername) {
        //purefy the dataset to remove unusual characters
        // data = JSON.stringify(data);
        //data = data.replace(/'/g, '');


        // console.log(data);
        try {
            const client = await datapool.connect();
            try {

                const result = await client.query(`

                    SELECT *
                    FROM public.bridgedata
                    WHERE username = '` + playername + `'
                    ORDER BY uid ASC

                `);
                data = result.rows[0].objdata;

            } catch (err) {
                console.log(err);
            }

            // console.log(result);
            // const results = {'results': (result) ? result.rows : null};

            // console.log(results.results);
            client.release();
            console.log("<<<get bridgedata from db for " + playername);
            return data;
        } catch (err) {
            console.error(err);
        }

    }, writetoplayerlistdb: async function (playerlistobj) {

        //purefy the dataset to remove unusual characters
        // data = JSON.stringify(data);
        // data = data.replace(/'/g, '');


        // console.log(data);
        try {
            const client = await datapool.connect();
            try {
                const result = await client.query(`
                    INSERT INTO public.playerlist (uid, playername, profilename, profilephoto, ingame, online,
                                                   highrequesttimestamp)
                    VALUES ('` + playerlistobj.uid + `'::text, '` + playerlistobj.playername + `'::text, '` + playerlistobj.profilename + `'::text, '` + playerlistobj.profilephoto + `'::text, '` + playerlistobj.ingame + `'::bigint, '` + playerlistobj.online + `'::bigint, '` + playerlistobj.highrequesttimestamp + `'::text)
 returning uid;

            `);
            } catch (err) {
                // console.log("user exist ");
                // console.log(err);
                try {
                    const result = await client.query(`
                        UPDATE public.playerlist
                        SET uid = '` + playerlistobj.uid + `'::text, playername = '` + playerlistobj.playername + `'::text, profilename = '` + playerlistobj.profilename + `'::text, profilephoto = '` + playerlistobj.profilephoto + `'::text, ingame = '` + playerlistobj.ingame + `'::bigint, online = '` + playerlistobj.online + `'::bigint, highrequesttimestamp = '` + playerlistobj.highrequesttimestamp + `'::text
                        WHERE
                            uid = '` + playerlistobj.uid + `';

                    `);
                } catch (err) {
                    console.log("soemthing go wrong withdata base for playerlist" );
                    console.log(err);
                }

            }

            // console.log(result);
            // const results = {'results': (result) ? result.rows : null};

            // console.log(results.results);
            console.log("VVV playerlist write to db for "  );
            client.release();

        } catch (err) {
            console.error(err);
        }

    },readfromplayerlistdb: async function (playerlist) {

        //purefy the dataset to remove unusual characters
        // data = JSON.stringify(data);
        // data = data.replace(/'/g, '');


        // console.log(data);
        try {
            const client = await datapool.connect();
            try {
                const result = await client.query(`
                  SELECT * FROM public.playerlist


            `);

                // console.log(result.rows);
                playerlist = result.rows;
                return result.rows;

            } catch (err) {
                // console.log("user exist ");
                // console.log(err);
                return 1;

            }

            // console.log(result);
            // const results = {'results': (result) ? result.rows : null};

            // console.log(results.results);
            console.log("VVV bridge write to db for " + playername);
            client.release();

        } catch (err) {
            console.error(err);
        }

    }

}
