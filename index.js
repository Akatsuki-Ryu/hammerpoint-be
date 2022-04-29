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
    getfreehighdemandcredit, getplayerlist
} = require("./components/usermanagement");
const wakeUpDyno = require("./components/keepawake");
const {getserverstatus, getmaprotation} = require("./components/serverinfomgr");
const {readfromgamedb, readfrombridgedb, readfromplayerlistdb, readfromgamedb24hours} = require("./components/datamgr");
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
    // .get('/cool', (req, res) => {
    //     res.send(cool())
    // })
    // .get('/switch', (req, res) => {
    //
    //     requestloop.paraswitchexp();
    //     res.send("switch to " + requestloop.getrequesttypeexp());
    // })
    // .get('/apicalltest', (req, res) => {
    //
    //     apicall.readjson();
    //     let data = undefined;
    //     data = apicall.getdatabase();
    //     let jsoncontent = JSON.stringify(data); //use this if use res.send
    //     res.json(data);
    // })
    .get('/getbridgedata/:playernamereq', async (req, res) => {
        // apicall.setplayername(req.params.playernamereq);
        let data = undefined;
        // data = await apicall.getbridgedata(req.params.playernamereq);
        data = await readfrombridgedb(data,req.params.playernamereq);
        res.send(data);
    })
    .get('/getgamedata/:playernamereq', async (req, res) => {

        let data = undefined;
        // data = apicall.getgamedata(req.params.playernamereq);
        data = await readfromgamedb(data,req.params.playernamereq);
        res.send(data);
    })
    .get('/getgamedataoneday', async (req, res) => {

        let data = undefined;
        // data = apicall.getgamedata(req.params.playernamereq);
        data = await readfromgamedb24hours(data);
        res.send(data);
    })
    .get('/callgame/:playernamereq', (req, res) => {

        let data = "something";
        data = apicall.callgame(req.params.playernamereq);
        // console.log(data);
        res.send(data);

    })
    .get('/getserverstatus', (req, res) => {

        let data = undefined;
        data = getserverstatus();
        res.send(data);

    })
    .get('/getmaprotation', (req, res) => {

        let data = undefined;
        data = getmaprotation();
        res.send(data);

    })
    .get('/apitest', (req, res) => {
        // res.json({message: "Hello from hammerpoint server!"});
        res.send({message: "!!!Hello from hammerpoint server!"});
    })
    // .get('/api/:namereq', function (req, res) {
    //     // console.log(req.params.nameee);
    //     apicall.setplayername(req.params.namereq);
    //     res.send({"param": req.params.namereq});
    // })
    .get('/getplayers', function (req, res) {
        // console.log(req.params.nameee);
        // apicall.getplayername();
        res.send(getplayerlist());
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
    .listen(PORT, () => {
        console.log(`Listening on ${PORT}` + "  running on " + process.env.ENVVAL);
        wakeUpDyno(process.env.DYNO_URL);
    });
