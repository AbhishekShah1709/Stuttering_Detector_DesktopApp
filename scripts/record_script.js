navigator.mediaDevices.getUserMedia({audio:true})
.then(stream => {handlerFunction(stream)})


function handlerFunction(stream) {
    rec = new MediaRecorder(stream);
    rec.ondataavailable = e => {
        audioChunks.push(e.data);
        if (rec.state == "inactive"){
            let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
            recordedAudio.src = URL.createObjectURL(blob);
            recordedAudio.controls=true;
            recordedAudio.autoplay=true;
            sendData(blob)
        }
    }
}

function sendData(data) {

    var myffmpeg = require(['pify'])
    console.log("done")
}

function startRecording(){

    var record = document.getElementById("record");
    var stopRecord = document.getElementById("stopRecord");
    console.log('I was clicked')
    record.disabled = true;
    stopRecord.disabled=false;
    audioChunks = [];
    rec.start();
}

function endRecording(){

    var record = document.getElementById("record");
    var stopRecord = document.getElementById("stopRecord");
    console.log("I was clicked")
    record.disabled = false;
    stop.disabled=true;
    rec.stop();
}
