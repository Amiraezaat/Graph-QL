const mongoose = require('mongoose')
const Blog_Schema = mongoose.Schema({
  title: String,
  desc: String,
  price: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  picture: [String]
},{
  timestamps: true
})

const blogModel = mongoose.model('Blog', Blog_Schema)
 

module.exports = blogModel
