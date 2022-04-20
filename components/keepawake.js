const request = require("request");
const writetofileobj = require("./datamgr");


const wakeUpDyno = (url, interval = 25, callback) => {
    const milliseconds = interval * 60000;
    setTimeout(() => {

        try {
            console.log(`setTimeout called.`);
            // HTTP GET request to the dyno's url
            // fetch(url).then(() => console.log(`Fetching ${url}.`));
            // // func1 impl
            let optionkeepawake = {
                'method': 'GET',
                'url': url,
                'headers': {}
            };
            // console.log(optionsbridge);// the request
            request(optionkeepawake, function (error, response) {
                if (error) throw new Error(error);
                console.log("calling dyno " + url);

            });
        }
        catch (err) { // catch fetch errors
            console.log(`Error fetching ${url}: ${err.message} 
            Will try again in ${interval} minutes...`);
        }
        finally {

            try {
                callback(); // execute callback, if passed
            }
            catch (e) { // catch callback error
                callback ? console.log("Callback failed: ", e.message) : null;
            }
            finally {
                // do it all again
                return wakeUpDyno(url, interval, callback);
            }

        }

    }, milliseconds);
};

module.exports = wakeUpDyno;
