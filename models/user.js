var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = new mongoose.Schema({
    'openId': {
        'type': String,
        'index': 1
    },
    'nickName': {
        'type': String,
    },
    'tel': {
        'type': String,
    },
    'gender': {
        'type': String,
        'enum': ['f', 'm', 'u'],
    },
    'location': [],
    'infoUpdated': Boolean,
});


module.exports = db.model('User', userSchema);