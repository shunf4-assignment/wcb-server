var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var stationSchema = new mongoose.Schema({
    'name': {
        type: String,
    },

    'location': [],

    'address': {
        'type': String,
    },

    'tel': {
        'type': String,
    }
});

module.exports = db.model('Station', stationSchema);