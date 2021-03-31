let actx = new AudioContext();

let soundBuffer;

let xhr = new XMLHttpRequest();

xhr.open("GET", "sounds/bounce.mp3", true);

xhr.responseType = "arraybuffer";

xhr.send();

xhr.addEventListener('load', loadHandler, false);

function loadHandler(event) {
    actx.decodeAudioData(
        xhr.response,
        buffer => {
            soundBuffer = buffer;
        },
        error => {
            throw new Error("Audio could not be decoded: " + error);
        }
    );
}
