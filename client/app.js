import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'mobx-react';
import { AppContainer } from 'react-hot-loader';//eslint-disable-line
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { blue, pink } from 'material-ui/colors';
import App from './views/App';
import { AppState, TopicStore } from './store/store';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
    type: 'light',
  },
});

const root = document.getElementById('root');
const initialState = window.__INITIAL_STATE__ || {}; //eslint-disable-line
const createApp = (TheApp) => {
  class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }
    render() {
      return <TheApp />;
    }
  }
  return Main;
};

const appState = new AppState(initialState.appState);
appState.init(initialState.appState);
const topicStore = new TopicStore(initialState.topicStore);

const render = (Component) => {
  ReactDom.hydrate(
    <AppContainer>
      <Provider appState={appState} topicStore={topicStore}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>
    ,
    root,
  );
};

render(createApp(App));

if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default;
    render(createApp(NextApp));
  });
}
