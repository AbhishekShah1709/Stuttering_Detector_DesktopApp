import React, { Component } from 'react';
import axios from 'axios';
import MicRecorder from 'mic-recorder-to-mp3';
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default class UploadFileSystem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isRecording: false,
      blobURL: '',
      isRecorded: true,
      isBlocked: false,
      selectedFile: null,
      show_features: [],
      show_output: [],
      stuttered: "Not stuttered",
      checked: false,
    }
  }


  onFileChange = event => {

    // Update the state
    this.setState({ selectedFile: event.target.files[0] });

  };
  // componentDidMount() {
  //   document.body.style.backgroundColor = "pink";
  //   document.body.style.background = "linear-gradient(140deg, #EADEDB 0%, #BC70A4 50%, #BFD641 75%)";
  // }
  checkmp3(filename) {
    var parts = filename.toString().split('.');
    console.log(parts[parts.length - 1]);
    if (parts[parts.length - 1] != 'mp3') {
      alert("Please Give a Valid mp3 file");
      return false;
    }
    else {
      return true;
    }
  }
  // On file upload (click the upload button)
  onFileUpload = () => {

    // Create an object of formData
    const formData = new FormData();


    var uploaded_file = this.state.selectedFile;
    uploaded_file._name = uploaded_file.name.replaceAll(" ", "_");
    this.setState({ uploaded_file });

    // Update the formData object
    formData.append("audio_file", this.state.selectedFile, this.state.selectedFile._name);
    formData.append("audio_name", this.state.selectedFile.name);

    // Details of the uploaded file
    console.log(this.state.selectedFile);
    console.log(this.state.selectedFile._name);
    if (this.checkmp3(this.state.selectedFile._name)) {
      // Request made to the backend api
      // Send formData object
      let url = 'http://localhost:8000/api/audiofiles/';
      var path = require("path");
      axios.post(url, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
        .then(res => {
          this.setState({ blobURL: "http://localhost:8000" + res.data.audio_file });
          this.setState({ isRecorded: false });
          console.log(res.data);
        })
        .catch(err => console.log(err))
    }
  };

  // On file upload (click the upload button)
  doFeatureExtraction = () => {

    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("file_details", this.state.selectedFile, this.state.selectedFile._name);
    formData.append("file_name", this.state.selectedFile._name);
    formData.append("category", "uploaded");

    // Details of the uploaded file
    console.log(this.state.selectedFile);
    console.log(this.state.selectedFile._name);

    // Request made to the backend api
    // Send formData object
    let url = 'http://localhost:8000/api/disorder_detection/';

    axios.post(url, formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
      .then(res => {
        this.setState({ show_features: res.data.features });
        this.setState({ show_output: res.data.output });
        var cnt = 0;
        var curr = 0;
        for (var i = 0; i < this.state.show_output.length; i++) {
          if (this.state.show_output[i] == 1) {
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
          this.setState({ stuttered: "Stuttered" });
        }
        else {
          this.setState({ stuttered: "Not Stuttered" });
        }
        this.setState({ checked: true });
        console.log(cnt);
        console.log(res.data);
      })
      .catch(err => console.log(err))

  };

  // File content to be displayed after
  // file upload is complete
  fileData = () => {

    if (this.state.selectedFile) {

      return (
        <div>
          <h4 style={{
            fontWeight: "bold",
          }}>
            File Details:</h4>
          <h5>File Name: {this.state.selectedFile.name}</h5>
          <h5>File Type: {this.state.selectedFile.type}</h5>
          <h5>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </h5>

        </div>
      );
    }

    /*      else {
            return (
              <div>
                <br />
                <h5 style={{color: 'red'}}> Choose before Pressing the Upload button </h5>
              </div>
            );
          }
    */
  };

  render() {
    var isChecked = { display: this.state.checked ? "block" : "none", fontWeight: "bold" }

    return (


      <div>
        <br />
        <br />
        <br />

        <h1 style={{
          fontWeight: "bold",
        }}>
          Upload your file
                </h1>

        <br />
        <br />

        <div>



          <input type="file" onChange={this.onFileChange} />

          <button type="button" onClick={this.onFileUpload} className="btn btn-primary" disabled={this.state.selectedFile == null}>
            Upload
                    </button>

          <button type="button" onClick={this.doFeatureExtraction} className="btn btn-primary" disabled={this.state.isRecorded}>
            Run Model
                    </button>

        </div>

        <br />
        <br />

        {this.fileData()}

        <br />
        <br />

        <div style={{ display: this.state.isRecorded ? "none" : "block"}}>
          <audio src={this.state.blobURL} controls="controls" />
        </div>

        <br />
        <br />

        <h3 style={isChecked} > Result: Given Input is {this.state.stuttered} </h3>


      </div>
    )
  }
}
