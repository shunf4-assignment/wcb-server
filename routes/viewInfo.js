var mongoose = require("mongoose");
var model = require("../models");

module.exports = function (req, res, next) {
    if (!req.get("openId") || !req.get("uid")) {
        console.log("Not authorized", req.headers, req.get("openId"), req.get("uid"));
        res.status(403).json({succeed: false, msg: "未登录"});
        return false;
    }

    var userQuery = {_id: req.get("uid"), openId: req.get("openId")};
    var aid = req.params.id;

    var query = {
        _id: aid
    }

    var result = {};

    var userPromise = model.User.findOne(userQuery).exec().then(function(userDoc){
        if (userDoc) {
            ;
        } else {
            throw {httpCode: 403, result: {succeed: false, msg: "用户信息出错"}, err: ""};
        }
    });

    var findPromise = model.Info.findOne(query).exec()
        .then(function(infoDoc){
            if (infoDoc) {
                result.info = infoDoc;
            } else {
                console.log(query);
                throw {httpCode: 404, result: {succeed: false, msg: "未找到"}};
            }
        }).catch(function(err){
            throw err.httpCode ? err : {httpCode: 500, result: {succeed: false, msg: "查询出错"}, error: err};
        });

    Promise.all([findPromise, userPromise]).then(function(){
        res.json({succeed: true, result: result})
    }).catch(function(err){
        console.error("Error at viewInfo", err.error);
        res.status(err.httpCode).json(err.result);
    });
    
}

