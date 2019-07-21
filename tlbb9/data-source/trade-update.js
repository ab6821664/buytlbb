let mysql = require('mysql');
let connection = mysql.createConnection({
    host:'106.12.103.25',
    user:'root',
    password:'ab6821664',
    database:'tlbb9'
})
function getConnect(){
    connection.connect();
}
// 删除过时记录
let deleteAcoount='delete from trading where deadline_time<'+new Date().getTime();

function deleteShop(){
    connection.query(deleteAcoount,function (err,result) {
        if(!err){
            console.log('delete',result)
        }else {
            console.log('delete')
        }
    })
}
deleteShop()

let queryAcoount = 'select id from trading'
function getAllId(){
    return new Promise((resolve,reject)=>{
        connection.query(queryAcoount,function (err,result) {
            if(err){
                reject(err)
            }else {
                resolve(result)
            }
        })
    })
}
// 新增加记录
let addSql = 'insert into trading values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
// 商品号 游戏区 价格 名字 评分 到期时间 是否降价 新价格 降价时间

// 查询价格

let queryPrice = "select price from trading where id = ";
function addGameAccount(params,resolve,reject){
    connection.query(addSql,params,function (err,result) {
        if(err){
            console.log('add acount',err.message);
            resolve(1);
        }
        if(result){
            resolve(1);
        }
    })
}

function updateGameAcount(params,resolve,reject){
    connection.query(queryPrice+params[0],function (err,result) {
        if(err){
            console.log('query id',err.message);
            resolve(1);
        }
        if(result.length==0){
           return addGameAccount(params,resolve,reject);
        }else {
            if(result[0].price==params[2] || result[0].price_new==params[2]){
                resolve(1);
            }else {
                console.log(params,'down')
                let userModSql = 'UPDATE trading SET price_down = ?,change_time = ?,price_new=? WHERE id = ?';
                let nowTime = new Date().getTime();
                let userModSqlParams = [1,nowTime,params[2],params[0]]
                connection.query(userModSql,userModSqlParams,function (err,result) {
                    if(err){
                        console.log('update price',err);
                        resolve(1);
                    }else {
                        resolve(1);
                    }
                })
            }
        }

    })
}
// 删除商品根据Id
function deleteShop(id){
    let query= 'delete from trading where id = ?';
    let params = [id];
    return new Promise((resolve,reject)=>{
        connection.query(query,params,function (err,result) {
            if(err){
                reject(err)
            }else {
                resolve(result)
            }
        })
    })
}
//trading => sale

function hasSaled(id,price){
   let query = 'select * from trading where id = ?';
   let params = [id];
   return new Promise((resolve,reject)=>{
       connection.query(query,params,function (err,result) {
           let dataString = JSON.stringify(result);
           let data = JSON.parse(dataString)
           let insert = [];
           let saleAddSql = 'insert into trading_sale values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
           for(let i in data[0]){
               insert.push(data[0][i])
           }
           insert[2] = price;
           deleteShop(insert[0])
           connection.query(saleAddSql,insert,function (err,result) {
               if(err){
                   reject(err)
               }else {
                   console.log('insert',insert[0])
                   resolve(result)
               }
           })
       })
   })

}

module.exports={
    update :updateGameAcount,
    conne:getConnect,
    deleteShop:deleteShop,
    getAllId:getAllId,
    deleteShop:deleteShop,
    hasSaled:hasSaled
}