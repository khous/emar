/**
 * Main control flow for the survey. Lots of nested callbacks. Quite messy.
 * This should be refactored.
 */
var $ = require("jquery");
var survey = require("./survey");
var thisSurvey; // to be retrieved from the server
var main;
var count = 0;
var questions = [];
/**
 * Turn thing into an array if it isn't
 * @param thing
 */
function arrayify (thing) {
    return Array.isArray(thing) ? thing : typeof thing !== "undefined" ?  [thing] : [];
}

function playSoundFromBase64 (snd) {
    if (!snd) { return; }
    var aud = new Audio(snd);
    aud.play();
    return aud;
}

function expressEyes (lEye, rEye) {
    var eyes = "";

    lEye.forEach(function (i) {
        eyes += i.join("");
    });

    rEye.forEach(function (i) {
        eyes += i.join("");
    });

    $.post("/eyes/", { eyes: eyes }, function () { });
}


/**
 * Display the greeting view.
 */
function greetings () {
    count = 0;
    main.html(survey.greeting(thisSurvey));
    main.find("button.hi").click(function () {
        //Unhide greet text
        expressEyes(thisSurvey.greetingLeftEye, thisSurvey.greetingRightEye);
        playSoundFromBase64(thisSurvey.greetingsSound);
        $.post("/record/", function () {});
        main.find(".greeting-button").hide();
        main.find(".greeting-text").removeClass("hidden");//play greeting audioi
    });

    main.find("button.yes").click(function () {
        //start survey
        askQuestion();
    });

    main.find("button.no").click(function () {
        endSurvey(thisSurvey.valediction);
    });

    //HI can I axe you a question?
    //If yes, do ask
    //else say it's fine when it's really not
}

/**
 * Ask the current question, which is indexed by the global 'count'. (It's not really global thanks to browserify)
 */
function askQuestion () {
    var q = questions[count];
    expressEyes(thisSurvey.restingLeftEye, thisSurvey.restingRightEye);
    playSoundFromBase64(q.sound);
    main.html(survey.getHtml(q));
    main.find(".survey button").click(handleQuestionAnswered);
}

function map (i_end, out_end, i_value) {
    var ratio = i_value / i_end;
    var squashedValue = out_end * ratio;
    return Math.round(squashedValue);
}

/**
 * End the survey with the supplied message. Reset vars
 * @param msg The message to display
 */
function endSurvey (msg) {
    count = 0;
    playSoundFromBase64(thisSurvey.valedictionSound);
    main.html(msg);
    $.post("/stop-record/", function () {});

    setTimeout(function () {
        greetings();
    }, thisSurvey.afterSurveyDuration || 3000);
}

/**
 * Respond when the user accepts answering another question
 */
function another () {
    expressEyes(thisSurvey.restingLeftEye, thisSurvey.restingRightEye);
    playSoundFromBase64(thisSurvey.anotherQuestionSound);
    main.find(".survey").html(
        `${thisSurvey.anotherQuestionText}<br /> 
        <button class='yes btn btn-default'>Yes</button><button class='no btn btn-default'>No</button>`
    );

    main.find(".yes").click(function () {
        askQuestion();
    });
    main.find(".no").click(function () {
        endSurvey(thisSurvey.valediction);
        //do some set timeout to show greeting again, also show greeting again on screen touch. Whichever is first
        //blow away screen listener when timeout expires and cancel timeout when screen is touched
        //Thank for sharing with me
    });
}

/**
 * Handle the user response. Show our own response.
 */
function handleQuestionAnswered () {
    //squash 0-99 into 0 - 3 to select appropriate response
    //show response
    //ask if we may have another
    var question = questions[count];
    var resps = question.responses;
    var respVal = main.find(".leich").val();

    $.post("/responses/", {
        dateTime: new Date(),
        question: question.text,
        value: +respVal
    }, function () { });

    var responseValue = map(99, resps.length - 1, respVal);
    var respObject = resps[responseValue];

    expressEyes(respObject.leftEye, respObject.rightEye);

    var response = respObject.text;
    var cont = (count + 1) < questions.length;
    main.html(survey.response(response, cont));
    playSoundFromBase64(respObject.sound);
    setTimeout(function () {
        if (cont) {
            count++;
            another();
            //hookup to yes and no
        } else {
            endSurvey(thisSurvey.valediction);
            //do some set timeout to show greeting again, also show greeting again on screen touch. Whichever is first
            //blow away screen listener when timeout expires and cancel timeout when screen is touched
            //Thank for sharing with me
        }
    }, thisSurvey.afterQuestionDuration ||  3000);

}

/**
 * Initialize the survey, first showing the greeting.
 */
$(function () {
    $.get("/surveys/", function (surveyData) {
        thisSurvey = surveyData;

        questions = arrayify(surveyData.questions);
        main = $("#main-container");
        greetings();
    });
});