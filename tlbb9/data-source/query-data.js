// provide data api for tlbb9.cn
let mysql = require('mysql');
let connection = mysql.createConnection({
    host:'106.12.103.25',
    user:'root',
    password:'ab6821664',
    database:'tlbb9'
})

connection.connect();
//let home_query='select * from trading where price>? and price<? and grade>? and grade <? order by ? desc limit 20'



//let home_query='select * from trading order by ? desc limit 20'

function home_main_query(params,order,kind) {
    let home_query;
    if(params[params.length-1]==1) {
        params.splice(params.length-1,1);
        if(kind==1){
            home_query='select * from trading where price>? and price<? and grade>? and grade <? and deadline_time>? and deadline_time<? order by '+ order+' desc limit 30'
        }else {
            home_query='select * from trading where price>? and price<? and grade>? and grade <? and deadline_time>? and deadline_time<? and menpai="'+ kind  +'" order by '+order+' desc limit 30'
        }
    }else{
        if(kind==1) {
            home_query='select * from trading where price>? and price<? and grade>? and grade <? and deadline_time>? and deadline_time<? and world_id=? order by '+ order+' desc limit 30'
        }else {
            home_query='select * from trading where price>? and price<? and grade>? and grade <? and deadline_time>? and deadline_time<? and world_id=? and menpai="'+ kind  +'" order by '+order+' desc limit 30'
        }
    }
    return  new Promise(function (resolve, reject) {
        connection.query(home_query, params ,function (err, result) {
            if(err){
                reject(err)
            }else {
              resolve(result)
            }
        })
    })
}
// 价格监控
function monitor_price(params){
     let time = new Date().getTime()+1209600000;
     console.log(params)
     if(params==1){
         let monitor = 'select * from trading where price_down = 1 and deadline_time < '+time+ ' limit 50';
         return new Promise( (resolve,reject)=>{
             connection.query(monitor,function (err,result) {
                 if(err){
                     reject(err)
                 }else {
                     resolve(result)
                 }
             })
         })
     }else {
         let monitor = 'select * from trading where world_id=? and price_down = 1 and deadline_time < '+time+ ' limit 50';
         return new Promise( (resolve,reject)=>{
             connection.query(monitor,params,function (err,result) {
                 if(err){
                     reject(err)
                 }else {
                     resolve(result)
                 }
             })
         })
     }
}

// 获取便宜的

function getCheap(offset){
    let query = 'SELECT * FROM trading_sale WHERE price<260 ORDER BY grade DESC LIMIT 20 OFFSET ?';
    return  new Promise(function (resolve, reject) {
        connection.query(query, [0] ,function (err, result) {
            if(err){
                reject(err)
            }else {
                resolve(result)
            }
        })
    })
}

module.exports={
    home_main_query:home_main_query,
    monitor_price:monitor_price,
    getCheap:getCheap
}