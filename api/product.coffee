express = require 'express'
module.exports = app = express()

Product = require './models/product'

app.get '/', (req, res) ->
  Product.find (err, products) ->
    res.send products: products
