const mongoose = require('mongoose');
const Users = require('./users.model');
const Notes = require('./notes.model');

mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.users = Users;
db.notes = Notes;
module.exports = db;
