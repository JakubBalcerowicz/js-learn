const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  data: String,
  trening: String,
  dystans: String,
  godzina: String,
  alert: Boolean,
});

const UserSchema = new Schema({
  _id : String,
  name: String,
  password: String,
  messages: [messageSchema]
})

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel