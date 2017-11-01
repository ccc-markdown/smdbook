var koaStatic = require('koa-static')
var path = require('path')
var Koa = require('koa')
var app = module.exports = new Koa()

app.use(koaStatic(path.join(__dirname, './')))
app.listen(3000)
