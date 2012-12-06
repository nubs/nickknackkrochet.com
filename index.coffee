express = require 'express'
app = express()

mongoose = require 'mongoose'
mongoose.connect process.env.MONGOHQ_URL

app.use express.logger 'dev'
app.use express.static "#{__dirname}/public"
app.use '/api', require './api'

port = process.env.PORT ? 8000
app.listen port, ->
  console.log "Listening on #{port}"
