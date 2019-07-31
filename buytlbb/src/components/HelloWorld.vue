<template>
  <div class="hello">
      <el-dialog
              title="使用说明:改浏览器，登录畅易阁，开始使用"
              :visible.sync="tips"
              width="50%"
      >
          <div style="text-align: left">
              1:首先安装Google Chrome 浏览器  --- > <a href="https://www.google.cn/chrome/" target="_blank" style="color:orangered">点击下载谷歌浏览器!</a><br/>
              2：C盘新建文件夹，命名比如<span style="color:#409EFF">temp</span>；<br/>
              3:安装完成后，右击此图标，点击属性选项，点击快捷方式选项，在目标那一栏添加(注意空格)<br/><span style="color:#409EFF">
              <input type="text" value="--disable-web-security --user-data-dir=C:\temp" style="width:70%"></span><br/>
              <img src="../assets/teach.png"> <br/>
              4:保存后，打开此浏览器，重新访问本网页。<br/>
              5：同时在本浏览器登录畅易阁。<br/>
              6：如有多个账号，可以右击浏览器图标，创建快捷方式，重复以上操作，几个账号同时抢购成功率更高。<br/>
              7：客服微信<span style="color:orangered">13715549992</span>，可购卡<br/>
          </div>
      </el-dialog>


      <v-nav @userInfo="getUserInfo"></v-nav>
      <div id="action">
          <div>
              <el-button type="primary" icon="el-icon-info" @click="getTip">点击查看使用说明</el-button>
          </div>
          <div>
              商品号：
              <el-input  v-model="goods_serial_num" id="goods" style="width:300px;margin-right: 60px" placeholder="请输入需要抢购的商品编号" size="medium" suffix-icon="el-icon-edit"></el-input>
          </div>
          <div>
              <el-button type="primary" @click="add_list">添加到列表</el-button>
          </div>
      </div>



    <div id="content">
       <div class="content_header">
          <div  class="goods_list">待购列表</div>
          <div class="goods_blog">日志记录</div>
       </div>
        <div  class="detail">
           <div  class="detail_list">
               <div v-for="(item, index) in goods_list" :key="index" class="goods_show" @click="list_choose">
                  {{item}}
               </div>
           </div>
            <div class="detail_blog">
                <div v-for="(item,index) in goods_list_detail" :key="index" v-show="item.show" class="detail_blog_item">
                    <div style="text-align: left">{{item.detail}}  </div>
                    <span class="content_order">{{item.order}}</span>监控中，<br/>
                    {{item.date_target}}公示结束，结束时候将会自动秒杀。<br/>
                    <div v-html="item.bug_msg"></div>
                </div>
            </div>
        </div>
        <div class="home-account-show" style="margin-top: 40px">
            <h3 style="text-align: left"><span>抢号成功展示</span><span style="float:right"><el-button type="primary" @click="index++">换一批</el-button></span></h3>
            <div style="display: flex;height: 200px;margin-top: 30px;margin-bottom: 100px">
                <div style="display: flex;flex-direction: column;font-size: 14px;border: solid 3px #ffd435;padding: 15px;justify-content: space-around;margin-left: 18px" v-for="item in list.slice(sliceIndex*5,sliceIndex*5+5)">
                    <div>{{item.name}}</div>
                    <div style="margin-top: 20px">评分：{{item.grade}} 价格：<span style="color:red">{{item.price}}</span></div>
                    <div style="margin-top: 20px">总属性：{{item.fourAll}} 血上限：{{item.bold}}</div>
                    <div><el-button type="primary" @click="scan(item.id)">查看</el-button></div>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script>
  import axios from "axios";
  import Vue from 'vue';
  import $ from "jquery"
  import { visitAdd } from '../api/api'
  import { getCheap } from '../api/nodeApi'
  import nav from './nav'
export default {
    data() {
        return {
            temp:true,
            goods_serial_num: '',
            goods_list:[],
            goods_list_detail:[],
            tip:"www",
            status:false,
            buy_mode:"",
            tips:false,
            times:0,
            deadLineTime:sessionStorage.getItem("time"),
            list:[],
            index:0
        }
    },
    computed:{
       sliceIndex(){
           return this.index%4
       }
    },
    methods:{
        scan(id){
            let url ="http://tl.cyg.changyou.com/goods/char_detail?serial_num="+id;
            window.open(url);
        },
        change_mode:function(mode){
            this.buy_mode=mode;
        },
        getUserInfo(time){
            this.deadLineTime = time;
        },
        getTip:function(){
            this.tips=true;
        },
        add_list:function () {
            if(new Date().getTime()>this.deadLineTime){
                alert(" 账号已到期或未充值")
                return;
            }
            var serial_num_patter=/\d{16,21}/;
            var this_=this;
            if(serial_num_patter.test(this.goods_serial_num)&&this.goods_serial_num.length<21){
                if(this.goods_list.indexOf(this.goods_serial_num)>-1 ){
                    this.$message({
                        message:'请不要添加重复的商品',
                        type: 'warning'
                    });
                }else{
                    this.goods_list.push(this.goods_serial_num);
                    Vue.nextTick()
                        .then(function () {
                            this_.last_select();

                        })
                    let msgUrl='http://tl.cyg.changyou.com/goods/char_detail?serial_num='+this.goods_serial_num;
                    axios.get(msgUrl)
                        .then(function(response){
                            var result=response.data;
                            if(result.indexOf("立即购买")>-1){
                                var num_detai1=new Object();
                                num_detai1.bug_msg="抢购信息如下:<br/>此商品已经过了公式期，可以立即购买";
                                num_detai1.index=this_.goods_list_detail.length;
                                num_detai1.order=this_.goods_serial_num.trim();
                                num_detai1.show=false;
                                this_.buy(this_.goods_serial_num,num_detai1.index);
                                this_.goods_list_detail.push(num_detai1);
                            }else{
                                var start=result.indexOf("weiboText:");
                                var over=result.indexOf("bdComment:");
                                var msg=result.substring(start+11,over);
                                var num_detai=new Object();
                                num_detai.detail=msg;
                                num_detai.order=this_.goods_serial_num.trim();
                                num_detai.show=false;
                                var time=result.indexOf("剩余时间");
                                var timeMsg=result.substr(time,520);
                               // alert(timeMsg)
                                var time_day=timeMsg.indexOf("天")>-1?timeMsg.substr(timeMsg.indexOf("天")-2,2)*86400000:0
                                var time_h=timeMsg.indexOf("小时")>-1?timeMsg.substr(timeMsg.indexOf("小时")-2,2)*3600000:0
                                var time_minute=timeMsg.indexOf("分钟")>-1?timeMsg.substr(timeMsg.indexOf("分钟")-2,2)*60000:0
                                var time_seco=timeMsg.indexOf("秒")>-1?timeMsg.substr(timeMsg.indexOf("秒")-2,2)*1000:0
                                var time_=new Date().getTime()+time_day+time_h+time_minute+time_seco;
                                //alert(time_day+'day'+time_h+'h'+time_minute+'m'+time_seco+'s')
                                var targetTime=new Date(time_);
                                num_detai.date_target=(targetTime.getMonth()+1)+'月'+targetTime.getDate()+"日"+targetTime.getHours()+"时"+targetTime.getMinutes()+"分"+targetTime.getSeconds()+"秒";
                                num_detai.targetTimeTall=time_;
                                num_detai.bug_msg="抢购信息如下:";
                                num_detai.index=this_.goods_list_detail.length;
                                this_.goods_list_detail.push(num_detai);
                            }
                            this_.list_show_detail(this_.goods_serial_num.trim());
                        })
                }
            }else{
                this.$message({
                    message:'请输入正确的商品号',
                    type: 'warning'
                });
            }

        },
        stop_run:function () {
            this.status=false;
            this.$message({
                message:'账号未充值或者已到期',
                type: 'warning'
            });
        },
        list_choose:function (event) {
            var target=event.target;
            var select_num=target.innerHTML.trim();
            var old=document.getElementsByClassName("goods_select");
            this.list_show_detail(select_num);
            for(var i=0;i<old.length;i++){
                old[i].className="goods_show";
            }
            target.className += ' goods_select';
        },
        last_select:function(){
            var old=document.getElementsByClassName("goods_show");
           for(var i=0;i<old.length-1;i++){
                old[i].className="goods_show";
            }
            old[old.length-1].className+= ' goods_select';
        },
        list_show_detail:function(num){
            this.goods_list_detail.forEach(function (item) {
                if(item.order==num){
                    item.show=true;
                }else{
                    item.show=false;
                }
            })
        },
        spend:function(user,score){
            axios.post(
                "http://localhost:9090/home/spend",
                {
                    user:user,
                    score:score
                }
            ).then(function (res) {

            })
        },
        buy:function (num,index) {
            var this_=this;
            var times=0;
            // 获取图片base64
            function identify(goods,index){
                //这是网上的一张图片链接
                var url="http://tl.cyg.changyou.com/transaction/captcha-image?goods_serial_num="+goods+"&t="+(new Date().getTime());
                getBase64(url,index)
            }
            // 获取图片base64
            function getBase64(img,index){
                function getBase64Image(img,width,height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
                    var canvas = document.createElement("canvas");
                    canvas.width = width ? width : img.width;
                    canvas.height = height ? height : img.height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    var dataURL = canvas.toDataURL();
                    var dataURL_make=dataURL.substring(dataURL.indexOf(",")+1)
                    get_pass(dataURL_make,index);
                    return dataURL_make;
                }
                var image = new Image();
                image.crossOrigin = '';
                image.src = img;
                if(img){
                    image.onload =function (){
                        getBase64Image(image);//将base64传给done上传处理
                    }
                }
            }
            function get_pass(data,index) {
                axios.post(
                    "http://upload.chaojiying.net/Upload/Processing.php",
                    {
                        user:"a6821664",
                        pass2:"0c5ac1ca87c8a2d0c13afc632fa7ecb4",
                        softid:"898621",
                        codetype:"1902",
                        file_base64:data
                    },{
                        timeout:600
                    }
                ).then(function (res) {
                    var value=res.data.pic_str;
                   var addMsg="<br/>识别到验证码 <span style='color: red'>"+value+"</span>";
                    this_.goods_list_detail[index].bug_msg=this_.goods_list_detail[index].bug_msg+addMsg;
                    times++;
                    sec_buy(value,index)
                }).catch(function () {
                //    var addMsg="<br/><span style='color: red;'>再次</span>拉取更新验证码图片";
              //      this_.goods_list_detail[index].bug_msg=this_.goods_list_detail[index].bug_msg+addMsg;
                    times++;
                    identify(num,index);
                })
            }
            function sec_buy(value,index){

                $.ajax({
                    url:'http://tl.cyg.changyou.com/transaction/buy',
                    type:'post',
                    ContentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    timeout:800,
                    data:{
                        "goods_serial_num":num,
                        "captcha_code":value
                    },
                    success:function () {
                        /* $("#pass_val").val("");
                         $("#pass_val").focus();*/
                    },
                    complete:function (xmlHttpRequest,status) {
                        var addMsg="<br/>发送购买请求";
                        this_.goods_list_detail[index].bug_msg=this_.goods_list_detail[index].bug_msg+addMsg;
                        if(status=="success"){
                            var result=xmlHttpRequest.responseText;
                            if(result.indexOf('success')>-1){
                                var buyMsg2="<br/>本次共消耗"+times+"题分<br/>本次抢购结束，结果为"+result+"请去畅易阁我购买的商品中查看是否抢购成功";
                                this_.goods_list_detail[index].bug_msg=this_.goods_list_detail[index].bug_msg+buyMsg2;
                                this_.spend(localStorage.getItem("user")||"",times);
                                this_.times=this_.times+times;
                                alert('success')
                            }else{
                                // var query='http://tl.cyg.changyou.com/transaction/captcha-image?goods_serial_num='+id+'&t='+new Date().getTime();
                                // $("#pass_img").attr("src",query);
                                if(result=="captcha_error"){
                                    var buyMsg="<br/>号还未放出，继续发送购买请求";
                                    this_.goods_list_detail[index].bug_msg=this_.goods_list_detail[index].bug_msg+buyMsg;
                                   identify(num,index);

                                }else{
                                    var buyMsg1="<br/>本次共消耗"+times+"题分<br/>本次抢购结束，结果为"+result+"请去畅易阁我购买的商品中查看是否抢购成功";
                                    this_.goods_list_detail[index].bug_msg=this_.goods_list_detail[index].bug_msg+buyMsg1;
                                    this_.spend(localStorage.getItem("user")||"",times);
                                    this_.times=this_.times+times;
                                }
                            }
                        }
                        if(status=="timeout"){
                           identify(num,index);
                        }
                    }

                })
                /*axios.post(
                    "http://tl.cyg.changyou.com/transaction/buy",
                    qs.stringify({"data": JSON.stringify({
                            "goods_serial_num":num,
                            "captcha_code":value
                        } )  }),
                    {

                    }
                ).then(function (res) {
                     console.log(res)
                }).catch(function (error) {
                    console.log(error)
                })*/
            }
            identify(num,index);
        }
    },
    created(){
        var todayId=sessionStorage.getItem('id');
        if(!todayId) {
            visitAdd();
        }
        let id = this.$route.query.id;
        if(id){
            this.goods_serial_num = id;
            this.add_list();
        }
        getCheap().then((res)=>{
            this.list=res;
        });
    },
    components:{"v-nav":nav},
    mounted:function(){
        var this_=this;
        function monitor() {
            let time_now=new Date();
                this_.goods_list_detail.forEach(function (item) {
                    if(item.targetTimeTall-time_now<0&&item.targetTimeTall-time_now>-1000){
                        this_.buy(item.order,item.index)
                    }
                })
            }
        setInterval(monitor,1000);
    },
    name: 'HelloWorld'

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 #content{
   width:1100px;
   height:500px;
   margin:10px auto 0;
   border:solid 1px grey;
 }
 #action{
     display: flex;
     justify-content: space-around;
     width: 1100px;
     margin: 0 auto;
     flex-direction: row;
     margin-top:60px;
 }
  .content_header{
     height:30px;
    border-bottom: solid 1px grey;
    display: flex;
  }
  .goods_list{
     width:25%;
    line-height: 30px;
  }
  .goods_blog{
    border-left: solid 1px grey;
    width:74%;
    line-height: 30px;
  }
  .detail_blog_item{
      height: 100%;
      overflow: scroll;
  }
  .detail{
    height: 470px;
    width: 100%;
    display: flex;
  }
  .detail_list{
    width:25%;
  }
  .detail_blog{
    width:74%;
    border-left:solid 1px grey;
      padding-left: 8px;
  }
  .goods_show{
    line-height: 40px;
    border-bottom: solid 1px gray;
    cursor:pointer
  }
  .goods_select{
    background-color: orangered;
    color:white;
  }
    .content_order{
        color:orangered;
    }
    .record{
        position:absolute;
        height:900px;
        z-index: 100;
        width: 100%;
        background-color:ghostwhite;
        margin:0 auto;
        font-size: 18px;
        text-align: left;
    }
    .record h1{
        width:40%;
        margin: 0 auto;
    }
    .record p{
        margin-left:280px ;
    }
</style>
