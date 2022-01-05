// Polyfill for Array.prototype.at
function at(n) {
    // ToInteger() abstract op
    n = Math.trunc(n) || 0;
    // Allow negative indexing from the end
    if (n < 0) n += this.length;
    // OOB access is guaranteed to return undefined
    if (n < 0 || n >= this.length) return undefined;
    // Otherwise, this is just normal property access
    return this[n];
}

const TypedArray = Reflect.getPrototypeOf(Int8Array);
for (const C of [Array, String, TypedArray]) {
    Object.defineProperty(C.prototype, "at",
                          { value: at,
                            writable: true,
                            enumerable: false,
                            configurable: true });
}

// import QrScanner from '/static/js/qr-scanner.min.js';
import QrScanner from '/static/js/qr-scanner.min.js';
QrScanner.WORKER_PATH = '/static/js/qr-scanner-worker.min.js';

const video = document.getElementById('videoInput');
// const scanner = new QrScanner(video, result => console.log("Decoded QR", result));
const scanner = new QrScanner(video, result => parse_decoded_qr(result), QrScanner._onDecodeError, calculateScanRegion);
// scanner.setGrayscaleWeights(red, green, blue, useIntegerApproximation = true);
// scanner.setGrayscaleWeights(0.45, 0.45, 0.1); // Eyeballed
// scanner.setGrayscaleWeights(0.33, 0.64, 0.0); // Blue Math
// scanner.setGrayscaleWeights(0.22, 0.78, 0.0); // Green Math

const LOG_MAX_LINES = 8;
var LOG_BUFFER = Array(LOG_MAX_LINES).fill('');

const button_audio = new Howl({src:'/static/sfx/button.mp3'});
const alert_audio  = new Howl({src:'/static/sfx/alert.mp3'});
const hum_audio    = new Howl({src:'/static/sfx/hum.mp3', loop:true});

function calculateScanRegion(video) {
    // Default scan region calculation. Note that this can be overwritten in the constructor.
    // const smallestDimension = Math.min(video.videoWidth, video.videoHeight);
    // const scanRegionSize = Math.round(2 / 3 * smallestDimension);
    let target_div = document.getElementById('target-div');
    
    console.log(video)
    console.log(video.clientWidth, video.clientHeight, video.videoHeight, video.videoWidth)

    // This is needed to transfer between video coordinates and the coordinates on the screen.
    let height_multiplier = video.videoHeight / video.clientHeight;
    let width_multiplier = video.videoWidth / video.clientWidth;

    let target_width = target_div.offsetWidth;
    let target_height = target_div.offsetHeight;
    let target_x_offset = target_div.offsetLeft - target_width/2;
    let target_y_offset = target_div.offsetTop - target_height/2;
    return {
        x: target_x_offset * width_multiplier,
        y: target_y_offset * height_multiplier,
        width: target_width * width_multiplier,
        height: target_height * height_multiplier,
        downScaledWidth: target_width * width_multiplier,
        downScaledHeight: target_height * height_multiplier,
    };
}

function getSpyBoySvg() {
    $("#spyboy-svg-div").load("/static/img/spyboy.svg", () => {
        document.getElementById("StartLight").style.visibility = "visible";
        document.getElementById("StartDark").style.visibility = "hidden";
        document.getElementById("StopLight").style.visibility = "hidden";
        document.getElementById("StopDark").style.visibility = "visible";
    });
}

function startReader() {
    console.log('Start Reader');
    button_audio.play();
    document.getElementById("StartLight").style.visibility = "hidden";
    document.getElementById("StartDark").style.visibility = "visible";
    document.getElementById("StopLight").style.visibility = "visible";
    document.getElementById("StopDark").style.visibility = "hidden";
    document.getElementById("button-start").removeEventListener('click', startReader);
    document.getElementById('button-stop').addEventListener('click', stopReader);
    document.getElementById('FullSpool').classList.add("spool_animation");
    document.getElementById('EmptySpool').classList.add("spool_animation");
    scanner.start();
    scanner.setInversionMode("both");
    console.log(scanner._scanRegion);
    hum_audio.play();
}

function stopReader() {
    console.log('Stop Reader');
    button_audio.play();
    document.getElementById("StartLight").style.visibility = "visible";
    document.getElementById("StartDark").style.visibility = "hidden";
    document.getElementById("StopLight").style.visibility = "hidden";
    document.getElementById("StopDark").style.visibility = "visible";
    document.getElementById("button-start").addEventListener('click', startReader);
    document.getElementById('button-stop').removeEventListener('click', stopReader);
    document.getElementById('FullSpool').classList.remove("spool_animation");
    document.getElementById('EmptySpool').classList.remove("spool_animation");
    scanner.pause();
    hum_audio.stop();
}

function updateClock() {
    function padTime(time_integer) {
        // Add the 0 at the front of integers less than 10.
        return time_integer.toString().padStart(2, "0");
    }

    var d = new Date();
    document.getElementById("clock-date").innerText = padTime(d.getDate());
    document.getElementById("clock-year").innerText = padTime(d.getFullYear());

    if (document.getElementById("clock-time").innerText.includes(':')) {
        document.getElementById("clock-time").innerText = padTime((d.getHours() % 12)  || 12) + " " + padTime(d.getMinutes());
    } else {
        document.getElementById("clock-time").innerText = padTime((d.getHours() % 12)  || 12) + ":" + padTime(d.getMinutes());
    }

    var month = "";
    switch (d.getMonth()) {
        case 0:
            month = "JAN";
            break;
        case 1:
            month = "FEB";
            break;
        case 2:
            month = "MAR";
            break;
        case 3:
            month = "APR";
            break;
        case 4:
            month = "MAY";
            break;
        case 5:
            month = "JUN";
            break;
        case 6:
            month = "JUL";
            break;
        case 7:
            month = "AUG";
            break;
        case 8:
            month = "SEP";
            break;
        case 9:
            month = "OCT";
            break;
        case 10:
            month = "NOV";
            break;
        case 11:
            month = "DEC";
            break;
    }

    document.getElementById("clock-month").innerText = month;
}

function parse_decoded_qr(code) {
    var decoded = code
    updateLogScreen(decoded);
}

function updateLogScreen(new_line) {
    console.log(LOG_BUFFER);
    if ((LOG_BUFFER.length > 0 && LOG_BUFFER.at(LOG_MAX_LINES-1) == new_line) || new_line == '') {
        return;
    }

    // This is a new unique detection, so alert the user.
    alert_audio.play();

    var output_buffer = "";
    // First item in the buffer is the top of the display.
    LOG_BUFFER.push(new_line);
    LOG_BUFFER.shift();

    for (var i=0;i<LOG_MAX_LINES;i++) {
        output_buffer += LOG_BUFFER[i] + '\n';
    }
    document.getElementById('logwindow-text').innerText = output_buffer;
}

$(document).ready(function() {
    updateClock();
    document.getElementById('button-start').addEventListener('click', startReader);
    getSpyBoySvg();   
    setInterval(updateClock, 1000);
})