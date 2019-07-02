let request = require('request');
let cheerio = require('cheerio');
let data = require( "../data-source/trade-update.js");
let update = data.update;
let deleteShop = data.deleteShop;

let getDetai = require("./account.js")
let getDetaiMsg = getDetai.dataiMsg;

//  交易区列表爬取



    let userBean = {
        search:1,  //  1  搜索交易区  2  搜索公式区
        ifGetDetail:false  // 是否获取详情
    }

   let updateUrl = userBean.search==1?'http://tl.cyg.changyou.com/goods/selling?world_id=0&order_by=remaintime-desc&have_chosen=&page_num=':'http://tl.cyg.changyou.com/goods/public?world_id=0&order_by=remaintime-desc&have_chosen=&page_num=';

let page = 1;

function getMessage(){
    console.log(page);
    let url = updateUrl+page+'#goodsTag';
request.get({
    url:url,
    headers:{
        'Host': 'tl.cyg.changyou.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    }
},function (error,response,body) {
    if(!error){
        let $=cheerio.load(body)
        if($('.role-item .r-img').length==0){
            deleteShop();
                page=1
                getMessage()
        }
        let pageAccount = [];
        for(let i=0;i<$('.role-item .r-img').length;i++){
            let account = [];
            account.push($($('.role-item .r-img')[i]).attr('href').split('=')[1])
            account.push($($('.role-item .server-info')[i]).attr('data-wordid'))
            account.push($($('.role-item .price')[i]).text().slice(1))
            account.push($($('.role-item .name')[i]).parent().text())
            account.push($($('.role-item .detail')[i]).text().split('|')[0].split('\n')[1].split("：")[1])
            let deadLineTime = $($('.role-item .time')[i]).text().split('：')[1];
            let day = deadLineTime.indexOf('天')>-1;
            let deadLineTimeDay = Number(deadLineTime.substr(0,2))
            let deadLineTimehour = day?Number(deadLineTime.substr(3,2)):Number(deadLineTime.substr(4,2))
            let deadLineTimeMint = day?Number(deadLineTime.substr(7,2)):Number(deadLineTime.substr(8,2))
            let deadLineTimeTamp = new Date().getTime()+deadLineTimeDay*(deadLineTime?86400000:3600000)+deadLineTimehour*(deadLineTime?3600000:60000)+deadLineTimeMint*(deadLineTime?60000:1000);
            if (isNaN(deadLineTimeTamp))  continue;
            account.push(deadLineTimeTamp+(userBean.search==2?1209600000:0))
            account.push(0)
            account.push(null)
            account.push(null)
            if(userBean.ifGetDetail){
                pageAccount.push(new Promise(function updateAcountData(resolve,reject) {
                    new Promise(function (resolve1,reject) {
                        getDetaiMsg(account[0],resolve1)
                    }).then(function (res) {
                        account=account.concat(res);
                        update(account,resolve,reject);
                    }).catch(function (err) {
                        console.log(err)
                    })
                })  )
            }else {
                console.log(account);
                pageAccount.push(new Promise(function updateAcountData(resolve,reject) {
                    update(account,resolve,reject);
                })  )
            }

        }
        Promise.all(pageAccount).then(function () {
            page=page+1;
            setTimeout(getMessage,25000);
        }).catch(function (err) {
            console.log('fail to next page',err)
        })
    }
    else {
        console.log(error)
    }
})
}

getMessage();


