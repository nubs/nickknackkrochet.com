mongoose = require 'mongoose'

productSchema = new mongoose.Schema
  name:
    type: String
    required: true
  description:
    type: String
    required: true
  price:
    type: String
    required: true
  pictures: [{
    small:
      type: String
      required: true
    large:
      type: String
      required: true
  }]

module.exports = mongoose.model 'Product', productSchema
