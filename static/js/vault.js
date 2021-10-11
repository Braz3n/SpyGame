let answers = [];
let selectedVaultScreen = null;
let selectedVaultScreenDiv = null;

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

function keypadCallback(event) {
    if (selectedVaultScreen == null) {
        return;
    }

    if (event.target.attributes["data-value"].nodeValue == "CLR") {
        selectedVaultScreenDiv.textContent = "";
    }
    else if (selectedVaultScreenDiv.textContent.length < 4) {
        selectedVaultScreenDiv.textContent += event.target.attributes["data-value"].nodeValue; 
    }
}

function setupKeypadCallbacks() {
    document.getElementById('keypad-div0').addEventListener('click', keypadCallback);
    document.getElementById('keypad-div1').addEventListener('click', keypadCallback);
    document.getElementById('keypad-div2').addEventListener('click', keypadCallback);
    document.getElementById('keypad-div3').addEventListener('click', keypadCallback);
    document.getElementById('keypad-div4').addEventListener('click', keypadCallback);
    document.getElementById('keypad-div5').addEventListener('click', keypadCallback);
    document.getElementById('keypad-div6').addEventListener('click', keypadCallback);
    document.getElementById('keypad-div7').addEventListener('click', keypadCallback);
    document.getElementById('keypad-div8').addEventListener('click', keypadCallback);
    document.getElementById('keypad-div9').addEventListener('click', keypadCallback);
    document.getElementById('keypad-divCLR').addEventListener('click', keypadCallback);
}

function vaultScreenCallback(event) {
    if (selectedVaultScreen != null) {
        selectedVaultScreen.style.strokeWidth = 1;
    }
    console.log(event.target.attributes["data-svg-id"].nodeValue);
    selectedVaultScreen = document.getElementById(event.target.attributes["data-svg-id"].nodeValue);
    selectedVaultScreenDiv = event.target;
    selectedVaultScreen.style.strokeWidth = 3;
}

function setupVaultScreenCallbacks() {
    document.getElementById('vault-screen-div2').addEventListener('click', vaultScreenCallback);
    document.getElementById('vault-screen-div4').addEventListener('click', vaultScreenCallback);
    document.getElementById('vault-screen-div6').addEventListener('click', vaultScreenCallback);
    document.getElementById('vault-screen-div8').addEventListener('click', vaultScreenCallback);
    document.getElementById('vault-screen-div10').addEventListener('click', vaultScreenCallback);
    document.getElementById('vault-screen-div12').addEventListener('click', vaultScreenCallback);
}

$(document).ready(function() {
    getAnswersFromUrl();
    getVaultSvg();
    setupKeypadCallbacks();
    setupVaultScreenCallbacks();
});