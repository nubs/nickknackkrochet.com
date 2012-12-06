express = require 'express'
module.exports = app = express()

app.use '/products', require './product'
