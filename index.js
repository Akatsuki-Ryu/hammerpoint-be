const apicall = require('./components/apicall')
const express = require('express')
const path = require('path')
const cool = require('cool-ascii-faces');
const PORT = process.env.PORT || 3002
const requestloop = require('./components/requestloop')

//database related
const {Pool} = require('pg');
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
    .get('/apicallbridge', (req, res) => {

        apicall.readjson();
        let data = undefined;
        data = apicall.getdatabase();
        let jsoncontent = JSON.stringify(data);
        res.send(jsoncontent);
    })
    .get('/apitest', (req, res) => {
        res.json({message: "Hello from hammerpoint server!"});
    })
    .get('/db', async (req, res) => {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM test_table');
            const results = {'results': (result) ? result.rows : null};
            res.render('pages/db', results);
            client.release();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`))
