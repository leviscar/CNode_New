import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import TopicList from '../views/topic-list/index';
import TopicDetail from '../views/topic-detail/index';
import UserLogin from '../views/user/login';
import UserInfo from '../views/user/info';
import TopicCreate from '../views/topic-create/index';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
// import TestApi from '../views/test-api/index';

const PrivateRoute = ({ isLogin, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
      props => (
        isLogin ?
          <Component {...props} /> :
          <Redirect
            to={{
              pathname: '/user/login',
              search: `?from=${rest.path}`,
            }}
          />
      )
    }
  />
);

const InjectedPrivateRoute = withRouter(inject((stores) => {
  return {
    isLogin: stores.appState.user.isLogin,
  };
})(observer(PrivateRoute)));

PrivateRoute.propTypes = {
  isLogin: PropTypes.bool,
  component: PropTypes.element.isRequired,
};
PrivateRoute.defaultProps = {
  isLogin: false,
};

export default () => [
  <Route path="/" key="default" exact render={() => <Redirect to="/list" />} />,
  <Route path="/list" key="list" component={TopicList} />,
  <Route path="/detail/:id" key="detail" component={TopicDetail} />,
  <Route path="/user/login" component={UserLogin} exact key="user" />,
  <InjectedPrivateRoute path="/user/info" component={UserInfo} exact key="userInfo" />,
  <InjectedPrivateRoute path="/topic/create" component={TopicCreate} exact key="topic-create" />,
  // <Route key="testApi" component={TestApi} />,
];
