/**
 * Main control flow for the survey. Lots of nested callbacks. Quite messy.
 * This should be refactored.
 */
var $ = require("jquery");
var survey = require("./survey");
var main;
var count = 0;
var allOn = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];

var responses = [
    {
        txt: "Oh no, I'm sorry to hear that.",
        eyes: allOn
    }, {
        txt: "I'm feeling about the same.",
        eyes: allOn
    }, {
        txt: "Glad to hear that.",
        eyes: allOn
    }, {
        txt: "Glad to hear that.",
        eyes: allOn
    }
];

/**
 * Though this is static, this is a good starting point for how these can be stored on the backend. In addition to what's
 * there currently, we need urls to sound files. I guess that will be per response.
 * @type {[*]}
 */
var questions = [{//XHR get dis
    eyes: allOn,
    q: "How stressed do you feel right now?",
    resp: [//This one is slightly different from the others. Mainly it's inverted.
        { txt: "No stress, That's great to hear!", eyes: allOn },
        { txt: "Glad to hear that.", eyes: allOn },
        { txt: "I'm feeling about the same.", eyes: allOn },
        { txt: "Oh no, I'm sorry to hear that.", eyes: allOn }
    ]
}, {
    eyes: allOn,
    q: "What is your energy level right now?",
    resp: responses
}, {
    eyes: allOn,
    q: "How is your mood right now?",
    resp: responses
}];

/**
 * Display the greeting view.
 */
function greetings () {
    count = 0;
    main.html(survey.greeting());

    main.find("button.hi").click(function () {
        //Unhide greet text
        main.find(".greeting-button").hide();
        main.find(".greeting-text").removeClass("hidden");//play greeting audioi
    });

    main.find("button.yes").click(function () {
        //start survey
        askQuestion();
    });

    main.find("button.no").click(function () {
        endSurvey("That's okay. Find me later if you feel like talking.");
    });

    //HI can I axe you a question?
    //If yes, do ask
    //else say it's fine when it's really not
}

/**
 * Ask the current question, which is indexed by the global 'count'. (It's not really global thanks to browserify)
 */
function askQuestion () {
    main.html(survey.getHtml(questions[count]));
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
    main.html(msg);

    setTimeout(function () {
        greetings();
    }, 3000);
}

/**
 * Respond when the user accepts answering another question
 */
function another () {
    main.find(".survey").html(
        "Thanks for sharing that with me. Would you like to answer another question? <br />" +
        "<button class='yes btn btn-default'>Yes</button><button class='no btn btn-default'>No</button>"
    );

    main.find(".yes").click(function () {
        askQuestion();
    });
    main.find(".no").click(function () {
        endSurvey("Thanks for sharing that with me, I hope to see you again.");
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
    var resps = questions[count].resp;
    var responseValue = map(99, resps.length - 1, main.find(".leich").val());
    var response = resps[responseValue].txt;
    var cont = (count + 1) < questions.length;
    main.html(survey.response(response, cont));
    setTimeout(function () {
        if (cont) {
            count++;
            another();
            //hookup to yes and no
        } else {
            endSurvey("Thanks for sharing that with me, I hope to see you again.");
            //do some set timeout to show greeting again, also show greeting again on screen touch. Whichever is first
            //blow away screen listener when timeout expires and cancel timeout when screen is touched
            //Thank for sharing with me
        }
    }, 3000);

}

/**
 * Initialize the survey, first showing the greeting.
 */
$(function () {
    main = $("#main-container");
    greetings();

});