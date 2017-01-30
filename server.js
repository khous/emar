var express = require('express');
var app = express();
var surveys = require("./surveys/surveys");
var PORT = 1337;//TODO some server config mightbe necessary

app.use(express.static("public"));

app.get('/', function (req, res) {
    res.sendFile("public/index.html");
});

app.get("/surveys/", function (req, res) {
    res.status(200).json(surveys);
});

app.listen(PORT, function () {
    console.log('emar listening on port ' + PORT);
});