/* mongoDB连接控制 */
//配置
var Promise = require("es6-promise").Promise;
var mongodb = require('mongodb');
var mongodbConfig = require("../config/dbConfig");
var poolModule = require('generic-pool');                               //数据库连接线程池（提高并发能力）
var mongoClient = mongodb.MongoClient;
var object = require("objectid");
//时间工具
var dateUtil = require("./DateUtil");
/**
 * 配置模块
 */
var mongo_url = 'mongodb://'+ mongodbConfig.md5.users[0].usr + ':' + mongodbConfig.md5.users[0].pwd + '@' + mongodbConfig.md5.ip + ":" + mongodbConfig.md5.port + "/" + mongodbConfig.md5.db.md5.dbName;
var factory = {
    create   : function() {
        return new Promise(function (resolve, reject) {
            mongoClient.connect(mongo_url, {poolSize:1, autoReconnect:false, reconnectTries: 1}, function(err, db){
                if(err){
                    reject(err);
                }else{
                    resolve(db);
                }
            });
        });
    },
    //当超时则释放连接（新版本完全交给连接池自己完成）
    destroy  : function(db) {
        return new Promise(function (resolve, reject) {
            db.close(true, function (err, res) {
                //根据结果操作
                !err ? resolve() : reject();
            });
        });
    }
};
var opt = {
    max:                                            10,     //根据应用的可能最高并发数设置
    acquireTimeoutMillis:                           5000,
    idleTimeoutMillis :                             30000,
    log :                                           false
};
var pool = poolModule.createPool(factory, opt);

//导出模块
module.exports = {
    /**
     * 开启连接池
     * @callback
     * @return Promise( 成功返回db提供操作，失败返回err)
     */
    open: function(){
        return pool.acquire();
    },
    /**
     * 关闭连接池
     */
    release: function(db){
        pool.release(db);
    },
    /**
     * objectid模块
     */
    objectId: object,
    /**
     * 查找
     * @collection          集合
     * @condation           条件
     */
    find:   function (collection, condation) {
        return new Promise(function (resolve, reject) {
            collection.find(condation).toArray(function (err, fs) {
                err ? reject(err) : resolve(fs);
            });
        });
    }
};



