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

	var uploaded_file = document.getElementById("file_select");
	uploaded_file = uploaded_file.files[0]
		uploaded_file_name = uploaded_file.name
		uploaded_file._name = uploaded_file_name.replaceAll(" ", "_");

	//	const FormData = require('form-data')
	// import File System API

	//	const fs = require('fs')
	// create new FormData object

	const formData = new FormData()
		formData.append("audio_file", uploaded_file, uploaded_file._name);
	formData.append("audio_name", uploaded_file_name);

    for (var value of formData.values()) {
        console.log(value);
    } 

}
