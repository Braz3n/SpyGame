import QrScanner from '/static/js/qr-scanner.min.js';
QrScanner.WORKER_PATH = '/static/js/qr-scanner-worker.min.js';

const video = document.getElementById('videoInput');
// const scanner = new QrScanner(video, result => console.log("Decoded QR", result));
const scanner = new QrScanner(video, result => parse_decoded_qr(result));

const LOG_MAX_LINES = 8;
var LOG_BUFFER = Array(LOG_MAX_LINES).fill('');

const button_audio = new Howl({src:'/static/sfx/button.mp3'});
const alert_audio  = new Howl({src:'/static/sfx/alert.mp3'});
const hum_audio    = new Howl({src:'/static/sfx/hum.mp3', loop:true});

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
        document.getElementById("clock-time").innerText = padTime(d.getHours()%12) + " " + padTime(d.getMinutes());
    } else {
        document.getElementById("clock-time").innerText = padTime(d.getHours()%12) + ":" + padTime(d.getMinutes());
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
    if (LOG_BUFFER.at(-1) == new_line || new_line == '') {
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
    document.getElementById('button-start').addEventListener('click', startReader);
    // document.getElementById('button-stop').addEventListener('click', stopReader);

    getSpyBoySvg();   

    setInterval(updateClock, 1000);
})