const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use('/public', proxy({
        target: 'http://localhost:8888'
    }))
    app.get('*', function (req, res, next) {
        return 404
    })
}
