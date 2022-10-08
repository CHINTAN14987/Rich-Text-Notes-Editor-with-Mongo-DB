const mongoose = require('mongoose');

const { model, Schema } = mongoose;
const Notes = model(
  'Notes',
  new Schema({
    title: String,
    content: String,
    fileUrl: String,
    color: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    shareTo: [String],
  })
);
module.exports = Notes;
