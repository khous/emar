
var express = require('express');
var app = express();
var surveys = require("./surveys/surveys");
var PORT = 1337;//TODO some server config mightbe necessary
var DB = require("./db");

app.use("/styles", express.static(__dirname + "/public/styles"));
app.use("/scripts", express.static(__dirname + "/public/scripts"));
var bp = require("body-parser");

app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

DB(function (err, db) {
    /**
     * Get route for home page. This will be a single page app.
     */
    app.get('/home', function (req, res) {
        res.sendFile(__dirname + "/public/cms.html");
    });

    app.route("/surveys")
        .get(function (req, res) {
            db.collection("surveys").findOne(function (err, result) {
                res.status(200).json(result);
            })
        })
        .post(function (req, res, next) {
            db.collection("surveys").insertOne(req.body, function (err) {
                if (err) {
                    return res.status(500).json({ err: "something bad happened" });
                }

                res.status(200).json({ mess: "success" });
            });
        });


    //Listen on specified port.
    app.listen(PORT, function () {
        console.log('emar listening on port ' + PORT);
    });
});
