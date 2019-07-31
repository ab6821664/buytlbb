let request = require('request');
let cheerio = require('cheerio');

let data = require( "../data-source/trade-update.js");
let getAllId = data.getAllId;
let deleteShop = data.deleteShop;
let hasSaled = data.hasSaled;


getAllId().then((res)=>{
    console.log(res[0].id)
    let i=35000;
    let url='http://tl.cyg.changyou.com/goods/char_detail?serial_num=' + res[i].id;
    function dataiMsg(){
        let url='http://tl.cyg.changyou.com/goods/char_detail?serial_num=' + res[i].id
        let urlMsg = url ;
        let curruntId = res[i].id;
        request.get({
            url:urlMsg,
            headers:{
                'Host': 'tl.cyg.changyou.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            }
        },function (err,res11,body) {
            let $ = cheerio.load(body)
            if($('.goods-lock').length==1){
                let msg = $('.goods-lock span').text();
                if(msg.indexOf('下架')>-1){
                    console.log('delete',curruntId)
                    deleteShop(curruntId).then((result)=>{
                        i=i+1;
                        console.log(i);
                        dataiMsg();
                    })
                }
                if(msg.indexOf('卖出')>-1){
                    console.log('sale')
                    let price = $($('.ui-money-color')[0]).text().substr(1);
                    price = price * 1;
                    console.log('price',price)
                    hasSaled(curruntId,price).then((result)=>{
                        i=i+1;
                        console.log(i);
                        dataiMsg();
                    })
                }
            }else{
                console.log('pass')
                i=i+1;
                dataiMsg();
            }
        })

    }
    dataiMsg();

})