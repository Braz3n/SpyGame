let answers = [];

function getVaultSvg() {
    $("#vault-svg-div").load("/static/img/vault.svg");
} 

function getAnswersFromUrl() {
    if (history.state == null) {
        // Read in the answers from the URL parameters,
        // and then modify the URL to hide them.
        // The answers are then stored in the history state
        // in case the page is refreshed for some reason.
        var url_parameters = new URLSearchParams(document.location.search.substring(1));
        answers.push(url_parameters.get("01"));
        answers.push(url_parameters.get("02"));
        answers.push(url_parameters.get("03"));
        answers.push(url_parameters.get("04"));
        answers.push(url_parameters.get("05"));
        answers.push(url_parameters.get("06"));
        history.replaceState({answers:answers}, "", "vault");
    }
    else{
        // If there is a history state for the page, load the
        // answers in from there instead.
        answers = history.state["answers"];
    }
}

$(document).ready(function() {
    getAnswersFromUrl();
    getVaultSvg();
});