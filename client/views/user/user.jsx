import React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import UserIcon from 'material-ui-icons/AccountCircle';
import Container from '../layout/container';
import userStyles from './styles/user-style';

@inject((stores) => {
  return {
    user: stores.appState.user,
  };
}) @observer
class User extends React.Component {
  componentDidMount() {
  }
  render() {
    const { classes, user } = this.props;

    return (
      <Container>
        <div className={classes.avatar}>
          <div className={classes.bg} />
          {
            user.info.avatar_url ?
              <Avatar className={classes.avatarImg} src={user.info.avatar_url} /> :
              <Avatar className={classes.avatarImg}>
                <UserIcon />
              </Avatar>
          }
          <span className={classes.userName}>{user.info.loginname || 'Need to login'}</span>
        </div>
        {this.props.children}
      </Container>
    );
  }
}

User.wrappedComponent.propTypes = {
  user: PropTypes.object.isRequired,
};

User.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

export default withStyles(userStyles)(User);
