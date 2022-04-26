const apicall = require('./components/apicall')
const express = require('express')
const path = require('path')
const cool = require('cool-ascii-faces');
const PORT = process.env.PORT || 3002
const requestloop = require('./components/requestloop')
const dotenv = require("dotenv")
const cors = require('cors');
require('dotenv').config({path: ".env." + process.env.NODE_ENV}); //load the env file accordingly

//database related
const {Pool} = require('pg');
const {
    getplayernames,
    getplayeruid,
    gethighdemandlist,
    getfreehighdemandcredit
} = require("./components/usermanagement");
const wakeUpDyno = require("./components/keepawake");
const {getserverstatus} = require("./components/serverinfomgr");
const {readfromgamedb} = require("./components/datamgr");
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, ssl: {
        rejectUnauthorized: false
    }
});


//init parameters
// let para = -1;
// console.log(requestloop);


express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(cors())
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => {
        res.render('pages/index')
        // console.log("loaded main page");
    })
    .get('/cool', (req, res) => {
        res.send(cool())
    })
    .get('/switch', (req, res) => {

        requestloop.paraswitchexp();
        res.send("switch to " + requestloop.getrequesttypeexp());
    })
    .get('/apicalltest', (req, res) => {

        apicall.readjson();
        let data = undefined;
        data = apicall.getdatabase();
        let jsoncontent = JSON.stringify(data); //use this if use res.send
        res.json(data);
    })
    .get('/apicallbridge/:playernamereq', async (req, res) => {
        // apicall.setplayername(req.params.playernamereq);
        let data = undefined;
        data = await apicall.getbridgedata(req.params.playernamereq);
        res.send(data);
    })
    .get('/apicallgame/:playernamereq', (req, res) => {

        let data = undefined;
        data = apicall.getgamedata(req.params.playernamereq);
        res.send(data);
    })
    // .get('/apicallgameremove/:playernamereq', (req, res) => {
    //
    //     let data = undefined;
    //     // data = apicall.callgame(req.params.playernamereq);// dangerous func
    //     res.send(data);
    // })
    .get('/callgame', (req, res) => {

        let data = "something";
        data = apicall.callgame("Lundaki");
        // console.log(data);
        res.send(data);

    })
    .get('/getserverstatus', (req, res) => {

        let data = undefined;
        data = getserverstatus();
        res.send(data);

    })
    .get('/apitest', (req, res) => {
        // res.json({message: "Hello from hammerpoint server!"});
        res.send({message: "Hello from hammerpoint server!"});
    })
    .get('/api/:namereq', function (req, res) {
        // console.log(req.params.nameee);
        apicall.setplayername(req.params.namereq);
        res.send({"param": req.params.namereq});
    })
    .get('/getplayers', function (req, res) {
        // console.log(req.params.nameee);
        // apicall.getplayername();
        res.send(getplayernames());
    })
    .get('/gethighdemandlist', function (req, res) {
        // console.log(req.params.nameee);
        // apicall.getplayername();
        res.send(gethighdemandlist());
    })
    .get('/getuidlocal/:playernamereq', function (req, res) {
        // console.log(req.params.nameee);
        // apicall.getplayername();
        res.send(getplayeruid(req.params.playernamereq));
    })
    .get('/getfreehighdemandcredit', function (req, res) {
        // console.log(req.params.nameee);
        // apicall.getplayername();
        res.json(getfreehighdemandcredit());
    })
    .get('/db', async (req, res) => {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM bridgedata');
            // console.log(result);
            const results = {'results': (result) ? result.rows : null};
            console.log(results);
            // res.render('pages/db', results);
            res.json(results.results[0].objdata);
            client.release();

        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    })
    .get('/readgamedb', async (req, res) => {
        let data = undefined;
        await readfromgamedb(data,"akabox218");
        res.send(data);
    })
    .get('/dbwrite/:uid/:username', async (req, res) => {
        let data=apicall.getbridgedata("terpko");
        data = JSON.parse(data);
        console.log(data);

        try {
            const client = await pool.connect();
            try {
                const result = await client.query(`
                    INSERT INTO public.bridgedata (uid, username, objdata)
                    VALUES ('` + req.params.uid + `'::text, '`+req.params.username+`'::text, '`+JSON.stringify(data.realtime)+`'::jsonb)
                returning uid;




            `);
            } catch (err) {
                console.log("this is the catch");
                // console.log(err);
                const result = await client.query(`
                    UPDATE public.bridgedata
                    SET username = '`+req.params.username+`'::text,
                           objdata = '` + JSON.stringify(data.global.badges) + `'::jsonb
                    WHERE
                        uid = '`+req.params.uid+`';

                `);
            }

            // console.log(result);
            // const results = {'results': (result) ? result.rows : null};

            // console.log(results.results);
            // res.render('pages/db', results);
            client.release();

            res.send(data.global);

        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    })
    .listen(PORT, () => {
        console.log(`Listening on ${PORT}` + "  running on " + process.env.ENVVAL);
        wakeUpDyno(process.env.DYNO_URL);
    });
