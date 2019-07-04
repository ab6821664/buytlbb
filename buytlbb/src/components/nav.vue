<template>
    <header>
       <div class="link-tab">
           <div v-bind:class="{ select: index==1 }" @click="chooseTab(1,'/')"><i class="el-icon-s-home"></i> <span to="/">首页</span></div>
           <div v-bind:class="{ select: index==2 }" @click="chooseTab(2,'/buy')"><i class="el-icon-goods"></i> <span to="/buy">公示区秒号</span></div>
           <div v-bind:class="{ select: index==3 }" @click="chooseTab(3,'/trading')"><i class="el-icon-star-off"></i> <span to="trading">交易区监控</span></div>
           <div class="login" @click="loginDialogVisible=true"><i class="el-icon-user"></i> 登录/注册</div>
       </div>
        <div class="account" v-show="index==1">
             <div>
                 <img src="../assets/user.png">
             </div>
             <div class="msg">
                 <p>当前账号：{{userInfo.account}}</p>
                 <p>题分：{{userInfo.score}}</p>
                 <p>到期时间：{{userInfo.deadLineTime | date}} <span v-if="userInfo.deadLineTime-new Date().getTime()<7200000 && userInfo.deadLineTime-new Date().getTime()>1 "> }}| 测试卡</span></p>
             </div>
        </div>
        <el-dialog
                :title="loginViewStatus==true?'登录':'注册'"
                :visible.sync="loginDialogVisible"
                width="25%"
                center>
            <div id="account-view">
                <el-input
                        placeholder="请输入账号"
                        prefix-icon="el-icon-user"
                        v-model="account">
                </el-input>

                <el-input
                        placeholder="请输入密码"
                        prefix-icon="el-icon-s-goods"
                        v-model="password">
                </el-input>

                <el-input
                        placeholder="请输入卡密 购买微信13715549992，默认充值当前登录账号"
                        prefix-icon="el-icon-s-help"
                        v-model="card"
                        v-show="loginViewStatus" >
                </el-input>

                <p>
                    <span style="float:right;color:#ff8e3d" @click="loginViewStatus=!loginViewStatus">{{loginViewStatus==true?'新用户注册':'已有账号，马上登录'}}</span>
                </p>


            </div>
            <span slot="footer" class="dialog-footer">
       <el-button type="primary"   v-show="loginViewStatus" @click="loginIn">登 录</el-button>
       <el-button type="primary" v-show="loginViewStatus" @click="rechargeAccount" title="账号默认充值当前账号">充 值</el-button>
       <el-button type="primary"  v-show="!loginViewStatus"  @click="registAccount">注 册</el-button>
      </span>
        </el-dialog>
    </header>
</template>

<script>
    import {regist,queryUser,login,recharge} from '../api/api';
    import md5 from 'md5'
    export default {
        data:function(){
            return {
                index:1,
                loginDialogVisible:false,
                userInfo:{
                    account:'',
                    score:'',
                    deadLineTime:''
                },
                loginViewStatus:true,
                account:localStorage.getItem('user')||'',
                password:'',
                card:'',
            }
        },
        name: "navtab",
        filters:{
            date(value){
                if(value==0){
                    return 0
                }else {
                   let time= new Date(value);
                   let year = time.getFullYear();
                   let month = time.getMonth()+1;
                   let day = time.getDate();
                   let h = time.getHours();
                   let m= time.getMinutes();
                   let s = time.getSeconds();
                   return year+"-"+month+"-"+day+" "+h+":"+m+":"+s
                }
            }
        },
        methods:{
            //首页菜单切换
            chooseTab(index,url){
                this.index=index;
                this.$router.push({path:url,query:{index:index}});
            },
            //注册
            registAccount(){
                 let this_ = this;
                regist({user:this.account,password:md5(this.password)}).then(function (res) {
                   if(res.data==1){
                       this_.userInfo.account = this_.account;
                       localStorage.setItem("user",this_.account)
                       this_.$message({
                           message: '注册成功，已经登录',
                           type: 'success'
                       });
                       this_.queryUserMsg(this_.account);
                       this_.loginDialogVisible=false;
                   }else {
                       this_.$message({
                           message: ' 此账号已经注册过',
                           type: 'warning'
                       });
                   }
                }).catch(function (err) {
                    console.log(err)
                })
            },
            // 查询
            queryUserMsg(account){
                let this_ = this;
                queryUser({user:account}).then(res=> {
                     this_.userInfo.account=res.data[0].user;
                    this_.userInfo.score=res.data[0].score;
                    this_.userInfo.deadLineTime=res.data[0].time;
                    sessionStorage.setItem("time",res.data[0].time);
                    this.$emit('userInfo',this_.userInfo.deadLineTime)
                })
            },
            //登录
            loginIn(){
                let this_=this;
                login({user:this.account,password:md5(this.password)}).then(function (res) {
                    if(res.data==1){
                        this_.queryUserMsg(this_.account);
                        localStorage.setItem("user",this_.account)
                        this_.loginDialogVisible=false;
                        this_.$message({
                            message: '登录成功',
                            type: 'success'
                        });
                    }else {
                        this_.$message({
                            message: ' 登录失败',
                            type: 'warning'
                        });
                    }
                })
            },
            //充值
            rechargeAccount(){
                let this_=this;
                if(this.card.length==0){
                    this.$message('卡号不能为空');
                    return
                }
                recharge({id:this.card,type:new Date().getTime(),used:this.userInfo.account||this.account}).then(function (res) {
                    this_.$message(res.data);
                    this_.loginDialogVisible=false;
                    this_.queryUserMsg(this_.userInfo.account||this_.account);
                })
            }
        },
        mounted() {
            let user = localStorage.getItem('user');
            if(user){
                this.queryUserMsg(user);
            }
            this.index=this.$route.query.index || 1;
        }
    }
</script>

<style scoped>
    header{
        background-color: #212a31;
        width: 100%;
        height: auto;
        padding-top: 12px;
    }
    .link-tab{
        display: flex;
        color: #a6a6a6;
        width: 1100px;
        margin: 0 auto;
        height:40px;
        position: relative;
    }
    .link-tab>div:not(:first-child){
        margin-left: 25px;
    }
    .link-tab>div:hover{
        color: #ffd435;
    }
    .link-tab a:hover{
        color: #ffd435;
    }
    .select{
        color: #ffd435;
    }
    .select a{
        color: #ffd435;
    }

    .account{
      color: white;
      display: flex;
      height: 80px;
      width: 1100px;
      margin: 0 auto;
      margin-top:25px;
    }
    .login{
       position: absolute;
        right: 0px;
    }
    .account .msg{
        font-size: 12px;
        text-align: left;
        margin-left: 30px;
    }
    .msg:hover{
        color:yellow;
    }
    .account .msg p{
        line-height: 20px;
    }
    #account-view div{
        margin-bottom: 20px!important;
    }
</style>