var express = require('express');
var mongoose = require('mongoose');


global.db = mongoose.createConnection("mongodb://localhost:27017/wcb", {user: "wcb", pass: "ruanjianweichongbang"});

var app = express();

app.use('/api', require('./routes'));

app.listen(8200);