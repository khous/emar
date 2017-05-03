/**
 * Skeleton web server. Will support getting surveys and receiving responses.
 * TODO, endpoint for controlling the eyes.
 */
var express = require('express');
var app = express();
var surveys = require("./surveys/surveys");
var PORT = 1337;//TODO some server config mightbe necessary

app.use(express.static("public"));
var bp = require("body-parser");

app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

var DB = require("./db");

DB(function (err, db) {

    /**
     * Get route for home page. This will be a single page app.
     */
    app.get('/', function (req, res) {
        res.sendFile("public/index.html");
    });

    /**
     * Get route for survey data, which is currently hardcoded. (Though this doesn't preclude good collaboration).
     */
    app.get("/questions/", function (req, res) {
        db.collection("questions").find({}).toArray(function (err, results) {
            if (err) {
                res.status(400).json({ err: "something bad happened" });
            } else {
                res.status(200).json(results);
            }
        });

    });

    app.post("/eyes/", function (req, res) {
        var eyes = req.body.eyes;

        if (!Array.isArray(eyes)) {
            return res.status(400).json({ err: "Eyes must be an array" });
        }

        //Do a sys call to set the EYES based on this array
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
