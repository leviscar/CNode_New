import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import ToolBar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui-icons/Home';
import { inject, observer } from 'mobx-react';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
};
@inject((stores) => {
  return {
    appState: stores.appState,
  };
})@observer
class NavBar extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor() {
    super();
    this.onHomeIconClick = this.onHomeIconClick.bind(this);
    this.onCreateTopicButtonClick = this.onCreateTopicButtonClick.bind(this);
    this.onLoginButtonClick = this.onLoginButtonClick.bind(this);
  }
  onHomeIconClick() {
    this.context.router.history.push('/list?tab=all');
  }
  onCreateTopicButtonClick() {
    this.context.router.history.push('/topic/create');
  }
  onLoginButtonClick() {
    if (this.props.appState.user.isLogin) {
      this.context.router.history.push('/user/info');
    } else {
      this.context.router.history.push('/user/login');
    }
  }
  render() {
    const { user } = this.props.appState;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <ToolBar>
            <IconButton color="inherit" onClick={this.onHomeIconClick}>
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              Cnode Proxy
            </Typography>
            <Button color="inherit" onClick={this.onCreateTopicButtonClick}>Create Topic</Button>
            <Button color="inherit" onClick={this.onLoginButtonClick}>
              {
                user.isLogin ? user.info.loginname : 'Login'
              }
            </Button>
          </ToolBar>
        </AppBar>
      </div>
    );
  }
}

NavBar.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
};

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
