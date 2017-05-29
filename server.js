/**
 * Skeleton web server. Will support getting surveys and receiving responses.
 * TODO, endpoint for controlling the eyes.
 */
var express = require('express');
var app = express();
var surveys = require("./surveys/surveys");
var PORT = 1337;//TODO some server config mightbe necessary
var request = require("request");
var fs = require("fs");

app.use(express.static("public"));
var bp = require("body-parser");
var dns = require('dns');
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

var DB = require("./db");

//Stolen from stackoverflow
function checkInternet(cb) {
    dns.lookup('google.com',function(err) {
        cb(!(err && err.code === "ENOTFOUND"));
    });
}

var SerialPort = require("serialport");
const exec = require('child_process').exec;
const CSV_PAGE_SIZE = 50;
/*

var port = new SerialPort("/dev/ttyACM0", {
    baudRate: 9600
});
*/

DB(function (err, db) {
    var proc;


    app.post("/record/", function (req, res) {
        var d = new Date();
        /*
        proc = exec("avconv -f video4linux2 -r 25 -i /dev/video0 -f alsa -i plughw:U0x46d0x825 -y ./videos/gdrivefs/survey-results" +
        d.toISOString()  + "-webcam.avi",
        function (error, stdout, stderr) { });*/

        res.status(200).json({});
    });

    app.post("/stop-record/", function (req, res) {
        if (proc) {
            exec("pkill --signal SIGINT avconv");
            proc = undefined;
            console.log("killing it...");
        }
        res.status(200).json({});

    });

    /**
     * Get route for home page. This will be a single page app.
     */
    app.get('/', function (req, res) {
        res.sendFile("public/index.html");
    });

    /**
     * Get route for survey data, which is currently hardcoded. (Though this doesn't preclude good collaboration).
     */
    app.get("/surveys/", function (req, res) {
        var surveys = db.collection("surveys");
        checkInternet(function (connected) {
            if (connected) {
                //TODO config this url
                request("http://emar.entrydns.org/surveys", function (err, response, body) {
                    var survey = JSON.parse(body);
                    surveys.removeMany({}, function () {
                        surveys.insertOne(survey, function () {});

                        res.status(200).json(survey);
                    });

                });
            } else {//Fall back to my local database
                surveys.find({}).toArray(function (err, results) {
                    if (err) {
                        res.status(400).json({ err: "something bad happened" });
                    } else {
                        res.status(200).json(results);
                    }
                });
            }
        });
    });

    app.post("/eyes/", function (req, res) {
        var eyes = req.body.eyes;

        if (eyes.length !== 64) {
            return res.status(400).json({ err: "Eyes must be 64 numbers" });
        }


        /*port.write(eyes);*/
        //Do a sys call to set the EYES based on this array
        return res.status(200).json({ status: "SUCCESS" });
    });

    //Create the csv text
    function responseToCsv (responses) {
        var csvStr = "date-time,question-text,response-value,\r\n";

        if (!Array.isArray(responses)) {
            return "";
        }

        responses.forEach(function (r) {
            csvStr += `"${r.dateTime}","${r.question}","${r.value}"\r\n`;
        });

        return csvStr
    }

    function writeCsvToFile (csvStr, cb) {
        var fName = (new Date()).toISOString() + "-responses.csv";
        fName = fName.replace(/:/g, "o");
        fName = fName.replace(".", "o");
        fs.writeFile(__dirname + "/videos/gdrivefs/survey-results/" + fName, csvStr, function (err, res) {
            cb(err, res);
        });
    }

    var writing = false;
    function flushResponsesToCsv (force, cb) {
        var resps = db.collection("responses");

        if (writing) {
            //Do not succumb to double write
            return cb({ mess: "write in progress" });
        }

        writing = true;
        resps.find({}).count(function (err, count) {
            if ((force && (count > 0)) || (count > CSV_PAGE_SIZE)) {
                //get responses write out to file
                resps.find({}).toArray(function (err, results) {
                    var csvStr = responseToCsv(results);
                    writeCsvToFile(csvStr, function (err, res) {
                        if (err) {
                            writing = false;
                            return cb(err);
                        }

                        resps.removeMany({}, function (err, res) {
                            writing = false;
                            cb(err, res);
                        });
                    });
                });
            } else {
                writing = false;
                cb(null);
            }
        });
    }

    app.get("/flush-responses/", function (req, res) {
        flushResponsesToCsv(true, function () {
            res.status(200).json({ mess: "responses written" });
        });
    });

    //Just need to aggregate all responses. maybe capture time
    //So post will look like
    app.post("/responses/", function (req, res) {
        //save the response
        //THat would be their value, and the ID of the question, i guess
        //After do dis, then write out 50 responses to CSV file
        db.collection("responses").insertOne(req.body, function (err) {
            if (err) {
                res.status(400).json({ err: "something bad happened" });
            } else {
                res.status(200).json({});
            }

            flushResponsesToCsv(false, function (err) { });
        });
    });

    //Listen on specified port.
    app.listen(PORT, function () {
        console.log('emar listening on port ' + PORT);
    });
});
