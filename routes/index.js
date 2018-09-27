var express = require('express');
var bodyParser = require('body-parser');

var listAdoptions = require('./listAdoptions');
var viewAdoption = require('./viewAdoption');
var postToAdoptions = require('./postToAdoptions');
var listLosts = require('./listLosts');
var viewLost = require('./viewLost');
var postToLosts = require('./postToLosts');
var listInfos = require('./listInfos');
var viewInfo = require('./viewInfo');

var signUser = require('./signUser');
var updateUser = require('./updateUser');
var getUser = require('./getUser');
var findStation = require('./findStation');

var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/adoptions', listAdoptions);
router.get('/adoption/:id', viewAdoption);
router.post('/adoptions', postToAdoptions);

router.get('/losts', listLosts);
router.get('/lost/:id', viewLost);
router.post('/losts', postToLosts);

router.get('/infos', listInfos);
router.get('/info/:id', viewInfo);

router.post('/user/signer', signUser);
router.get('/user', getUser);
router.post('/user', updateUser);

router.post('/station/finder', findStation);

module.exports = router;