import React, { Component } from 'react';
import axios from 'axios';
import { Timeline } from 'react-twitter-widgets';
import './UserForm.css'

class UserForm extends Component {

  state = {
    description: '',
    selectedFile: '',
    selectedFileUrl: '',
    uploadStatus: ''
  };


  onChange = (e) => {
    switch (e.target.name) {
      case 'selectedFile':
        this.setState({
          selectedFile: e.target.files[0],
          selectedFileUrl: URL.createObjectURL(e.target.files[0])
        });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { description, selectedFile } = this.state;
    let formData = new FormData();
    formData.append('description', description);
    formData.append('selectedFile', selectedFile);

    axios.post('http://localhost:4000/', formData)
      .then((result) => {
        if (result.status == 200) {
          this.setState({ 
            uploadStatus: 'Tweet uploaded!', 
            selectedFileUrl: '', 
            description: '',
            selectedFile:''
          })
        }
      });
  }

  render() {
    const { description, uploadStatus, selectedFileUrl, selectedFile } = this.state;
    const twitter_screen_name = process.env.REACT_APP_TWITTER_SCREEN_NAME

    return (
      <div className="container">
        <div className="form-wrapper"><h2 className="tweet-msg">Tweet form</h2>
          <form onSubmit={this.onSubmit}>
            <div className='description'>
              <input
                type="text"
                placeholder='Enter the status message'
                name="description"
                value={description}
                onChange={this.onChange}
              /></div>
            <div className="file">
              <input
                type="file"
                name="selectedFile"
                key={selectedFile}
                onChange={this.onChange}
              /></div>
            <button type="submit">Submit</button>
          </form>
          <img src={selectedFileUrl} />
          <h3 className='upload-status'>{uploadStatus}</h3>
        </div>
        <div className="tweets">
          <Timeline
            dataSource={{
              sourceType: 'profile',
              screenName: twitter_screen_name
            }}
            options={{
              width: '500'
            }}
          />
        </div></div>
    );
  }
}

export default UserForm