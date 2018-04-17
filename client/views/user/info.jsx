import React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';

import UserWrapper from './user';
import infoStyles from './styles/user-info-style';

const TopicItem = (({ topic, onClick }) => {
  return (
    <ListItem button onClick={onClick}>
      <Avatar src={topic.author.avatar_url} />
      <ListItemText
        primary={topic.title}
        secondary={`Latest Reply：${topic.last_reply_at}`}
      />
    </ListItem>
  );
});

TopicItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  topic: PropTypes.object.isRequired,
};

@inject((stores) => {
  return {
    user: stores.appState.user,
    appState: stores.appState,
  };
}) @observer
class UserInfo extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  constructor() {
    super();
    this.goToTopic = this.goToTopic.bind(this);
  }

  componentWillMount() {
    this.props.appState.getUserDetail();
    this.props.appState.getUserCollections();
  }

  goToTopic(id) {
    this.context.router.history.push(`/detail/${id}`);
  }

  render() {
    const { classes } = this.props;
    const topics = this.props.user.detail.recentTopics;
    const replies = this.props.user.detail.recentReplies;
    const collections = this.props.user.collections.list;
    return (
      <UserWrapper>
        <div className={classes.root}>
          <Grid container spacing={16} align="stretch">
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>Topic</span>
                </Typography>
                {
                  !this.props.user.detail.syncing ?
                    <List>
                      {
                        topics.length > 0 ?
                          topics.map(topic => (
                            <TopicItem
                              topic={topic}
                              key={topic.id}
                              onClick={() => { this.goToTopic(topic.id); }}
                            />
                          )) :
                          <Typography align="center">
                            No Topic
                          </Typography>
                      }
                    </List>
                    :
                    <List>
                      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <CircularProgress />
                      </div>
                    </List>
                }
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>Reply</span>
                </Typography>
                {
                  !this.props.user.detail.syncing ?
                    <List>
                      {
                        replies.length > 0 ?
                          replies.map(topic => (
                            <TopicItem
                              topic={topic}
                              key={topic.id}
                              onClick={() => { this.goToTopic(topic.id); }}
                            />
                          )) :
                          <Typography align="center">
                            No Reply
                          </Typography>
                      }
                    </List>
                    :
                    <List>
                      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <CircularProgress />
                      </div>
                    </List>
                }
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2}>
                <Typography className={classes.partTitle}>
                  <span>Bookmark</span>
                </Typography>
                {
                  !this.props.user.collections.syncing ?
                    <List>
                      {
                        collections.length > 0 ?
                          collections.map(topic => (
                            <TopicItem
                              topic={topic}
                              key={topic.id}
                              onClick={() => { this.goToTopic(topic.id); }}
                            />
                          )) :
                          <Typography align="center">
                            No Bookmark
                          </Typography>
                      }
                    </List>
                    :
                    <List>
                      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <CircularProgress />
                      </div>
                    </List>
                }
              </Paper>
            </Grid>
          </Grid>
        </div>
      </UserWrapper>
    );
  }
}

UserInfo.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

UserInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(infoStyles)(UserInfo);
