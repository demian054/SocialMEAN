'user strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PublicationSchema = Schema({
  user: { type: Schema.ObjectId, ref: 'User'},
  text: String,
  file: String,
  created_at: String
});

//console.log(mongoose.model.Publication);
module.exports = mongoose.model('Publication', PublicationSchema);
