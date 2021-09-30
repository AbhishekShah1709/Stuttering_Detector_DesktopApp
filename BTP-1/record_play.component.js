import React, { Component } from 'react';
import axios from 'axios';
import MicRecorder from 'mic-recorder-to-mp3';

const Mp3Recorder = new MicRecorder({
  bitRate: 128,
  prefix: "data:audio/wav;base64,",
});

export default class Recorder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
      isRecorded: true,
      stuttered: "Not stuttered",
      checked: false,
      blob_to_send: '',
    }
  }

  componentDidMount() {
    navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true })
      },
    );
  }

  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true });
        }).catch((e) => console.error(e));
    }
  };

  stop = () => {
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        this.setState({ isRecorded: false });
        this.setState({ blob_to_send: blob });

        console.log(blobURL);
        console.log(buffer);
        console.log(blob);
        const binaryString = btoa(blobURL)
        this.setState({ blobURL, isRecording: false });
      }).catch((e) => console.log(e));
  };

  // On file upload (click the upload button)
  doFeatureExtraction = () => {

    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("blob_details", this.state.blob_to_send);
    formData.append("category", "recorded");


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
        this.setState({ checked: true });
        console.log(cnt);
        console.log(res.data);
      })
      .catch(err => console.log(err))

  };
  render() {
    var isChecked = { display: this.state.checked ? "block" : "none", fontWeight: "bold"}
    return (
      <div>
        <br />
        <br />
        <br />
        <h1 style={{
          fontWeight: "bold",
        }}>

          Test With Voice
                </h1>
        <br/>
        <br/>
        <button onClick={this.start} className="btn btn-primary" disabled={this.state.isRecording}>
          Record
                </button>
        <button onClick={this.stop} className="btn btn-primary" disabled={!this.state.isRecording}>
          Stop
                </button>

        <button onClick={this.doFeatureExtraction} className="btn btn-primary" disabled={this.state.isRecorded}>
          Run Model
                </button>
        <br/>
        <br/>
        <br/>
        <br/>

        <div style={{ display: this.state.isRecorded ? "none" : "block"}}>
        <audio src={this.state.blobURL} controls="controls" />
        </div>

        <br />
        <br />
        
        <h3 style={isChecked}> Result: Given Input is {this.state.stuttered} </h3>
      
        </div>
    )
  }
}
