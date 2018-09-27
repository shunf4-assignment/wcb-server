var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var infoSchema = new mongoose.Schema({
    'title': {
        type: String,
    },

    'updateTime': {
        'type': Date,
    },

    'author': {
        'type': String,
    },

    'text': {
        'type': String,
    }
});

infoSchema.pre("save", function(next) {
    this.updateTime = new Date();
    next();
});

infoSchema.pre("update", function(next) {
    this.updateTime = new Date();
    next();
});

module.exports = db.model('Info', infoSchema);