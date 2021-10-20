console.log("hii start")
//const zmq = require("../../../../../usr/local/lib/node_modules/zeromq/");
//var child = require("child_process").spawn;
//var process = child('python',["./my.py",file_name,category]);
//var process = child('python',["./my.py",7,4]);
//var pyshell =  require('python-shell');

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


var select_button = document.getElementById('file_select'); // add id="my-button" into html
select_button.addEventListener('change', fileSelect);

function fileSelect(){
	const fileInput = document.getElementById("file_select");

	const filename = fileInput.files[0];
	console.log(filename)

    checkmp3(filename)
}

var upload_button = document.getElementById('upload_file'); // add id="my-button" into html
upload_button.addEventListener('click', fileUpload);

function fileUpload(){

    uploaded_file = document.getElementById("file_select");
    uploaded_file = uploaded_file.files[0];
    uploaded_file_name = uploaded_file.name;
//    uploaded_file._name = uploaded_file_name.replaceAll(" ", "_");

    //	const FormData = require('form-data')
    // import File System API

    //	const fs = require('fs')
    // create new FormData object

    formData = new FormData();
//    formData.append("audio_file", uploaded_file, uploaded_file._name);
    formData.append("audio_path", uploaded_file.path);
    formData.append("audio_name", uploaded_file_name);
    formData.append("category", "uploaded");

    console.log("NOW")
    for (var value of formData.values()) {
        console.log(value);
    } 
}

var model_button = document.getElementById('run_model'); // add id="my-button" into html
model_button.addEventListener('click', runModel);

function runModel(){

    file_path = formData.get("audio_path");
    category = formData.get("category");
    file_name = formData.get("audio_name");

//	pyshell.run('engine.py',  function  (err, results)  {
//        console.log("INSIDE123")
//	 if  (err)  console.log(err);
//	});

    data = {
        "file_name": file_name,
        "file_path": file_path,
        "category": category
    }

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    }

    let fetchRes = fetch("http://127.0.0.1:5000/", options)

		fetchRes.then(res => 
                res.json()).then(d => {
			console.log("d")
			console.log(d)
		})

//	var process = child('python',["./my.py",file_name,category]);
	
	//We listen for 'data' event.
//	process.stdout.on('data', function (data) {
//	  console.log("Sum " + JSON.parse(data.toString()).sum);    
//	});
   // sock = zmq.socket("push");
   // sock.bindSync("tcp://127.0.0.1:4242");

   // setInterval(function() {
   //     sock.send(["model", file_name, category]);
   //     //        if(error || res !== 'model done') {
   //     //            console.error(error)
   //     //        } else {
   //     //            console.log("model done")
   //     //        }
   // }, 500)
}