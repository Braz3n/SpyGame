const keypad_click_audio = new Howl({src:'/static/sfx/keypad_click.mp3'});
const handle_failure_audio = new Howl({src:'/static/sfx/handle_failure.mp3'});
const vault_alarm_audio = new Howl({src:'/static/sfx/vault_alarm.mp3', loop:true});
const vault_open_audio = new Howl({src:'/static/sfx/vault_open.mp3'});
const vault_open_alarm_audio = new Howl({src:'/static/sfx/vault_open_alarm.mp3'});


var answers = ["16", "25", "36", "49", "64", "81"];
let selectedVaultScreen = null;
let selectedVaultScreenDiv = null;

let vaultScreenDivIds = ['vault-screen-div2', 'vault-screen-div4', 'vault-screen-div6', 'vault-screen-div8', 'vault-screen-div10', 'vault-screen-div12']

function getVaultSvg() {
    $("#vault-svg-div").load("/static/img/vault.svg", vaultHandleAnimationSetup);
} 

function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res
}

function getAnswersFromCookies() {
    let ans01 = getCookie("ans01");
    let ans02 = getCookie("ans02");
    let ans03 = getCookie("ans03");
    let ans04 = getCookie("ans04");
    let ans05 = getCookie("ans05");
    let ans06 = getCookie("ans06");
    let vault_text = getCookie("vault-text");

    if (ans01 && ans02 && ans03 && ans04 && ans05 && ans06 && vault_text) {
        answers = [ans01, ans02, ans03, ans04, ans05, ans06];
        document.getElementById('treasure-text').innerText = vault_text;
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
    keypad_click_audio.play();
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
    console.log(event);
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


    document.getElementById('vault-screen-div12').click();
}

function checkInputsCorrect() {
    let answerMissing = false;
    let answersCopy = Array.from(answers);
    console.log(answers);
    if (answers.length == 0) {
        return false;
    }

    vaultScreenDivIds.forEach(function (divId) {
        let answerIndex = answersCopy.indexOf(document.getElementById(divId).textContent);
        console.log(document.getElementById(divId).textContent, answerIndex);
        if (answerIndex == -1) {
            answerMissing = true;
        }
        else {
            // Cut out the discovered answer from the array to prevent duplicate detections.
            answersCopy.splice(answerIndex, 1);
        }
    })

    return !answerMissing;
}

function vaultHandleCallback() {
    if (checkInputsCorrect()) {
        vault_open_alarm_audio.play();
        document.getElementById("AlertLights").classList.add("alert-light-drop-animation");
        document.getElementById("AlertReflectorLeft").classList.add("alert-light-reflector-animation");
        document.getElementById("AlertReflectorRight").classList.add("alert-light-reflector-animation");
        vaultScreenDivIds.forEach(function (divId) {
            document.getElementById(divId).classList.add("vault-screen-clear-animation");
        })
        document.getElementById("VaultHandle").classList.add("handle-success-animation");
        document.getElementById("VaultDoorDrop").classList.add("vault-drop-animation");
        document.getElementById("VaultDoorRoll").classList.add("vault-roll-animation");
    }
    else {
        handle_failure_audio.play();
        document.getElementById("VaultHandle").classList.add("handle-fail-animation");
    }
}

function vaultHandleAnimationSetup() {
    document.getElementById('vault-handle-div').addEventListener('click', vaultHandleCallback);
    document.getElementById('VaultHandle').addEventListener('animationend', function (event) {
        console.log(event);
        event.target.classList.remove('handle-fail-animation');
    });

    setupVaultScreenCallbacks();
}

$(document).ready(function() {
    getAnswersFromCookies();
    getVaultSvg();
    setupKeypadCallbacks();
});