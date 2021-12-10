
function validateData() {
    let codeInputIds = ["ans01", "ans02", "ans03", "ans04", "ans05", "ans06"];
    let allValid = true;

    codeInputIds.forEach(function (id) {
        let value = document.getElementById(id).value
        if (!/^\d{1,4}$/.test(value)) {
            // Regex to find a 1-4 digit number
            // Leading zeros are allowed.
            allValid = false;
        }
    })

    if (document.getElementById('vault-text').value == '') {
        // Check the vault string is not empty.
        allValid = false;
    } 

    if (allValid) {
        document.getElementById("submit-button").removeAttribute("disabled");
    }
    else {
        document.getElementById("submit-button").setAttribute("disabled", "");
    }
}

function loadVault() {
    let inputIds = ["ans01", "ans02", "ans03", "ans04", "ans05", "ans06"];
    let vaultCookie = "" 
    let vaultString = document.getElementById('vault-text').value

    inputIds.forEach(function (id, index) {
        document.cookie = id + '=' + document.getElementById(id).value + ';max-age=86400;SameSite=Strict;'
    })
    document.cookie = "vault-text=" + vaultString + ';max-age=86400;SameSite=Strict;'

    window.location.href = "/vault";
}

function registerCallbacks() {
    let inputIds = ["ans01", "ans02", "ans03", "ans04", "ans05", "ans06", "vault-text"];

    inputIds.forEach(function (id) {
        document.getElementById(id).addEventListener("input", validateData);
    })

    document.getElementById('submit-button').addEventListener("click", loadVault);
}

document.addEventListener("DOMContentLoaded", function() {
    registerCallbacks();
})