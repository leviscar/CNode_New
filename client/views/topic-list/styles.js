export const topicPrimaryStyle = (theme) => {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    title: {
      color: '#555',
      fontSize: '18px',
    },
    tab: {
      color: 'white',
      backgroundColor: '#75B404',
      textAlign: 'center',
      display: 'inline-block',
      padding: '0 6px',
      borderRadius: 3,
      marginRight: 10,
      fontSize: '12px',
      textTransform: 'capitalize',
    },
    top: {
      backgroundColor: theme.palette.primary[200],
    },
  };
};

export const topicSecondaryStyle = (theme) => {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: 3,
    },
    count: {
      textAlign: 'center',
      marginRight: 20,
    },
    userName: {
      marginRight: 20,
      color: '#9e9e9e',
    },
    replyCount: {
      marginRight: 15,
      color: theme.palette.primary[600],
    },
  };
};
