var mongoose = require('mongoose');

//create schema
var postSchema = mongoose.Schema({
  title: String,
  source: String,
  api: String,
  upvotes: Number
});

module.exports = mongoose.model('Post', postSchema);
