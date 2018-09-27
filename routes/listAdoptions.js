var mongoose = require("mongoose");
var model = require("../models");

module.exports = function (req, res, next) {
    if (!req.get("openId") || !req.get("uid")) {
        console.log("Not authorized", req.headers, req.get("openId"), req.get("uid"));
        res.status(403).json({succeed: false, msg: "未登录"});
        return false;
    }

    var userQuery = {_id: req.get("uid"), openId: req.get("openId")};

    console.log(userQuery);

    var query = {}

    var page = req.query.page ? parseInt(req.query.page) : 0;
    var itemPerPage = req.query.itemPerPage ? parseInt(req.query.itemPerPage) : 15;

    var result = {};

    var userPromise = model.User.findOne(userQuery).exec();
    userPromise.then(function(userDoc){
        if (userDoc) {
            ;
        } else {
            throw {httpCode: 403, result: {succeed: false, msg: "用户信息出错"}, err: ""};
        }
    });

    var findPromise = model.Adoption.find(query, {supplementary: 0}, {skip: page * itemPerPage, limit: itemPerPage, sort: {lastUpdated: -1}}).exec()
        .then(function(adoptionDocs){
            result.adoptions = adoptionDocs;
        }).catch(function(err){
            throw {httpCode: 500, result: {succeed: false, msg: "查询出错"}, error: err};
        });

    var countPromise = model.Adoption.count(query).exec()
        .then(function(count) {
            result.total = count;
        }).catch(function(err){
            throw {httpCode: 500, result: {succeed: false, msg: "查询出错"}, error: err};
        });

    Promise.all([userPromise, findPromise, countPromise]).then(function(){
        res.json({succeed: true, result: result})
    }).catch(function(err){
        console.error("Error at listAdoption", err.error);
        if (err.httpCode) {
            res.status(err.httpCode).json(err.result);
        } else {
            res.status(500).json({succeed: false, msg: "服务器出现错误"});
        }
    });
    
}

