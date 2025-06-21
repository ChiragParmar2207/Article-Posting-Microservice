const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const topicRouter = require('./Topic/topicRouter')
const articleRouter = require('./Article/articleRouter')
const globleErrorHandler = require('./Utils/globleErrorHandler')

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/api/topicrouter', topicRouter)
app.use('/api/articlerouter', articleRouter)

app.use(globleErrorHandler)

module.exports = app
