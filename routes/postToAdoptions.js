var mongoose = require("mongoose");
var model = require("../models");

module.exports = function (req, res, next) {
    if (!req.get("openId") || !req.get("uid")) {
        console.log("Not authorized", req.headers, req.get("openId"), req.get("uid"));
        res.status(403).json({succeed: false, msg: "未登录"});
        return false;
    }

    var userQuery = {_id: req.get("uid"), openId: req.get("openId")};
    
    var createDoc = {
        'title': req.body.title,
        'from': req.body.from,
        'to': req.body.to,
        'adoptTime': new Date(req.body.adoptTime),
        'supplementary': req.body.supplementary
    }

    model.User.findOne(userQuery, {_id: 1, nickName: 1, tel: 1}).exec()
        .then(function(userDoc){
            if (userDoc) {
                createDoc.user = userDoc;
            } else {
                throw {httpCode: 403, result: {succeed: false, msg: "用户信息出错"}, err: ""};
            }
        }).then(function(){
            return model.Adoption.create(createDoc);
        }).then(function(adoptDoc){
            console.log("Adopt Document Creation", adoptDoc);
            res.json({succeed: true, msg: "OK"});
        }).catch(function (err){
            console.log(err);
            if (err.httpCode) {
                res.status(err.httpCode).json(err.result);
            } else {
                res.status(500).json({succeed: false, msg: "服务器出现错误"});
            }
        });   
}

