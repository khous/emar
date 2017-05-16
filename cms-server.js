/**
 * Skeleton web server. Will support getting surveys and receiving responses.
 * TODO, endpoint for controlling the eyes.
 */
var express = require('express');
var app = express();
var surveys = require("./surveys/surveys");
var PORT = 1337;//TODO some server config mightbe necessary

app.use("/styles", express.static(__dirname + "/public/styles"));
app.use("/scripts", express.static(__dirname + "/public/scripts"));
var bp = require("body-parser");

app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

/**
 * Get route for home page. This will be a single page app.
 */
app.get('/home', function (req, res) {
    res.sendFile(__dirname + "\\public\\cms.html");
});

app.post("/surveys", function (req, res, next) {
    console.log(req.body);
});


//Listen on specified port.
app.listen(PORT, function () {
    console.log('emar listening on port ' + PORT);
});
