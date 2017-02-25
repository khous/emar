var $ = require("jquery");
var survey = require("./survey");
var main;
var count = 0;

var questions = [{
    q: "How stressed do you feel right now?"
}, {
    q: "What is your energy level right now?"
}, {
    q: "How is your mood right now?"
}];

var responses = [
    "Glad to hear that.",
    "Glad to hear that.",
    "I'm feeling about the same.",
    "Oh no, I'm sorry to hear that."
];

function greetings () {
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
        //say That's okay. Find me later if you feel like talking. and then go back to greetings
    });


    //HI can I axe you a question?
    //If yes, do ask
    //else say it's fine when it's really not
}

function askQuestion () {

    main.html(survey.getHtml(questions[count]));
    main.find(".survey button").click(handleQuestionAnswered);
}

function map (i_end, out_end, i_value) {
    var ratio = i_value / i_end;
    var squashedValue = out_end * ratio;
    return Math.round(squashedValue);
}

function another () {
    main.find(".survey").html(
        "Thanks for sharing that with me. Would you like to answer another question? <br />" +
        "<button class='yes btn btn-default'>Yes</button><button class='no btn btn-default'>No</button>"
    );

    main.find(".yes").click(function () {
        askQuestion();
    });
    main.find(".no").click(function () {
        main.html("Thanks for sharing that with me, I hope to see you again.");
        //do some set timeout to show greeting again, also show greeting again on screen touch. Whichever is first
        //blow away screen listener when timeout expires and cancel timeout when screen is touched
        //Thank for sharing with me
    });
}

function handleQuestionAnswered () {
    //squash 0-99 into 0 - 3 to select appropriate response
    //show response
    //ask if we may have another
    var responseValue = map(99, 3, main.find(".leich").val());
    var response = responses[responseValue];
    var cont = count + 1 < responses.length;
    main.html(survey.response(response, cont));
    setTimeout(function () {
        if (cont) {
            count++;
            askQuestion();
            //hookup to yes and no
        } else {
            main.html("Thanks for sharing that with me, I hope to see you again.");
            //do some set timeout to show greeting again, also show greeting again on screen touch. Whichever is first
            //blow away screen listener when timeout expires and cancel timeout when screen is touched
            //Thank for sharing with me
        }
    }, 3000);

}

$(function () {
    main = $("#main-container");
    greetings();

});