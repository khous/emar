/**
 * Skeleton web server. Will support getting surveys and receiving responses.
 * TODO, endpoint for controlling the eyes.
 */
var express = require('express');
var app = express();
var surveys = require("./surveys/surveys");
var PORT = 1337;//TODO some server config mightbe necessary

app.use(express.static("public"));

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
    res.status(200).json(surveys);
});

//Listen on specified port.
app.listen(PORT, function () {
    console.log('emar listening on port ' + PORT);
});