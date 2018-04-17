import React from 'react';
import PropTypes from 'prop-types';
import ListItem from 'material-ui/List/ListItem';
// import ListItemAvatar from 'material-ui/List/ListItemAvatar';
import ListItemText from 'material-ui/List/ListItemText';
import Avatar from 'material-ui/Avatar';
import { withStyles } from 'material-ui/styles';
import { topicPrimaryStyle, topicSecondaryStyle } from './styles';
import { tabs } from '../../util/variable-define';
import cx from 'classnames';
import dateFormat from 'dateformat';

const Primary = ({ classes, topic }) => {
  const classNames = cx({
    [classes.tab]: true,
    [classes.top]: topic.top,
  });
  return (
    <span className={classes.root}>
      <span className={classNames}>{topic.top ? 'Top' : tabs[topic.tab]}</span>
      <span className={classes.title}>{topic.title}</span>
    </span>
  );
};

Primary.propTypes = {
  classes: PropTypes.object.isRequired,
  topic: PropTypes.object.isRequired,
};

const StyledPrimary = withStyles(topicPrimaryStyle)(Primary);

const Secondary = ({ classes, topic }) => (
  <span className={classes.root}>
    <span className={classes.userName}>{topic.author.loginname}</span>
    <span className={classes.count}>
      <span className={classes.replyCount}>Reply: {topic.reply_count}</span>
      <span>Visiting: {topic.visit_count}</span>
    </span>
    <span>Date: {dateFormat(topic.create_at, 'yy-mm-dd')}</span>
  </span>
);

Secondary.propTypes = {
  classes: PropTypes.object.isRequired,
  topic: PropTypes.object.isRequired,
};

const StyledSecondary = withStyles(topicSecondaryStyle)(Secondary);

const TopicListItem = ({ onClick, topic }) => (
  <ListItem button onClick={onClick}>
    <Avatar src={topic.author.avatar_url} />
    <ListItemText
      primary={<StyledPrimary topic={topic} />}
      secondary={<StyledSecondary topic={topic} />}
    />
  </ListItem>
);

TopicListItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  topic: PropTypes.object.isRequired,
};

export default TopicListItem;
