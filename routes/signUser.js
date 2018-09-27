var mongoose = require("mongoose");
var model = require("../models");
var https = require("https");
var WXBizDataCrypt = require('./decryptWX/WXBizDataCrypt');

const appId = 'wx9faed5953cabd691';
const appSecret = '3c285d354037f10973ba4876b7494a05';

function getWechatSession(code) {
    return new Promise( (resolve, reject) => {
        https.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`, function(res) {
            res.on('data', function(data){
                resolve(JSON.parse(data));
            })
        }).on('error', function(e){
            console.log('Error at getWechatSession', e);
            reject(e);
        });
    } );
}

module.exports = function(req, res, next) {
    if (!(req.body.code)) {
        res.status(401).json({succeed: false, msg: "需要 code"});
        return false;
    }

    getWechatSession(req.body.code).then(function (sessionData) {
        console.log(sessionData);
        if (sessionData.session_key == undefined || sessionData.openid == undefined) {
            res.status(500).json({succeed: false});
            return;
        }

        var decrypted = new WXBizDataCrypt(appId, sessionData.session_key).decryptData(req.body.encryptedData, req.body.iv);
        console.log("Decrypted WXData", decrypted);

        var newUser;

        model.User.findOne({openId: sessionData.openid}).exec()
            .then(function (user) {
                if (user) {
                    // Already signed
                    newUser = false;
                    return user;
                } else {
                    newUser = true;
                    return model.User.create({
                        openId: sessionData.openid,
                        nickName: decrypted.nickName,
                        tel: "000-000-000",
                        gender: "u",
                        location: ["北京市", "北京市", "东城区"],
                        infoUpdate: false
                    });
                }
            }).then(function (userDoc) {
                res.json({succeed: true, newUser: newUser, userData: {_id: userDoc._id, openId: userDoc.openId}});
            }).catch(function(err) {
                console.error("Error at signUser", err);
                res.status(500).json({succeed: false});
            });
    }).catch(function(err) {
        console.error("Error at signUser", err);
        res.status(500).json({succeed: false});
    });
}