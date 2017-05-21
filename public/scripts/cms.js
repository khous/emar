/**
 * Created by kyle on 5/8/2017.
 */
var $ = require("jquery");
var async = require("async");

//TODO Set soundfiles in set model
//TODO test removing qs and responses
//TODO Test the saving after removal

/**
 * Turn thing into an array if it isn't
 * @param thing
 */
function arrayify (thing) {
    return Array.isArray(thing) ? thing : typeof thing !== "undefined" ?  [thing] : [];
}

/**
 * Read base64 encded data from a file input
 * @param $fin The file input wrapped in jq
 * @param cb The callback called with the base64 data
 */
function getBase64FromFileInput ($fin, cb) {
    var file = $fin[0].files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function () {
        cb(null, reader.result);
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    } else {
        cb(null, "");
    }
}

function getFileInputBlobWrapper ($input) {
    return function (cb) {
        getBase64FromFileInput($input, cb);
    }
}

function Survey () {
    var that = this;
    var id = 0;
    this.greeting = "Greetings, would you like to play a game";
    this.questions = [];
    this.valediction = "Thanks for sharing";
    this.anotherQuestion = "Would you like to answer another question?";

    this.addQuestion = function (model) {
        //Construct dom, associate model
        var q = new Question();
        q.id = id++;
        that.questions.push(q);

        that.$questionsCont.append(q.render());
        q.onRemove = function () {
            that.removeQuestion(q.id);
        };

        if (model) { q.setModel(model); }
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

    that.loadSurvey = function (cb) {
        $.get("/surveys", function (response) {
            // debugger;
            that.setModel(response);
            cb();
        });
    };

    that.saveSurvey = function () {
        that.getModel(function (model) {
            $.ajax({
                url: "/surveys",
                type: "POST",
                data: JSON.stringify(model),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(){
                    console.log("what happened?", arguments);
                }
            });
        });
    };

    this.render = function () {
        var el = that.$el = $(
            "<div class='survey'>" +
                "<button class='save-butt'>Save <span class='saving'>|/--\</span></button>" +
                "<div class='survey-specs'>" +
                    "<input class='greetings' placeholder='Greeting Text' type='text'>" +
                    "<input class='greetings-sound' type='file'>" +
                    "<input class='greetings-sound-hid' type='hidden'>" +
                    "<input class='another-question' placeholder='Another Question Text'>" +
                    "<input class='another-q-sound' type='file'>" +
                    "<input class='another-q-sound-hid' type='hidden'>" +
                    "<input class='valediction'  placeholder='Valediction Text' type='text'>" +
                    "<input class='valediction-sound' type='file'>" +
                    "<input class='valediction-sound-hid' type='hidden'>" +
                    "<div class='questions'>" +
                    "<h4>Questions</h4>" +
                    "</div>" +
                    "<button class='add-more-butt'>Add Question</button>" +
                "</div>" +
            "</div>");
        that.$greetingsInput = el.find(".greetings");
        that.$greetingsSound = el.find(".greetings-sound");
        that.$greetingsSoundHid = el.find(".greetings-sound-hid");

        that.$anotherQuestionInput = el.find(".another-question");
        that.$anotherQuestionSound = el.find(".another-q-sound");
        that.$anotherQuestionSoundHid = el.find(".another-q-sound-hid");

        that.$valedictionInput  = el.find(".valediction");
        that.$valedictionSound  = el.find(".valediction-sound");
        that.$valedictionSoundHid  = el.find(".valediction-sound-hid");

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
            out.push(function (cb) {
                q.getModel(cb)
            });
        });
        return out;
    };
    //A survey has a list of questions, each question should perhaps be disableable
    //also, salutation and valediction, another question -- each of these with an associated sound file
    //Maybe a survey should have a name
    that.getModel = function (cb) {
        var questionGetters = that.getQuestionModels();
        async.parallel(questionGetters, function (err, questionModels) {
            async.parallel({
                greetingsSound: getFileInputBlobWrapper(that.$greetingsSound),
                anotherQuestionSound: getFileInputBlobWrapper(that.$anotherQuestionSound),
                valedictionSound: getFileInputBlobWrapper(that.$valedictionSound)
            }, function (err, result) {
                cb({
                    name:                   "Stress Survey",
                    questions:              questionModels,
                    greeting:               that.$greetingsInput.val(),
                    greetingsSound:         result.greetingsSound || that.$greetingsSoundHid.val(),
                    anotherQuestionText:    that.$anotherQuestionInput.val(),
                    anotherQuestionSound:   result.anotherQuestionSound || that.$anotherQuestionSoundHid.val(),
                    valediction:            that.$valedictionInput.val(),
                    valedictionSound:       result.valedictionSound || that.$valedictionSoundHid.val()
                });
            });

        });
    };

    that.setModel = function (m) {
        if (!m) {
            return;
        }

        that.$anotherQuestionSoundHid.val(m.anotherQuestionSound);
        that.$anotherQuestionInput.val(m.anotherQuestionText);
        that.$greetingsInput.val(m.greeting);
        that.$greetingsSoundHid.val(m.greetingsSound);
        that.$valedictionInput.val(m.valediction);
        that.$valedictionSoundHid.val(m.valedictionSound);
        //"";
        //"Stress Survey",
        arrayify(m.questions).forEach(function (q) {
            that.addQuestion(q);
        });
    };
}


function Question () {
    var that = this;
    var id = 0;
    this.questionText= "";
    this.questionResponses = [];

    that.addResponse = function (model) {
        var r = new Response();
        r.id = id++;
        that.$responseContainer.append(r.render());
        r.onRemove = function () {
            that.removeResponse(r.id);
        };

        that.questionResponses.push(r);

        if (model) {
            r.setModel(model);
        }
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
                "<input class='question-sound' type='file'/>" +
                "<input class='question-sound-hid' type='hidden'/>" +
                "<div class='responses'>" +
                    "<h4>Responses</h4>" +
                "</div>" +
                "<button class='add-response'> [ + ] </button>" +
            "</div>"
        );

        that.$questionText = el.find(".question-text");
        that.$questionSound = el.find(".question-sound");
        that.$questionSoundHid = el.find(".question-sound-hid");
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
            out.push(function (cb) {
                r.getModel(cb)
            });
        });

        return out;
    };

    //Each question has its own text, sound and an array of responses
    that.getModel = function (cb) {
        var responses = that.getResponseModels();
        getBase64FromFileInput(that.$questionSound, function (err, qSound) {
            async.parallel(responses, function (err, results) {
                cb(null, {
                    sound: qSound || that.$questionSoundHid.val(),
                    text: that.$questionText.val(),
                    responses: results
                });
            });
        });
    };

    that.setModel = function (m) {
        that.$questionText.val(m.text);
        that.$questionSoundHid.val(m.sound);

        arrayify(m.responses).forEach(function (r) {
            that.addResponse(r);
        });
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

        that.$responseText = el.find(".response-text");
        that.$responseSoundFile = el.find(".response-sound");
        that.$responseSoundFileHid = el.find(".response-sound-hid");
        that.$eyesContainer = el.find(".eyes");

        that.$removeResponse = el.find(".remove-response");
        that.$removeResponse.click(function () {
            that.onRemove();
        });

        that.leftEye = new Eye();
        that.rightEye = new Eye();

        that.$eyesContainer
            .append(that.leftEye.render())
            .append(that.rightEye.render());

        return el;
    };

    that.onRemove = function () { };

    //Each response has text, sound and eyes as an expression
    that.getModel = function (cb) {
        getBase64FromFileInput(that.$responseSoundFile, function (err, responseSound) {
            cb(null, {
                text: that.$responseText.val(),
                sound: responseSound || that.$responseSoundFileHid.val(),
                leftEye: that.leftEye.getModel(),
                rightEye: that.rightEye.getModel()
            });
        });
    };

    //Set all those deets. This includes building the eyes
    that.setModel = function (m) {
        that.$responseText.val(m.text);
        that.$responseSoundFileHid.val(m.sound);

        that.leftEye.setModel(m.leftEye);
        that.rightEye.setModel(m.rightEye);
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

    //Receive the fully fleshed out array. Set that, otherwise, initialize a new array for model which is empty
    that.setModel = function (eyeRay) {
        if (!Array.isArray(eyeRay)) {
            return;//We should already have an empty model
        }

        //otherwise it is an array, update it in the DOM to reflect the incoming model
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                setColor(that.model[i][j], !!eyeRay[i][j]);
            }
        }
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

    var surveyNode = survey.render();

    survey.loadSurvey(function () {
        cont.append(surveyNode);
    });

});