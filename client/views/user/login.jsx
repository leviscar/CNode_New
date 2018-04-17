import React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import UserWrapper from './user';
import loginStyles from './styles/login-style';

@inject((stores) => {
  return {
    appState: stores.appState,
    user: stores.appState.user,
  };
})@observer
class UserLogin extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {
      accesstoken: '271ca68a-3a36-41c8-8682-d5419b6155de',
      helpText: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }
  getFrom(location) {
    location = location || this.props.location;
    const query = queryString.parse(location.search);
    return query.from || '/user/info';
  }
  handleInput(event) {
    this.setState({
      accesstoken: event.target.value.trim(),
    });
  }
  handleLogin() {
    if (!this.state.accesstoken) {
      return this.setState({
        helpText: 'Required',
      });
    }
    this.setState({
      helpText: '',
    });
    return this.props.appState.login(this.state.accesstoken)
      .catch((error) => {
        console.log(error); //eslint-disable-line
      });
  }

  render() {
    const { classes } = this.props;
    const from = this.getFrom();
    const { isLogin } = this.props.user;

    if (isLogin) {
      return <Redirect to={from} />;
    }

    return (
      <UserWrapper>
        <div className={classes.root}>
          <TextField
            label="Please Enter Cnode AccessToken"
            placeholder="Please Enter Cnode AccessToken"
            required
            helperText={this.state.helpText}
            value={this.state.accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            variant="raised"
            color="secondary"
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            Login
          </Button>
        </div>
      </UserWrapper>
    );
  }
}
UserLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};
UserLogin.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default withStyles(loginStyles)(UserLogin);
