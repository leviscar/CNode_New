import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react';
import { tabs } from '../../util/variable-define';
import TextField from 'material-ui/TextField';
import Radio from 'material-ui/Radio';
import Button from 'material-ui/Button';
import IconReply from 'material-ui-icons/Reply';
import { withStyles } from 'material-ui/styles';
import Container from '../layout/container';
import createStyles from './styles';
import SimpleMDE from 'react-simplemde-editor';
import Snackbar from 'material-ui/Snackbar';

@inject((stores) => {
  return {
    topicStore: stores.topicStore,
    appState: stores.appState,
  };
}) @observer
class TopicCreate extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  constructor() {
    super();
    this.state = {
      title: '',
      content: '',
      tab: 'dev',
      open: false,
      message: '',
    };
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showMessage = this.showMessage.bind(this);
  }
  handleTitleChange(event) {
    this.setState({
      title: event.target.value.trim(),
    });
  }

  handleContentChange(value) {
    this.setState({
      content: value,
    });
  }

  handleChangeTab(event) {
    this.setState({
      tab: event.currentTarget.value,
    });
  }
  showMessage(message) {
    this.setState({
      open: true,
      message,
    });
  }
  handleCreate() {
    const {
      tab, title, content,
    } = this.state;
    if (!title) {
      this.showMessage('Title is required');
      return;
    }
    if (!content) {
      this.showMessage('Content is required');
      return;
    }
    this.props.topicStore.createTopic(title, tab, content)
      .then(() => {
        this.context.router.history.push('/list');
      })
      .catch((err) => {
        this.showMessage(err.message);
      });
  }
  handleClose() {
    this.setState({
      open: false,
    });
  }
  render() {
    const { classes } = this.props;
    const { message, open } = this.state;
    return (
      <Container>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          message={message}
          open={open}
          onClose={this.handleClose}
        />
        <div className={classes.root}>
          <TextField
            className={classes.title}
            label="Title"
            value={this.state.title}
            onChange={this.handleTitleChange}
            fullWidth
          />
          <SimpleMDE
            id="samplemdeCreateTopic"
            onChange={this.handleContentChange}
            value={this.state.content}
            options={{
              toolbar: false,
              spellChecker: false,
              placeholder: 'Please Enter Here',
            }}
          />
          <div>
            {
              Object.keys(tabs).map((tab) => {
                if (tab !== 'all' && tab !== 'good') {
                  return (
                    <span className={classes.selectItem} key={tab}>
                      <Radio
                        value={tab}
                        checked={tab === this.state.tab}
                        onChange={this.handleChangeTab}
                      />
                      {tabs[tab]}
                    </span>
                  );
                }
                return null;
              })
            }
          </div>
          <Button variant="fab" color="primary" onClick={this.handleCreate} className={classes.replyButton}>
            <IconReply />
          </Button>
        </div>
      </Container>
    );
  }
}

TopicCreate.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
  // appState: PropTypes.object.isRequired,
};

TopicCreate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(createStyles)(TopicCreate);
