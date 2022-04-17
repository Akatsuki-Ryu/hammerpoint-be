const apicall = require('./components/apicall')
const express = require('express')
const path = require('path')
const cool = require('cool-ascii-faces');
const PORT = process.env.PORT || 3000

//database related
const {Pool} = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


//init parameters
let para = -1;


const requestloop = setInterval(function () {
    if (para === "game") {
        apicall.callgame();
    } else if (para === "bridge") {
        apicall.callbridge();
    }
}, 1000);

//start the loop
console.log(requestloop);


function paraswitch() {
    if (para === "game") {
        para = "bridge";
    } else {
        para = "game";
    }
}


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

        paraswitch();
        res.send("switch to " + para);
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
