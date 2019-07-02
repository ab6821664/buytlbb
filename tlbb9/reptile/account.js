//  交易区账号详细信息爬取

let request = require('request');
let cheerio = require('cheerio');

let cookId = 'aa9523ac-e2d1-4369-afc8-a05cfbc3e761';
let j = request.jar();
request = request.defaults({jar:j})
let url='http://tl.cyg.changyou.com/goods/char_detail';
let cookie = request.cookie('sid='+cookId);
j.setCookie(cookie, url);


function dataiMsg(account,resolve){
    let urlMsg = url+'?serial_num='+account;
    let acountMsg=[]
    request.get({
        url:urlMsg,
        headers:{
            'Host': 'tl.cyg.changyou.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        }
    },function (err,res,body) {
        let $=cheerio.load(body)
        acountMsg.push(Number($($('[data-tip="bing"] .c-o-l')[0]).text().split(' ')[1].split('\n')[0].slice(1)))    //冰
        acountMsg.push(Number($($('[data-tip="huo"] .c-o-l')[0]).text().split(' ')[1].split('\n')[0].slice(1)))     //火
        acountMsg.push(Number($($('[data-tip="xuan"] .c-o-l')[0]).text().split(' ')[1].split('\n')[0].slice(1)))    //玄
        acountMsg.push(Number($($('[data-tip="du"] .c-o-l')[0]).text().split(' ')[1].split('\n')[0].slice(1)))      //毒
        acountMsg.push(acountMsg[0]+acountMsg[1]+acountMsg[2]+acountMsg[3])                // 4属性
        acountMsg.push(Number($($('[data-tip="sword"] .c-o-l')[0]).text().split('：')[1].trim()))  //穿刺
        acountMsg.push(Number($($('.fn-high-light')[0]).text())) //血
        acountMsg.push(Number($($('#goods-detail .box2')).text().split('\n')[15].split('：')[1].split(' ')[0])) //命中
        acountMsg.push(Number($($('#goods-detail .box2')).text().split('\n')[17].split('：')[1]))  // 会心
        let rank=$($('#goods-detail .box2')).text().split('\n')[26].split('：')[1];
        rank = Number(rank)
        if(rank<959) {rank=0}
        else if(959<rank && rank<1279 ) rank=1;
        else if(1279<rank && rank<1919) rank=2;
        else rank=3;
        acountMsg.push(rank) //进阶
        acountMsg.push(Number($($('#goods-detail .box2')).text().split('\n')[38].split('：')[1]))  // 元宝
        let animal=($($($('#tab_3').html()).find('.bar-title3')).length/4)
        let double10=0; let trigle10=0
        for(let i=1;i<animal+1;i++){
             let rongHe=$($($('#tab_3').html()).find('.bar-title3')[i*4-2]).next().text().trim().split('：')[4]
            let wuXing=$($($('#tab_3').html()).find('.bar-title3')[i*4-1]).next().text().trim().split('\n')[0].split('：')[1];
            let lingXing=$($($('#tab_3').html()).find('.bar-title3')[i*4-1]).next().text().trim().split('\n')[2].split('：')[1];
            if(lingXing==wuXing && lingXing==10)  double10++;
            if(lingXing==wuXing && lingXing==10 && rongHe==lingXing) trigle10++;
        }
        acountMsg.push(double10-trigle10)    // 双10
        acountMsg.push(trigle10)   //  三十
        let menpai = $($(".fn-other-menpai")[0]).text().split(':')[1]
        acountMsg.push(menpai)
        let goods_id=$($('#btnCollect')[0]).attr('data-goods-id');
        let url='http://tl.cyg.changyou.com/goods/checkisfavor?goods_id='+goods_id+'&t='+new Date().getTime();
        request(url,function (err,res,body) {
          let favor = JSON.parse(body.replace(/\'/g,'\"')).count;
            acountMsg.push(favor) // 关注量
            resolve(acountMsg)
        })
    })
}


module.exports={
    dataiMsg:dataiMsg
}