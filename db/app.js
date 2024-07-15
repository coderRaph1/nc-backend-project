const express = require('express')
const app = express()
const {getTopicsController} = require('./controllers/get-topics-controller')

app.get('/api/topics', getTopicsController)




module.exports = app