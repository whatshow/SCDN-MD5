/**
 * 文件操作集合
 * @author qxw
 */
/*** 第三方模块 ***/
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var Multipary = require('multiparty');
var router = require('express').Router();
var async = require('asyncawait').async;
var await = require('asyncawait').await;
/*** 自定义模块 ***/
//导入Mongo操作集合
var MongoUtil = require('../utils/MongoUtil');

/**
 * 上传文件
 */
router.all('/upload', function (req, res, next) {
    //检查是否存在tmp文件夹，如果不存在，则创建
    var tmppath = path.join(__dirname, '../tmp');
    if(!fs.existsSync(tmppath)){
        fs.mkdirSync(tmppath);
    }
    //保存上传文件到临时目录
    var form =  new Multipary.Form();
    form.uploadDir = tmppath;
    form.parse(req, function(err, fields, files){
        //如果没有错误，则计算文件的md5值，
        if(!err){
            //获取文件名
            var filename = fields.addDialogFilename[0];
            var url = fields.url[0];
            //计算文件的md5值
            try{
                var stat = fs.statSync(files.addDialogFile[0].path);
                if(stat.isFile()){
                    var stream = fs.createReadStream(files.addDialogFile[0].path);
                    var hash = crypto.createHash('md5');
                    stream.on('data', hash.update.bind(hash)).on('end', function () {
                        //计算出md5
                        var strmd5 = hash.digest('hex');
                        //删除文件
                        fs.unlinkSync(files.addDialogFile[0].path);
                        //把数据插入数据库
                        async(function () {
                            try{
                                //尝试打开数据库
                                var db = await(MongoUtil.open());
                                //打开 md5 集合
                                var md5 = db.collection("md5");
                                //如果打开，集合则查找数据
                                if(md5){
                                    try{
                                        var result = await(md5.find({ url: url }).toArray());
                                        console.log(result);
                                        //不存在，则插入
                                        if(result.length <= 0){
                                            try{
                                                var res = await(md5.insertOne({url: url, md5:strmd5 }));
                                                console.log(res);
                                            }catch(e){
                                                console.log(e);
                                            }
                                        }
                                    }catch(e){}
                                }
                                //关闭数据库
                                MongoUtil.release(db);
                            }catch(e){
                                //数据库打开失败
                                console.log(e);
                            }
                        })();
                    });
                }
            }catch(e){
                //文件不存在
                console.log(e);
            }
        }
    });
    //无论如何都跳转到主页
    res.redirect("/");
});

/**
 * 获取所有文件
 */
router.all("/list", function (req, res, next) {
    async(function () {
        var db;
        var msg;
        try{
            //尝试打开数据库
            db = await(MongoUtil.open());
            //打开 md5 集合
            var md5 = db.collection("md5");
            if(!md5){
                msg = { msg: "表不存在" };
            }else{
                msg = { msg: "获取到了数据", data: await(md5.find().toArray()).map(function ( data ) {
                    return { url: data.url, md5: data.md5 };
                }) };
            }
        }catch(err){
            msg = { msg:"系统异常", err: err };
        }
        //返回消息
        res.status(200).json(msg);

        //如果打开了数据库，则关闭
        if(db){
            MongoUtil.release(db);
        }
    })();
});

/**
 * 获取一个文件的md5
 */
router.all("/md5", function (req, res, next) {
    var url = req.query.url || req.body.url;
    async(function () {
        var db;
        var msg;
        try{
            //尝试打开数据库
            db = await(MongoUtil.open());
            //打开 md5 集合
            var md5 = db.collection("md5");
            if(!md5){
                msg = { msg: "表不存在" };
            }else{
                var rs = await(md5.find({url: url }).toArray());
                if(rs.length <= 0){
                    msg = { msg:"没有找到URL" };
                }else{
                    msg = { msg:"找到了URL", data: rs.map(function (data) {
                        return { url: data.url, md5: data.md5 };
                    }) };
                }
            }
        }catch(err){
            msg = { msg:"系统异常", err: err };
        }
        //返回消息
        res.status(200).json(msg);

        //如果打开了数据库，则关闭
        if(db){
            MongoUtil.release(db);
        }
    })();
});
/**
 * 删除
 */
router.all("/delete", function (req, res, next) {
    var url = req.query.url || req.body.url;
    async(function () {
        var db;
        var msg;
        try{
            //尝试打开数据库
            db = await(MongoUtil.open());
            //打开 md5 集合
            var md5 = db.collection("md5");
            if(!md5){
                msg = { msg: "表不存在" };
            }else{
                await(md5.removeOne({url: url }));
                msg = { msg: "删除成功" }
            }
        }catch(err){
            msg = { msg:"系统异常", err: err };
        }
        //返回消息
        res.status(200).json(msg);

        //如果打开了数据库，则关闭
        if(db){
            MongoUtil.release(db);
        }
    })();
});


module.exports = router;