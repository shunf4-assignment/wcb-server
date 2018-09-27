var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const LOST = 0;
const FOUND = 1;

var lostNFoundSchema = new mongoose.Schema({
    'user': {
        '_id': String,
        'nickName': String,
        'tel': String,
    },

    'lnfType': {
        'type': Number,
        'enum': [LOST, FOUND]
    },

    'title': {
        'type': String,
    },

    'place': {
        'type': String,
    },

    'time': {
        'type': Date,
    },

    'supplementary': {
        'type': String,
    },

    'lastUpdated': {
        'type': Date,
        'index': 1
    },
});

lostNFoundSchema.pre("save", function(next) {
    this.lastUpdated = new Date();
    next();
});

module.exports = db.model('LostNFound', lostNFoundSchema);