axios = require('axios')

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
            console.log("blob----")
            console.log(blob)
            sendData(blob)
        }
    }
}

function sendData(audio) {


const formData = new FormData();

    // Update the formData object
    formData.append("blob_details", audio);
    formData.append("category", "recorded");


    // Request made to the backend api
    // Send formData object
    let url = 'http://localhost:5000/';

    console.log(audio)
    console.log(formData)
    axios.post(url, formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
      .then(res => {
		console.log(res.data)
      })
      .catch(err => console.log(err))

//
//    console.log(audio)
//    console.log(typeof audio)
//
//    data = {
//        "blob": audio,
//        "category": "recorded"
//    }
//    console.log(typeof data)
//
//    let options = {
//      method: 'POST',
//      headers: {
//        'Content-Type': 'application/json;charset=utf-8'
////        'Content-Type': 'multipart/form-data',        
//      },
//      body: audio
////      body: formData
//    }
//
//    console.log(options)
//    let fetchRes = fetch("http://127.0.0.1:5000/", options)
//
//		fetchRes.then(res => 
//                res.json()).then(d => {
//			console.log("d")
//			console.log(d)
//		})

//    metadata = {path: "./"}
//    var file = new File([audio], "./here.mp3", metadata);
//    
//    console.log(file)
//    console.log(audio)
//    var ffmpeg = require('ffmpeg');
////    try{
//        var process = new ffmpeg('./now');
//        process.then(function(audio){
//
//            audio.fnExtractSoundToMP3('./audios/final', function (error, file) {
//                if(!error)
//                    console.log('Audio File: ' + file);
//            });
//        }, function(err){
//            console.log('Error: ' + err);
//        });
//    }
//    catch(e){
//        console.log(e.code);
//        console.log(e.msg);
//    }
}

var start_button = document.getElementById('record');
start_button.addEventListener('click', startRecording);

function startRecording(){

    var record = document.getElementById("record");
    var stopRecord = document.getElementById("stopRecord");
    console.log('I was clicked')
    record.disabled = true;
    stopRecord.disabled=false;
    audioChunks = [];
    rec.start();
}

var end_button = document.getElementById('stopRecord');
end_button.addEventListener('click', endRecording);

function endRecording(){

    var record = document.getElementById("record");
    var stopRecord = document.getElementById("stopRecord");
    console.log("I was clicked")
    record.disabled = false;
    stop.disabled=true;
    rec.stop();
}
