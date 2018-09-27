var mongoose = require("mongoose");
var model = require("../models");


module.exports = function (req, res, next) {
    if (!req.get("openId") || !req.get("uid")) {
        res.status(403).json({succeed: false, msg: "未登录"});
        return false;
    }

    if (!req.body.nickName || !req.body.tel || !(["f", "m", "u"].indexOf(req.body.gender) != -1) || !(req.body.location instanceof Array) || !req.body.location[0] || !req.body.location[1] || !req.body.location[2]) {
        res.status(400).json({succeed: false, msg: "输入信息有误"});
        return false;
    }

    var query = {_id: req.get("uid"), openId: req.get("openId")};
    var update = {nickName: req.body.nickName, tel: req.body.tel, gender: req.body.gender, location: req.body.location.slice(0,3), infoUpdated: true};
    var result = {};

    var userPromise = model.User.findOne(query).exec();
    userPromise.then(function(userDoc){
        if (userDoc) {
            return userDoc.update(update).exec()
        } else {
            throw {httpCode: 403, result: {succeed: false, msg: "用户信息出错"}, err: ""};
        }
    }).then(function (updateRes){
        console.log("updated user info", updateRes);
        res.json({succeed: true, result: {}});
    }).catch(function (err) {
        console.error("Error in updateUser", err);
        if (err.httpCode) {
            res.status(err.httpCode).json(err.result);
        } else {
            res.status(500).json({succeed: false, msg: "服务器出现错误"});
        }
    });

}