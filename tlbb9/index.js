let repress = require('express');
let app = repress();
let request = require('request')
let cookieParser = require('cookie-parser');
let main_query = require('./data-source/query-data')
let home_main_query = main_query.home_main_query;

console.log(home_main_query)

home_main_query([5000,95500,50,999000,'money']).then(function (data) {
    app.get('/',function (req,res) {
        res.json({data:data})
    })
})





let server = app.listen(3000,function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('应用实例',host,port)
})