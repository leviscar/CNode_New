import React from 'react';
import Helmet from 'react-helmet';
import marked from 'marked';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from 'material-ui';
import dateFormat from 'dateformat';

import Button from 'material-ui/Button';
import IconReply from 'material-ui-icons/Replay';
import SimpleMDE from 'react-simplemde-editor';
import Container from '../layout/container';
import { topicDetailStyle } from './styles';
import { CircularProgress } from 'material-ui/Progress';
import { TopicStore } from '../../store/store';
import Paper from 'material-ui/Paper';
import Reply from './reply';


@inject((stores) => {
  return {
    topicStore: stores.topicStore,
    user: stores.appState.user,
  };
}) @observer
class TopicDetail extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  constructor() {
    super();
    this.state = {
      newReply: '',
    };
    this.handleNewReplyChange = this.handleNewReplyChange.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
    this.doReply = this.doReply.bind(this);
    this.getTopic = this.getTopic.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.topicStore.getTopicDetail(id);
  }
  getTopic() {
    const { id } = this.props.match.params;
    return this.props.topicStore.detailMap[id];
  }
  handleNewReplyChange(value) {
    this.setState({
      newReply: value,
    });
  }
  goToLogin() {
    this.context.router.history.push('/user/login');
  }
  doReply() {
    const topic = this.getTopic();
    topic.doReply(this.state.newReply)
      .then(() => {
        this.setState({
          newReply: '',
        });
      }).catch((err) => {
        console.log(err); //eslint-disable-line
      });
  }
  render() {
    const { classes, user } = this.props;
    const { id } = this.props.match.params;
    const topic = this.props.topicStore.detailMap[id];
    if (!topic) {
      return (
        <Container>
          <section className={classes.loadingContainer}>
            <CircularProgress color="secondary" />
          </section>
        </Container>
      );
    }
    return (
      <div>
        <Container>
          <Helmet>
            <title>{topic.title}</title>
          </Helmet>
          <header className={classes.header}>
            <h3>{topic.title}</h3>
          </header>
          <section className={classes.body}>
            <p dangerouslySetInnerHTML={{ __html: marked(topic.content) }} />
          </section>
        </Container>
        {
          topic.createdReplies && topic.createdReplies.length > 0 ?
            (
              <Paper elevation={4} className={classes.replies}>
                <header className={classes.replyHeader}>
                  <span>My New Replies</span>
                  <span>{`${topic.createdReplies.length} Replies`}</span>
                </header>
                {
                  topic.createdReplies.map(reply => (
                    <Reply
                      key={reply.id}
                      reply={Object.assign({}, reply, {
                        author: {
                          avatar_url: user.info.avatar_url,
                          loginname: user.info.loginname,
                        },
                      })}
                    />
                  ))
                }
              </Paper>
            ) : null
        }
        <Paper elevation={4} className={classes.replies}>
          <header className={classes.replyHeader}>
            <span>{`${topic.reply_count} Replies`}</span>
            <span>{`Latest Comment ${dateFormat(topic.last_reply_at, 'yy-mm-dd')}`}</span>
          </header>
          {
            user.isLogin ?
              <section className={classes.replyEditor}>
                <SimpleMDE
                  onChange={this.handleNewReplyChange}
                  value={this.state.newReply}
                  options={{
                    toolbar: false,
                    autoFocus: false,
                    spellChecker: false,
                    placeholder: 'New Reply',
                  }}
                />
                <Button variant="fab" color="primary" onClick={this.doReply} className={classes.replyButton}>
                  <IconReply />
                </Button>
              </section> :
              null
          }
          {
            !user.isLogin ?
              <section className={classes.notLoginButton}>
                <Button variant="raised" color="secondary" onClick={this.goToLogin}>
                  Login
                </Button>
              </section> :
              null
          }
          <section>
            {
              topic.replies.map(reply => <Reply reply={reply} key={reply.id} />)
            }
          </section>
        </Paper>
      </div>

    );
  }
}

TopicDetail.wrappedComponent.propTypes = {
  topicStore: PropTypes.instanceOf(TopicStore),
  user: PropTypes.object.isRequired,
};

TopicDetail.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};


export default withStyles(topicDetailStyle)(TopicDetail);
