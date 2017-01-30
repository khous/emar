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
        return "<div class='survey'>" +
            // "<audio src='" + surveyData.soundfilePath + "'></audio>" +
            surveyData.questionText +
            "<input type='range' min='0' max='100' step='1'/>" +
            "<button>Submit</button>" +
        "</div>"
    }
};