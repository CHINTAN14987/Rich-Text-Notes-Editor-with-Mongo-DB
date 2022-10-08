const mongoose = require('mongoose');

const { model, Schema } = mongoose;
const Users = model(
  'Users',
  new Schema({
    username: String,
    email: String,
    password: String,
  })
);
module.exports = Users;
