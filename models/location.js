var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var locSchema   = new Schema({
	  timestamp: String,
    lat: String,
    long: String,
    accuracy: String,
    timestamp: String,
    useragent: String,
	  ip: String
});

module.exports = mongoose.model('locSchema', locSchema);