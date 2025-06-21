const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const userRouter = require('./User/userRouter')
const followersRoute = require('./Followers/followersRoute')
const globleErrorHandler = require('./Utils/globleErrorHandler')

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/api/userroute', userRouter)
app.use('/api/followroute', followersRoute)

app.use('/tokenVarify', async (req, res) => {})

app.use(globleErrorHandler)

module.exports = app
