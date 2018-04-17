const axios = require('axios')
const webpack = require('webpack')
const serverConfig = require('../../build/webpack.config.server')
const path = require('path')
const MemoryFS = require('memory-fs')
const proxy = require('http-proxy-middleware')
const serverRunder = require('./server-render')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then((res) => {
        resolve(res.data)
      }).catch(reject)
  })
}

const nativeModule = require('module')
const vm = require('vm')
const getModuleFromString = (bundle, filename) => {
  const m = {exports: {}}
  const wrapper = nativeModule.wrap(bundle)
  const Script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = Script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

const mfs = new MemoryFS()
serverConfig.mode = 'development'
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs

let serverBundle
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err

  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warning => console.log(warning))
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports
})

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res, next) {
    if (!serverBundle) {
      return res.send('refresh later')
    }
    getTemplate().then((template) => {
      return serverRunder(serverBundle, template, req, res)
    }).catch(next)
  })
}
