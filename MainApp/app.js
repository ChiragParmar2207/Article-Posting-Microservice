const express = require('express')
const morgan = require('morgan')
const app = express()
const proxy = require('express-http-proxy')

app.use(morgan('dev'))

app.use('/user', proxy('http://127.0.0.1:5001'))
app.use('/article', proxy('http://127.0.0.1:5002'))

module.exports = app
