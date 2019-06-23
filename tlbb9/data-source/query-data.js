// provide data api for tlbb9.cn
let mysql = require('mysql');
let connection = mysql.createConnection({
    host:'106.12.103.25',
    user:'root',
    password:'ab6821664',
    database:'tlbb9'
})


//let home_query='select * from trading where price>? and price<? and grade>? and grade <? order by ? desc limit 20'



//let home_query='select * from trading order by ? desc limit 20'

function home_main_query(params,order,kind) {
    let home_query;
    if(params[params.length-1]==1) {
        params.splice(params.length-1,1);
        console.log(params)
         home_query='select * from trading where price>? and price<? and grade>? and grade <?   order by '+order+' desc limit 30'
    }else{
         home_query='select * from trading where price>? and price<? and grade>? and grade <? and world_id=?  order by '+order+' desc limit 30'
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

module.exports={
    home_main_query:home_main_query
}