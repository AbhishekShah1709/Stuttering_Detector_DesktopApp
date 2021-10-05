console.log("hii")

//const fileInput = document.getElementById("file_select");

function checkmp3(filename) {
	var parts = filename.name.toString().split('.');

	if (parts[parts.length - 1] != 'mp3') {
		alert("Please Give a Valid mp3 file");
		console.log("FALSE")
			return false;
	}   
	else {
		console.log("TRUE")
			return true;
	}   
}

function fileSelect(){
	const fileInput = document.getElementById("file_select");

	const filename = fileInput.files[0];
	console.log(filename)

    checkmp3(filename)
}

function fileUpload(){

    uploaded_file = document.getElementById("file_select");
    uploaded_file = uploaded_file.files[0];
    uploaded_file_name = uploaded_file.name;
    uploaded_file._name = uploaded_file_name.replaceAll(" ", "_");

    //	const FormData = require('form-data')
    // import File System API

    //	const fs = require('fs')
    // create new FormData object

    formData = new FormData();
    formData.append("audio_file", uploaded_file, uploaded_file._name);
    formData.append("audio_name", uploaded_file_name);
    formData.append("category", "uploaded");

    console.log("NOW")
    for (var value of formData.values()) {
        console.log(value);
    } 
}

function runModel(){

    file_name = formData.get("audio_name");
    category = formData.get("category");
    
    var zmq = require(["zeromq"]);
    sock = zmq.socket("push");

    sock.bindSync("tcp://127.0.0.1:4242");

    setInterval(function() {
    sock.send(["model", file_name, category]);
//        if(error || res !== 'model done') {
//            console.error(error)
//        } else {
//            console.log("model done")
//        }
    }, 500)
}
