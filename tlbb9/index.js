let repress = require('express');
let app = repress();
let request = require('request')
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

// 解析参数
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
}));

let main_query = require('./data-source/query-data')
let home_main_query = main_query.home_main_query;
let monitor_price = main_query.monitor_price

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});



app.post('/homeQuery', function(req, res){
    res.header('Access-Control-Allow-Origin', '*')
    home_main_query(req.body.params,req.body.order,req.body.kind).then((data)=>{
        res.json(data)
    }).catch((err)=>{
        console.log(err)
    })
});

app.post('/monitorPrice', function(req, res){
    res.header('Access-Control-Allow-Origin', '*')
    monitor_price(req.body.world).then((data)=>{
        res.json(data)
    }).catch((err)=>{
        console.log(err)
    })
});




let server = app.listen(3000,function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('应用实例',host,port)
})