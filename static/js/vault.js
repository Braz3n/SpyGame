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

function keypadClickCallback(event) {
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

function keypadMouseUpCallback(event) {
    document.getElementById(event.target.attributes["data-svg-id"].nodeValue).style.fill = "#FFFFFF"
}

function keypadMouseDownCallback(event) {
    document.getElementById(event.target.attributes["data-svg-id"].nodeValue).style.fill = "#707070"
}

function setupKeypadCallbacks() {
    let keypadDivIds = ["keypad-div0", "keypad-div1", "keypad-div2", "keypad-div3", "keypad-div4", "keypad-div5", "keypad-div6", "keypad-div7", "keypad-div8", "keypad-div9", "keypad-divCLR"]
    
    keypadDivIds.forEach(function (divName) {
        let targetDiv = document.getElementById(divName);
        targetDiv.addEventListener('click', keypadClickCallback);
        targetDiv.addEventListener('mouseup', keypadMouseUpCallback);
        targetDiv.addEventListener('mouseleave', keypadMouseUpCallback);
        targetDiv.addEventListener('mousedown', keypadMouseDownCallback);
    })
}

function vaultScreenCallback(event) {
    if (selectedVaultScreen != null) {
        selectedVaultScreen.style.strokeWidth = 1;
    }
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

function checkInputsCorrect() {
    let answerMissing = false;
    let vaultScreenDivIds = ['vault-screen-div2', 'vault-screen-div4', 'vault-screen-div6', 'vault-screen-div8', 'vault-screen-div10', 'vault-screen-div12']

    if (answers.length == 0) {
        return false;
    }

    vaultScreenDivIds.forEach(function (divId) {
        let answerIndex = answers.indexOf(document.getElementById(divId).textContent);
        if (answerIndex == -1) {
            answerMissing = true;
        }
    })

    return !answerMissing;
}

function vaultHandleCallback() {
    // if (checkInputsCorrect()) {
    if (true) {
    console.log("Success")
        document.getElementById("VaultHandle").classList.add("handle-success-animation");
        document.getElementById("VaultDoor").classList.add("vault-open-animation");
    }
    else {
        document.getElementById("VaultHandle").classList.add("handle-fail-animation");
    }
}

function vaultHandleAnimationSetup() {
    document.getElementById('vault-handle-div').addEventListener('click', vaultHandleCallback);
    document.getElementById('VaultHandle').addEventListener('animationend', function (event) {
        console.log(event);
        event.target.classList.remove('handle-fail-animation');
        event.target.classList.remove('handle-success-animation');
    });
}

$(document).ready(function() {
    getAnswersFromUrl();
    getVaultSvg();
    setupKeypadCallbacks();
    setupVaultScreenCallbacks();

    // The lazy way to wait for something to load in.
    // Might break once things are running over the internet.
    setTimeout(vaultHandleAnimationSetup, 100);
});