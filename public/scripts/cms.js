/**
 * Created by kyle on 5/8/2017.
 */
var $ = require("jquery");



function Survey () {
    var that = this;
    var id = 0;
    this.greeting = "Greetings, would you like to play a game";
    this.questions = [];
    this.valediction = "Thanks for sharing";
    this.anotherQuestion = "Would you like to answer another question?";

    this.addQuestion = function () {
        //Construct dom, associate model
        var q = new Question();
        q.id = id++;
        that.questions.push(q);

        that.$questionsCont.append(q.render());
        q.onRemove = function () {
            that.removeQuestion(q.id);
        };
    };

    this.removeQuestion = function (id) {
        //Remove DOM and model
        for (var i = 0;  i < that.questions.length; i++) {
            var q = that.questions[i];
            if (q.id === id) {
                q.destroy();
                that.questions.splice(i, 1);
            }
        }
    };

    that.saveSurvey = function () {
        var model = that.getModel();

        $.post("/surveys", model, function () {
            console.log("what happened?", arguments);
        });
    };

    this.render = function () {
        var el = that.$el = $(
            "<div class='survey'>" +
                "<button class='save-butt'>Save <span class='saving'>|/--\</span></button>" +
                "<div class='survey-specs'>" +
                    "<input class='greetings' placeholder='Greeting Text' type='text'>" +
                    "<input class='another-question' placeholder='Another Question Text'>" +
                    "<input class='valediction'  placeholder='Valediction Text' type='text'>" +
                    "<div class='questions'>" +
                        "<h4>Questions</h4>" +
                    "</div>" +
                    "<button class='add-more-butt'>Add Question</button>" +
                "</div>" +
            "</div>");
        that.$greetingsInput = el.find(".greetings");
        that.$anotherQuestionInput = el.find(".another-question");
        that.$valedictionInput  = el.find(".valediction");
        that.$addMoreButt = el.find(".add-more-butt");
        that.$questionsCont = el.find(".questions");
        that.$saveButt = el.find(".save-butt");

        that.$saveButt.click(function () {
            that.saveSurvey();
        });

        that.$addMoreButt.click(function () {
            that.addQuestion();
        });

        return el;
    };

    this.destroy = function () {
        that.$el.remove();
    };

    that.getQuestionModels = function () {
        var out = [];
        that.questions.forEach(function (q) {
            out.push(q.getModel());
        });
        return out;
    };
    //A survey has a list of questions, each question should perhaps be disableable
    //also, salutation and valediction, another question -- each of these with an associated sound file
    //Maybe a survey should have a name
    that.getModel = function () {
        return {
            name: "Stress Survey",
            questions: that.getQuestionModels(),
            greeting: that.$greetingsInput.val(),
            greetingSound: "",
            anotherQuestionText: that.$anotherQuestionInput.val(),
            valediction: that.$valedictionInput.val()
        };
    };

    that.setModel = function () {

    };
}


function Question () {
    var that = this;
    var id = 0;
    this.questionText= "";
    this.questionResponses = [];

    that.addResponse = function () {
        var r = new Response();
        r.id = id++;
        that.$responseContainer.append(r.render());
        r.onRemove = function () {
            that.removeResponse(r.id);
        };

        that.questionResponses.push(r);
    };

    that.removeResponse = function (id) {
        for (var i = 0; i < that.questionResponses.length; i++) {
            var r = that.questionResponses[i];
            if (r.id === id) {
                r.destroy();
                that.questionResponses.splice(i, 1);
            }
        }
    };

    this.render = function () {
        var el = that.$el = $(
            "<div class='question'>" +
                "<button class='remove-question'>X</button>" +
                "<input class='question-text' placeholder='Question Text'/>" +
                "<div class='responses'>" +
                    "<h4>Responses</h4>" +
                "</div>" +
                "<button class='add-response'> [ + ] </button>" +
            "</div>"
        );

        that.$questionText = el.find(".question-text");
        that.$responseContainer = el.find(".responses");
        that.$removeButt = el.find(".remove-question");
        that.$removeButt.click(function () {
            that.onRemove();
        });

        that.$addResponse = el.find(".add-response");
        that.$addResponse.click(function () {
            that.addResponse();
        });

        return el;
    };

    this.destroy = function () {
        that.$el.remove();
    };

    this.onRemove = function () {};

    that.getResponseModels = function () {
        var out = [];

        that.questionResponses.forEach(function (r) {
            out.push(r.getModel());
        });

        return out;
    };

    //Each question has its own text, sound and an array of responses
    that.getModel = function () {
        return {
            text: that.$questionText.val(),
            responses: that.getResponseModels()
        };
    };

    that.setModel = function () {

    };
}

function Response () {
    var that = this;

    that.render = function  () {
        var el = that.$el = $(
            "<div class='response'>" +
                "<button class='remove-response'>X</button>" +
                "<input class='response-text'  placeholder='Response Text' type='text'/>" +
                "<input class='response-sound' type='file'/>" +
                "<div class='eyes'></div>" +
            "</div>"
        );

        that.$responseText = el.find(".repsonse-text");
        that.$responseSoundFile = el.find(".repsonse-sound");
        that.$eyesContainer = el.find(".eyes");
        that.leftEye = new Eye();
        that.rightEye = new Eye();

        that.$eyesContainer
            .append(that.leftEye.render())
            .append(that.rightEye.render());

        return el;
    };

    that.onRemove = function () { };

    //Each response has text, sound and eyes as an expression
    that.getModel = function () {
        return {
            text: that.$responseText.val(),
            sound: that.$responseSoundFile.val(),
            leftEye: that.leftEye.getModel(),
            rightEye: that.rightEye.getModel()
        };
    };

    that.setModel = function () {

    };
}

function Eye () {
    var that = this;


    function setColor (pm, write) {

        if (typeof write === "undefined") {
            write = !pm.on;
        }

        pm.on = write;
        pm.$el.css({ "background": write ? "#44F" : "none"});
    }
    var writing = false,
        writeIfTrue = false;

    function createEyeGrid ($container) {
        var model = that.model = [[], [], [], [], [], [], [], []];
        for (var i = 0; i < 8; i++) {
            var innerCont = $("<div>");
            $container.append(innerCont);
            for (var j = 0; j < 8; j++) {
                var pxl = $("<span class='eye-pixel'>");
                var pmod = { $el: pxl, on: false, x: i, y: j };
                pxl.click(function (pm) {
                    return function (e) {
                        setColor(pm, !pm.on);
                    };
                }(pmod));

                /*               // //Set mouse is down state. Are we erasing or writing?
                 // pxl.on("mousedown", function (pm) {
                 //     //set a mouse up handler which cleans itself up
                 //     //writing then equals
                 //     return function () {
                 //         $("body").one("mouseup", function () {
                 //             writing = false;
                 //
                 //         });
                 //
                 //         writing = true;
                 //         writeIfTrue = !pm.on;
                 //         setColor(pm, writeIfTrue);
                 //     };
                 // }(pmod));
                 //
                 // pxl.on("mouseenter", function (pm) {
                 //     return function (e) {
                 //         if (writing) {
                 //             setColor(pm, writeIfTrue);
                 //         } else if (e.which === 1) {//believe this is the LMB
                 //             setColor(pm);
                 //         }
                 //     }
                 // }(pmod));
                 */

                model[i][j] = pmod;//map back to pixels
                innerCont.append(pxl);
            }
        }
    }

    that.render = function () {
        var $outerContainer = that.$el = $("<div class='eye'>");
        createEyeGrid($outerContainer);

        return $outerContainer;
    };

    //Simply return model, a two dimensional array
    that.getModel = function () {
        var out = [[], [], [], [], [], [], [], []];
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                out[i][j] = +that.model[i][j].on;//Cast this to a 1/0
            }
        }
        return out;
    };

    that.setModel = function () {

    };
}


$(function () {
    // var leftEye = $("<div class='eye'>"),
    //     rightEye = $("<div class='eye'>");
    //
    //
    // $("#main-container").append(rightEye);
    //
    // leftEye = createEyeGrid(leftEye);//Exchange containers w/ models
    // rightEye = createEyeGrid(rightEye);

    var cont = $("#main-container")
        .addClass("cms");

    var survey =  new Survey();

    cont.append(survey.render());

});