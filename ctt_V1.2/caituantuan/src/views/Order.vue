<template>
  <div>
    <!-- 头部开始 -->
    <div>
        <mt-header
      title="团团买菜订单" style="background-color:gray">
      <router-link to="/" slot="left">
      <mt-button icon="back"></mt-button>
      </router-link>
      </mt-header>
    </div>
    <!-- 头部结束 -->

    <!-- 顶部导航栏开始 -->
    <div>
      <mt-navbar v-model="active">
        <!-- <mt-tab-item id="1">全部</mt-tab-item> -->
        <mt-tab-item v-for="(item,index) of classify" :key="index" :id="item.id.toString()">{{item.state}}</mt-tab-item>
        <!-- <mt-tab-item id="1">全部</mt-tab-item>
        <mt-tab-item id="2">待付款</mt-tab-item>
        <mt-tab-item id="3">待提货</mt-tab-item>
        <mt-tab-item id="4">待评价</mt-tab-item> -->
      </mt-navbar>
    </div>
    <!-- 顶部导航栏结束 -->



    <!-- 面板区域开始 -->
    <div class="main">
      <mt-tab-container>
        <mt-tab-container-item>
          <div class="main-top" v-for="(item,index) of goods" :key="index">
              <div class="main-time">
                <p>{{moment.unix(item.orderdate/1000).format('YYYY/MM/DD')}}</p>
                <p>{{item.state}}</p>
              </div>
              <router-link :to="`/detail/${item.id}`">
              <div class="main-image">
                <div v-if="item.image != null">
                <img v-lazy="item.image">
                </div>
              <div>
                <div class="main-title">
                  <div>
                    <p class="info">{{item.content}}</p>
                  <p>{{item.orderstate}}</p>
                  </div>
                  <div class="main-title-price">
                    <p>¥ {{item.totalmoney.toFixed(2)}}/份</p>
                    <p>共{{item.ordernum}}件</p>
                  </div>
                </div>
              </div>
              </div>
              </router-link>
              <p class="total">合计实付：<span>¥</span><span >{{item.totalmoney.toFixed(2)}}</span></p>
              <div class="main-botton">
                <router-link to="/details">
                  <mt-button size="small">再次购买</mt-button>
                </router-link>
                <router-link to="/eval">
                  <mt-button size="small">立即评价</mt-button>
                </router-link>
              </div>
            </div>
        </mt-tab-container-item>
      </mt-tab-container>
      <!-- 底部导航栏 -->
      <div class="index_footer">
          <!-- <div class="jiarugouwuche">加入购物车</div> -->
          <!-- 底部选项卡开始 -->
          <mt-tabbar v-model="selectedTab" fixed>
            <mt-tab-item id="index" @click.native.capture="index">
              首页
              <img
                src="../assets/images/index_enable.png"
                slot="icon"
                v-if="selectedTab == 'index'"
              />
              <img
                src="../assets/images/index_disable.png"
                slot="icon"
                v-else
              />
            </mt-tab-item>
            <mt-tab-item id="order">
              我的订单
              <img
                src="../assets/images/dingdan_disable.png"
                slot="icon"
                v-if="selectedTab == 'order'"
              />
              <img src="../assets/images/dingdan_enable.png" slot="icon" v-else />
            </mt-tab-item>
           <mt-tab-item id="gwc" @click.native.capture="shopcart">
                购物车
                <img
                  src="../assets/images/gouwu_dis.png"
                  slot="icon"
                  v-if="selectedTab == 'gwc'"
                />
                <img
                  src="../assets/images/gouwu_en.png"
                  slot="icon"
                  v-else
                /> </mt-tab-item
            >
            <mt-tab-item id="me" @click.native.capture="me">
              我的
              <img
                src="../assets/images/me_enable.png"
                slot="icon"
                v-if="selectedTab == 'me'"
              />
              <img src="../assets/images/me_disable.png" slot="icon" v-else />
            </mt-tab-item>
          </mt-tabbar>
          <!-- 底部选项卡结束 -->
        </div>
      <!-- 底部导航栏 -->
    </div>
    <!-- 面板区域结束 -->

  </div>

</template>

<style scoped>
.main {
  margin-top: 10px;
  margin-left: 5px;
  margin-right: 5px;
  /* color: #a9a9a9; */
 background: url(../assets/images/eee.png) no-repeat;
  background-attachment: fixed;
  background-size: 800px;
  height: 600px;
}
.mint-navbar .mint-tab-item.is-selected{
  border-bottom: 2px solid #e02e24;
  color: #e02e24;
}
.main-top + .main-top {
  margin-top: 5px;
}
.main-top {
  background-color: #fff;
  padding: 10px;
}
.main-time {
  line-height: 2;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid gray;
}
.main-time>p:nth-child(2){
  font-size: 15px;
}
.main-image {
  padding: 10px 0 10px 0;
  display: flex;
  justify-content: space-between;
}
.main-image img {
  width: 70px;
  height: 70px;
  margin-right: 15px;
}
.main-image p + p {
  margin-top: 5px;
  color: gray;
  margin-right: 10px;
}
.main-title {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  
}
.main-title-price{
  flex: 1;
}
.main-title-price>p:first-child {
  display: flex;
  color: #000;
  /* flex-wrap: nowrap; */
  flex: 1;
  margin-left: 5px;
}
/* .main-title p:first-child{
  font-size: 15px;
} */
.main-title p:last-child{
  font-size: 15px;
  margin-top: 10px;
}

.info {
  font-size: 15px;
  color:#000;
  width: 184px;
  height: 30px;
  /* width: 100%; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/* .main-title>div:first-child p:first-child{
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
} */
.main-title>div:last-child:last-child{
  /* font-size: 15px; */
  text-align: right;
}
.main-title-price {
  margin-left: 15px;
}
.total{
  text-align: right;
}
.main span{
  color: #a9a9a9;
}
.main span:first-child{
  font-size: 15px;
}
.main span:nth-child(2){
  font-size: 20px;
}
.main-botton{
  margin-top: 5px;
  text-align: right;
}
.main-botton button{
  margin-left: 7px;
}
.mint-tabbar>.mint-tab-item.is-selected{
  color: #e02e24;
}
.main-title-price{
  width: 80px;
  margin-left: 10px;
}
.main-title-price>p:first-child{
  font-size: 15px;
}

</style>

<script>
import { MessageBox } from 'mint-ui';
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["isLogined", "userinfo"]),
  },
  data() {
    return {
      active: "1",
      classify:[],
      goods:[],
      images:[],
      selectedTab:'order'
    };
  },
  watch:{
    active(val){
      console.log(val)
      this.goods = [];
      this.axios.get('/order',{
        params:{
          uid:this.userinfo.id,
          id:val
        }
      }).then(res=>{
        let goods = res.data.results;
        console.log(res.data);
        goods.forEach(good=>{
          if(good.image!=null){
            good.image = require('../assets/images/goods/' + good.image)
          }
          this.goods.push(good);
        })       
      })
    }
  },
  mounted() {
    if(this.isLogined==1){
      console.log(this.userinfo.id)
    this.axios.get('/classify').then((res)=>{
      let results = res.data.results;
      this.classify = results
    });
    this.axios.get('/order',{
      params:{
        uid:this.userinfo.id,
        id:this.active
      }
    }).then((res)=>{
      let goods = res.data.results;
       goods.forEach(good=>{
          if(good.image!=null){
            good.image = require('../assets/images/goods/' + good.image)
          }
          this.goods.push(good);
        })
        // this.goods.push(goods);
    });
    }else{
      MessageBox.confirm('确认要登录？','您还未登录，请登录！').then(action=>{
					if(action=='confirm'){
						this.$router.push('/login');
					}
					
				}).catch(err=>{
					if(err=='cancel'){
            this.$router.push('/')
					}
				})
    }
    
  },
  methods:{
    index(){
      this.$router.push('/')
    },
    shopcart(){
      this.$router.push('/Shopcart')
    },
    me(){
      this.$router.push('/me')
    }
  }
};
</script>