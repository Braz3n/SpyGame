
function validateData() {
    let inputIds = ["ans01", "ans02", "ans03", "ans04", "ans05", "ans06"];
    let allValid = true;

    inputIds.forEach(function (id) {
        let value = document.getElementById(id).value
        if (!/^\d{1,4}$/.test(value)) {
            // Regex to find a 1-4 digit number
            // Leading zeros are allowed.
            allValid = false;
        }
    })

    if (allValid) {
        document.getElementById("submit-button").removeAttribute("disabled");
    }
    else {
        document.getElementById("submit-button").setAttribute("disabled", "");
    }
}

function loadVault() {
    let inputIds = ["ans01", "ans02", "ans03", "ans04", "ans05", "ans06"];
    let vaultUrl = "/vault?" 

    inputIds.forEach(function (id, index) {
        vaultUrl += "0" + (index+1) + "=" + document.getElementById(id).value + "&";
    })

    console.log("Vault URL", vaultUrl);
    window.location.href = vaultUrl;
}

function registerCallbacks() {
    let inputIds = ["ans01", "ans02", "ans03", "ans04", "ans05", "ans06"];

    inputIds.forEach(function (id) {
        document.getElementById(id).addEventListener("input", validateData);
    })

    document.getElementById('submit-button').addEventListener("click", loadVault);
}

document.addEventListener("DOMContentLoaded", function() {
    registerCallbacks();
})