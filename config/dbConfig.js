module.exports={
    md5:{
      ip:         '192.168.102.86',
      port:       27017,
      db:{
          md5:  {
              dbName:   "md5"
          }
      },
      users:[
          { usr: 'pekon', pwd:"123456" }
      ]
    },

    ecs1:{
        ip:'120.55.65.182',
        port:3306,
        db:{
            admin:{
                dbName:"admin",
                userName:"xianpu",
                pwd:"xianpuv587"
            },
            xp:{
                dbName:"xp",
                userName:"yjdz",
                pwd:"yjdztogetherv587"
            }
        }
    }
};