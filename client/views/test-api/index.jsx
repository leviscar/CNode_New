import React from 'react';
import axios from 'axios';

/* eslint-disable */
export default class TestApi extends React.Component {
  constructor() {
    super();
    this.getTopics = this.getTopics.bind(this);
    this.userLogin = this.userLogin.bind(this);
    this.markAll = this.markAll.bind(this);
  }
  getTopics() {
    axios.get('/api/topics')
      .then((resp) => {
        console.log(resp);
      }).catch((err) => {
        console.log(err);
      });
  }
  userLogin() {
    axios.post('/api/user/login', {
      accessToken: '19317ff3-2d24-4784-84d4-3c968085ff04',
    }).then((resp) => {
      console.log(resp);
    }).catch((err) => {
      console.log(err);
    });
  }
  markAll() {
    axios.post('/api/message/mark_all?needAccessToken=true')
      .then((resp) => {
        console.log(resp);
      }).catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div>
        <button onClick={this.getTopics}>getTopics</button>
        <button onClick={this.userLogin}>userLogin</button>
        <button onClick={this.markAll}>markAll</button>
      </div>
    );
  }
}
/* eslint-enable */
