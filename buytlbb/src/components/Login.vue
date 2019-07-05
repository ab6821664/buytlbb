<template>
    <div class="content">
           <div class="sign_up">
               <el-button  @click="dialogVisible = true">注册新用户 / 充值</el-button>
           </div>
        <div class="sign_in">
            <el-button v-if="!counter" @click="dialogLogin = true">登录</el-button>
            <div v-else>已登录：{{counter}}<span class="quit" @click="quit">退出</span></div>
        </div>
           <div class="score">
               题分：{{change_score}}
           </div>
            <div class="deadtime">
                到期时间：{{dateshow}}
            </div>
        <el-dialog
                title="充值不用填入密码"
                :visible.sync="dialogVisible"
                 width="30%"
                >
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="form.user"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="重复密码">
                    <el-input v-model="form.re_password"></el-input>
                </el-form-item>
                <el-form-item label="卡密">
                    <el-input v-model="form.card_num" placeholder="购卡微信：13715549992"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sign_up">注册</el-button>
            <el-button type="primary" @click="recharge">充 值</el-button>
                <el-button @click="dialogVisible = false">关 闭</el-button>
             </span>
        </el-dialog>
        <el-dialog
                title="登录界面"
                :visible.sync="dialogLogin"
                width="30%"
                >
            <el-form ref="form_in" :model="form_in" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="form_in.user"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form_in.password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogLogin = false">取 消</el-button>
    <el-button type="primary" @click="sign_in">登 录</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import md5 from 'js-md5'
    export default {
        data(){
            return {
                counter:localStorage.getItem("user")||"",
                user_score:"",
                user_date:"",
                dialogVisible:false,
                dialogLogin:false,
                form: {
                    user: localStorage.getItem("user")||'',
                    password:"",
                    re_password:"",
                    card_num:""
                },
                form_in:{
                    user: '',
                    password:"",
                }

            }
        },
        computed:{
            change_score:function(){
                return this.user_score-this.take;
            },
            dateshow:function () {
               if(this.user_date==0){
                   return 0
               }else {
                   var date=new Date(this.user_date);
                   return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
               }
            }
        },
        methods:{
            sign_up:function () {
                var this_=this;
                if(this.form.password!==this.form.re_password) {
                    this_.$notify({
                        title: '两次输入不一致',
                        message: '请重新输入密码'
                    })
                    return;
                }
                axios.post(
                     "http://106.12.103.25:9090/home/adduser",
                    {
                        user:this.form.user,
                        password:md5(this.form.password),
                    },{
                        contentType:"application/json",
                    }
                ).then(function (res) {
                    if(res.data==1) {
                        this_.$notify({
                            title: '注册成功',
                            message: '已经自动登录',
                            type: 'success'
                        })
                        this_.dialogVisible = false;
                        this_.counter = this_.form.user;
                        localStorage.setItem("user",this_.counter);
                        this_.form.password = "";
                        this_.form.re_password = "";
                        this_.query_msg();
                    }else{
                        this_.$notify({
                            title: '注册失败',
                            message: '此用户名已经被注册'
                        })
                    }
                }).catch(function (error) {
                    this_.$notify({
                        title: '注册失败',
                        message: error
                    })
                })
            },
            query_msg:function () {
                var this_=this;
                axios.post(
                    "http://106.12.103.25:9090/home/queryuser",
                    {
                        user:this.counter
                    }
                ).then(function (res) {
                    this_.user_score=res.data[0].score;
                    this_.user_date=res.data[0].time;
                    var now=new Date().getTime();
                    if(res.data[0].score<1||res.data[0].time-now<0){
                        this_.$emit("stop")
                    }
                    var buy_mode;
                    if(res.data[0].time-now<0) buy_mode="未激活";
                    if(res.data[0].time-now>0&&res.data[0].time-now<3600000) buy_mode="测试卡测试模式";
                    if(res.data[0].time-now>3600000) buy_mode="会员模式";
                    this_.$emit("mode",buy_mode);
                }).catch(function () {

                })
            },
            recharge:function(){
                var this_=this;
                axios.post(
                    "http://106.12.103.25:9090/home/recharge",
                    {
                        used:this.counter,
                        id:this.form.card_num,
                        type:new Date().getTime()
                    }
                ).then(function (res) {
                    if(res.data=="充值成功"){
                        this_.query_msg();
                        this_.dialogVisible=false;
                    }else {
                        this_.$notify({
                            title: "充值失败",
                            message: res.data
                        })
                    }
                })
            },
            sign_in:function(){
                let user=this.form_in.user;
                let password=md5(this.form_in.password);
                var this_=this;
                axios.post(
                    " http://106.12.103.25:9090/home/login",
                    {
                        user:user,
                        password:password
                    }
                ).then(function (res) {
                    if(res.data==1){
                        this_.counter=user;
                        localStorage.setItem("user",user);
                        this_.query_msg();
                        this_.dialogLogin=false;
                    }else {
                        this_.$notify({
                            title: '登录失败',
                            message: '密码账号不符，登录失败'
                        })
                    }
                })
            },
            quit:function () {
                this.counter="";
                this.user_date="";
                this.user_score=""
                localStorage.setItem("user","")
            }
        },
        props: ["take"],
        mounted:function(){
            if(localStorage.getItem("user")){
                this.query_msg();
            }

        },
        name: "Login",

    }
</script>

<style scoped>
 .content{
     height: 80px;
     width:80%;
     display: flex;
     margin: 0 auto;
     background-color: #ff887c;
     margin-bottom: 30px;
     justify-content: space-around;
     color:white;
     font-size:20px;
     align-items: center;
 }
    .quit{
        margin-left: 20px;
        border: solid 3px #6a75ff;
        padding: 5px 15px;
        font-size: 15px;
    }
</style>