const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User_Schema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'User' },
  confirmed: { type: Boolean, default: false }
},{
  timestamps:true
})

User_Schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})
const userModel = mongoose.model('User', User_Schema)

module.exports = userModel
