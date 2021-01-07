<template>
  <div>
    <!-- 顶部导航开始 -->
    <div>
      <mt-header title="菜团团">
        <router-link to="/" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
        <router-link to="/login" slot="right">登录</router-link>
      </mt-header>
    </div>
    <!-- 顶部导航结束 -->
    <!-- 表单区域开始 -->
    <div>
      <mt-field
        type="text"
        label="姓名"
        placeholder="请输入真实姓名"
        v-model="username"
        @blur.native.capture="checkUsername"
        :state="usernameState"
      >
      </mt-field>

      <!-- 昵称 -->
      <mt-field
        type="text"
        label="昵称"
        placeholder="请输入昵称"
        v-model="nickname"
        @blur.native.capture="checknickname"
        :state="nicknameState"
      >
      </mt-field>

      <!-- 手机号 -->
      <mt-field
        type="text"
        label="手机号"
        placeholder="请输入手机号"
        v-model="telephone"
        @blur.native.capture="checkTelephone"
        :state="telephoneState"
      >
      </mt-field>


      <mt-field
        type="password"
        label="密码"
        placeholder="请输入密码"
        v-model="password"
        @blur.native.capture="checkPassword"
        :state="passwordState"
      >
      </mt-field>
      <mt-field
        type="password"
        label="确认密码"
        placeholder="请再次输入密码"
        v-model="conpassword"
        @blur.native.capture="checkConpassword"
        :state="conpasswordState"
      >
      </mt-field>
      <mt-button type="primary" size="large" @click="handle"
        >免费注册</mt-button
      >
    </div>
    <!-- 表单区域结束 -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      //用户名、密码及确认密码
      username: "",
      password: "",
      nickname:"",
      telephone:"",
      conpassword: "",
      //用户名、密码及确认密码的状态
      usernameState:"",
      passwordState:"",
      nicknameState:"",
      telephoneState:"",
      conpasswordState:""
    };
  },
  methods: {
    // 校验姓名
    checkUsername() {
      let usernameRegExp = /^[\u4e00-\u9fa5]{1,5}$/;
      if (usernameRegExp.test(this.username)) {
        this.usernameState = "success";
        return true;
      } else {
        this.$toast({
          message: "姓名错误",
          position: "middle",
          duration: 2500,
        });
        this.usernameState = "error";
        return false;
      }
    },

    // 校验昵称
    checknickname() {
      let nicknameRegExp = /^[\u4e00-\u9fa50-9a-zA-Z]{1,5}$/;
      if (nicknameRegExp.test(this.nickname)) {
        this.nicknameState = "success";
        return true;
      } else {
        this.$toast({
          message: "用户名错误",
          position: "middle",
          duration: 2500,
        });
        this.nicknameState = "error";
        return false;
      }
    },

    // 校验手机号
    checkTelephone() {
      let telephoneRegExp = /^1[3-9]\d{9}$/;
      if (telephoneRegExp.test(this.telephone)) {
        this.telephoneState = "success";
        return true;
      } else {
        this.$toast({
          message: "用户名错误",
          position: "middle",
          duration: 2500,
        });
        this.telephoneState = "error";
        return false;
      }
    },
    // 校验密码
    checkPassword() {
      let passwordRegExp = /^[0-9A-Za-z]{8,16}$/;
      if (passwordRegExp.test(this.password)) {
        this.passwordState = "success";
        return true;
      } else {
        this.$toast({
          message: "密码错误",
          position: "middle",
          duration: 2500,
        });
        this.passwordState = "error";
        return false;
      }
    },
    // 校验两次密码是否一致
    checkConpassword() {
      
      if (this.password == this.conpassword) {
        this.conpasswordState = "success";
        return true;
      } else {
        this.$toast({
          message: "两次密码不一致",
          position: "middle",
          duration: 2500,
        });
        this.conpasswordState = "error";
        return false;
      }
    },
    //用户注册
    handle() {
      //调用之前的检测用户名、密码及两次密码是否一致函数
      //需要注意的是:此时会引发短路求值的现象
      //A.在逻辑或运算时,第一个表达式的结果为true会造成短路
      //B.在逻辑与运算时,第一个表达式的结果为false会造成短路
      if(this.checkUsername() && this.checkPassword() && this.checkConpassword()){
        console.log(this.password)
        //此时需要将用户名、密码等信息的提交到WEB服务器
        this.axios.post('/register','username=' + this.username  + '&password='  + this.password + '&telephone=' + this.telephone + '&nickname=' + this.nickname).then(res=>{
            //注册失败
            if(res.data.code == 201){
              // 显示模态对话框(类似于window.alert()方法)
              this.$messagebox("提示信息","用户已经存在");
            }
            //注册成功
            if(res.data.code == 200){
              this.$router.push('/login');
            }
        });
      }
    },
  },
};
</script>

<style>
  .mint-header{
    background-color: red !important;
  }
  .mint-button--primary{
    background-color: red !important;
    
  }
</style>

