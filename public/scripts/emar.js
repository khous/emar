var $ = require("jquery");
var surveyGen = require("./survey");


$(function () {
    $.get("/surveys", function (surveys) {
        var sHtml = surveyGen.getHtml(surveys[0]);

        $("#main-container").html(sHtml);
    });


});