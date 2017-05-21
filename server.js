/**
 * Skeleton web server. Will support getting surveys and receiving responses.
 * TODO, endpoint for controlling the eyes.
 */
var express = require('express');
var app = express();
var surveys = require("./surveys/surveys");
var PORT = 1337;//TODO some server config mightbe necessary
var request = require("request");

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
var port = new SerialPort("/dev/ttyACM0", {
    baudRate: 9600
});

DB(function (err, db) {
    var proc;


    app.post("/record/", function () {
         var d = new Date();
        proc = exec("avcon -f video4linux2 -r 25 -i /dev/video0 -f alsa -i plughw:U0x460x825 -y ./videos/" + d.toString()  + "-webcam.avi",
            function (error, stdout, stderr) { });
    });

    app.post("/stop-record/", function () {
        proc.kill("SIGTERM");
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

        //TODO, josh put code here. serialData should be in the correct form according to your changes to the readme
        port.write(eyes);
        //Do a sys call to set the EYES based on this array
        return res.status(200).json({ status: "SUCCESS" });
    });

    //Just need to aggregate all responses. maybe capture time
    //So post will look like
    app.post("/responses/", function (req, res) {
        //save the response
        //THat would be their value, and the ID of the question, i guess
        db.collection("responses").insertOne(req.body, function (err) {
            if (err) {
                res.status(400).json({ err: "something bad happened" });
            } else {
                res.status(200).json({});
            }
        });
    });

    //Listen on specified port.
    app.listen(PORT, function () {
        console.log('emar listening on port ' + PORT);
    });
});
