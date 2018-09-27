var mongoose = require("mongoose");
var model = require("../models");


module.exports = function (req, res, next) {
    if (!req.get("openId") || !req.get("uid")) {
        console.log("Not authorized", req.headers, req.get("openId"), req.get("uid"));
        res.status(403).json({succeed: false, msg: "未登录"});
        return false;
    }

    var query = {_id: req.get("uid"), openId: req.get("openId")};
    var result = {};

    var userPromise = model.User.findOne(query).exec();
    userPromise.then(function(userDoc){
        if (userDoc) {
            res.json({succeed: true, result: userDoc});
        } else {
            throw {httpCode: 403, result: {succeed: false, msg: "用户信息出错"}, err: ""};
        }
    }).catch(function (err) {
        console.error("Error in getUser", err);
        if (err.httpCode) {
            res.status(err.httpCode).json(err.result);
        } else {
            res.status(500).json({succeed: false, msg: "服务器出现错误"});
        }
    });

}