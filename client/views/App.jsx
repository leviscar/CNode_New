import React from 'react';
import Routes from '../config/router';
// import { Link } from 'react-router-dom';
import NavBar from './layout/app-bar';

export default class App extends React.Component {
  componentDidMount() {
    // do something
  }
  render() {
    return [
      <NavBar key="appBar" />,
      <Routes key="router" />,
    ];
  }
}
