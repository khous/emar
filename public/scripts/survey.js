/**
 * This file generates the HTML required for a survey
 */

module.exports = {
    /**
     * Let survey data have all the pertinent information required to administer a survey
     *
     * IN THE FUTURE we can switch on something like 'surveyType' if we want to have different types of questions.
     * We can also dump this pattern completely.
     *
     * @param surveyData The object holding the survey question data
     * @param surveyData.questionText
     * @param surveyData.soundfilePath
     */
    getHtml: function (surveyData) {
        return "<div class='row'>" +
            "<div class='survey col-xs-6 col-xs-offset-3'>" +
                // "<audio src='" + surveyData.soundfilePath + "'></audio>" +
                surveyData.q +
                "<input class='leich' type='range' min='0' max='100' step='1'/>" +
                "<button class='btn btn-block btn-default'>Submit</button>" +
            "</div>" +
        "</div>"
    },

    response: function (res, continueSurvey) {
        return  "<div class='response row'>" +
                    "<div class='survey col-xs-6 col-xs-offset-3'>" +
                        "<div>" + res + "</div>" +
                    "</div>" +
                "</div>"
    },

    greeting: function () {
        return "<div class='greeting-button row'>" +
                    "<div class='col-xs-6 col-xs-offset-3'>" +
                        "<button class='hi btn btn-block btn-default'>Press to say hi</button>" +
                    "</div>" +
                "</div>" +
                "<div class='greeting-text row hidden'>" +
                    "<div class='survey col-xs-6 col-xs-offset-3'>" +
                        "<div>Hi, nice to meet you! I'm EMAR. <br />" +
                            "I'm excited to hear about your day. May I ask you a question?</div>" +
                        "<button class='yes btn btn-default'>Yes</button><button class='no btn btn-default'>No</button>" +
                    "</div>" +
                "</div>";
    }
};