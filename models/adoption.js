var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var adoptionSchema = new mongoose.Schema({
    'user': {
        '_id': String,
        'nickName': String,
        'tel': String,
    },

    'title': {
        'type': String,
    },

    'from': {
        'type': String,
    },
    
    'to': {
        'type': String,
    },

    'adoptTime': {
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

adoptionSchema.pre("save", function(next) {
    this.lastUpdated = new Date();
    next();
});

module.exports = db.model('Adoption', adoptionSchema);