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


    // Request made to the backend api
    // Send formData object
    let url = 'http://localhost:5000/record';

    console.log(audio)
    console.log(formData)
    axios.post(url, formData, {
      headers: {
        'content-type': `multipart/form-data; boundary=${formData._boundary}`,
      }
    })
//      .then(res => res.json()).then(d => {
      .then(res => {
            console.log("res") 
            console.log(res) 
          output = res.data.output

            var cnt = 0;
            var curr = 0;
            for (var i = 0; i < output.length; i++) {
                if (output[i] == 1) {
                    curr++;
                }   
                else {
                    curr = 0;
                }   
                if (curr == 28) {
                    cnt++;
                }   
            }   
            if (cnt > 2) {
                document.getElementById("result").innerHTML = "The given input audio is STUTTERED";
//                this.setState({ stuttered: "Stuttered" }); 
            }   
            else {
                document.getElementById("result").innerHTML = "The given input audio is NOT STUTTERED";
//                this.setState({ stuttered: "Not Stuttered" }); 
            }   
//            this.setState({ checked: true }); 
            document.getElementById("result").style.display = "block";
            console.log("cnt");
            console.log(cnt);
     
      })
      .catch(err => console.log(err))

}

var start_button = document.getElementById('record');
start_button.addEventListener('click', startRecording);

function startRecording(){

    var record = document.getElementById("record");
    var stopRecord = document.getElementById("stopRecord");
    console.log('I was clicked')
    record.disabled = true;
    record.classList.add("disabled");
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
