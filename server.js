var express = require('express');
var app = express();
var PORT = 1337;//TODO some server config mightbe necessary

app.use(express.static("public"));

app.get('/', function (req, res) {
    res.sendFile("public/index.html");
});

app.listen(PORT, function () {
    console.log('emar listening on port ' + PORT);
});