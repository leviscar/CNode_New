const bootstrapper = require('react-async-bootstrapper')
const ejs = require('ejs')
const serialize = require('serialize-javascript')
const Helmet = require('react-helmet').default
const ReactDomServer = require('react-dom/server')

const SheetsRegistry = require('react-jss').SheetsRegistry
const createGenerateClassName = require('material-ui/styles').createGenerateClassName
const createMuiTheme = require('material-ui/styles').createMuiTheme
const colors = require('material-ui/colors')

const getStoreState = (stores) => {
  // 服务端渲染结束后，store值的默认情况传出
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = (bundle, template, req, res) => {
  const createStoreMap = bundle.createStoreMap
  const serverBundle = bundle.default
  const routerContext = {}
  const stores = createStoreMap()
  const user = req.session.user
  if (user) {
    stores.appState.user.isLogin = true
    stores.appState.user.info = user
  }
  const sheetsRegistry = new SheetsRegistry()
  const theme = createMuiTheme({
    palette: {
      primary: colors.blue,
      secondary: colors.pink,
      type: 'light'
    }
  })
  const generateClassName = createGenerateClassName()
  const app = serverBundle(stores, routerContext, sheetsRegistry, generateClassName, theme, req.url)
  return new Promise((resolve, reject) => {
    bootstrapper(app).then(() => {
      const content = ReactDomServer.renderToString(app)
      // 在路由有redirect的情况下，routerContext.url是true，可以处理下面的逻辑
      // 这个代码需要写在renderToString后面
      if (routerContext.url) {
        // 重定向
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }
      const helmet = Helmet.rewind()
      // 服务端渲染的store
      const state = getStoreState(stores)
      // ejs引擎渲染后的html
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        title: helmet.title.toString(),
        meta: helmet.meta.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString()
      })
      // 服务端往浏览器端发送渲染好的html
      res.send(html)
      resolve()
    }).catch(reject)
  })
}
