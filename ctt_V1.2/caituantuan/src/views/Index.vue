<template>
  <div class="index">
    <div class="top">
      <mt-header title="菜团团" fixed>
        <!-- <div slot="left">首页</div> -->
        <div slot="right" class="shortcut" v-if="isLogined == 0">
          <router-link to="/register" class="zhuce">注册</router-link>
          <router-link to="/login" class="zhuce">登录</router-link>
        </div>
        <div slot="right" class="shortcut" v-else>
          <span>你好,{{ userinfo.nickname || userinfo.username }}</span>
          &nbsp;
          <mt-button type="primary" @click="logout">注销</mt-button>
        </div>
      </mt-header>
      <mt-swipe :auto="4000">
        <mt-swipe-item>
          <img src="..\assets\images\goods\l5.jpg">
        </mt-swipe-item>
        <mt-swipe-item>
          <img src="..\assets\images\goods\l2.jpg">
        </mt-swipe-item>
        <mt-swipe-item>
          <img src="..\assets\images\goods\l4.jpg"></mt-swipe-item>
        </mt-swipe>
     <div class="index_header">
        <div v-if="isLogined == 0">
          <p>
            <span>自提点：请登录选择门店</span><!-- ><router-link to="/stores"><span class="qiehuan">切换门店></span></router-link> -->
          </p>
          <p ><span class="ziti"> 次日16:00自提</span></p>
        </div>
        <div v-else>
          <p>
            <span>自提点：{{ storeinfo.address }}</span
            ><router-link to="/stores"><span class="qiehuan">切换门店></span></router-link>
          </p>
          <p class="ziti">次日16:00自提</p>
        </div>
      </div>
    
    <div class="c">
      <div class="index_body">
        <!-- 顶部选项卡开始 -->
        <div class="d" >
          <mt-navbar v-model="active" id="boxFixed" :class="{'is_fixed' : isFixed}">
            <mt-tab-item
              :id="item.id.toString()"
              v-for="(item, index) of category"
              :key="index"
            >
             <img v-lazy="`${item.category_img}`" slot="icon" />
              
             {{ item.category_name }}
            </mt-tab-item>
          </mt-navbar>
          <!-- 顶部选项卡结束 -->
          <!-- 面板区域开始 -->
          <div
            infinite-scroll-distance="20"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="busy"
            infinite-scroll-immediate-check="true"
          >
            <div class="index_body_sp" v-for="(good, index) of goods" :key="index" @click="localnum(index)">
              <table></table>
              <router-link :to="`/details/${good.id}`" class="router" >
                <div v-if="good.image != null" class="img">
                <img v-lazy="good.image" />
              </div>
              <div class="content">
                <p class="bold">{{good.content}}</p>
                <!-- <p>{{ new Date(good.goodsdate).toLocaleString() }}</p> -->
                <span class="price">￥{{ good.saleprice }}</span>
                <mt-button class="shop" size="small" v-show="good.productnum==0" @click.native.capture.stop.prevent="add(good.productnum,index)">加入购物车</mt-button>
                  <span v-show="good.productnum!=0" class="shoping">
                   <button  class="button" @click.stop.prevent="minus(good.productnum,index)">－</button>
                   <span>{{ good.productnum }}</span>
                   <button class="button" @click.stop.prevent="add(good.productnum,index)">＋</button>
                   </span>
              </div>
              </router-link>
            </div>
          </div>
         <!-- 面板区域结束 -->
          </div>
        </div>
      </div>
        
        <div class="index_footer">
          <!-- <div class="jiarugouwuche">加入购物车</div> -->
          <!-- 底部选项卡开始 -->
          <mt-tabbar v-model="selectedTab" fixed>
            <mt-tab-item id="index">
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
            <mt-tab-item id="order" @click.native.capture="order">
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
            <mt-tab-item id="me">
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
      </div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState(["isLogined", "userinfo", "storeinfo"]),
  },
  data() {
    return {
      // 默认被选定的顶部选项卡及面板的ID
      active: "1",
      // 默认被选定的底部选项卡ID
      selectedTab: "index",
      // 存储所有的商品分类数据
      category: [],
      // 存储指定分类下包含的商品数x据
      goods: [],
      // 标识当前的状态
      busy: false,
      //初始化的页码
      page: 1,
      //存储总页数
      pagecount: "",

      value: "",

      n: 0,
      isFixed:false
    };
  },
  methods: {
    ...mapMutations(["logoutMutation"]),
    //跳转我的订单页面
    order(){
      this.$router.push('/order')
    },
    //跳转到购物车页面
    shopcart(){
      this.$router.push('/shopcart')
    },
    //头部选项卡吸附顶部事件
    handleScroll(e){
      e.preventDefault();
      e.stopPropagation()
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop // 滚动条偏移量
　　  let offsetTop = document.querySelector('#boxFixed').offsetTop; // 要滚动到顶部吸附的元素的偏移量
      this.isFixed = scrollTop > offsetTop ? true : false; // 如果滚动到顶部了，this.isFixed就为true
    },
    //数量传参
    localnum(index){
      localStorage.setItem('goodnum',this.goods[index].productnum);
    },
    // 用户注销
    logout() {
      localStorage.clear();
      this.logoutMutation();
      //this.$store.commit('logoutMutation');
    },
        //减少数量
    minus(num, index) {
      if (parseInt(num) <= 1) {
        // 最小数量必须为1,所以当数量减到最小的时候，默认为1
        this.goods[index].productnum = 1;
      } else {
        this.goods[index].productnum =
          parseInt(this.goods[index].productnum) - 1;
        let nowdate = Math.round(new Date().getTime() / 1000);
        let gnum = num - 1;
        // console.log(gnum)
        this.axios
          .get("/updatecart", {
            params: {
              uid: this.userinfo.id,
              gid: this.goods[index].id,
              num: gnum,
              price: this.goods[index].saleprice,
              date: nowdate,
            },
          })
          .then((res) => {
            let message = res.data.message;
            console.log(message);
          });
      }
    },
    // 增加数量
    add(num, index) {
      if(this.isLogined==1){
        this.goods[index].productnum =
        parseInt(this.goods[index].productnum) + 1;
      console.log("加号"+ this.goods[index].productnum)
      let nowdate = Math.round(new Date().getTime() / 1000);
      let gnum = num + 1;

      this.axios
        .get("/updatecart", {
          params: {
            uid: this.userinfo.id,
            gid: this.goods[index].id,
            num: gnum,
            price: this.goods[index].saleprice,
            date: nowdate,
          },
        })
        .then((res) => {
          let message = res.data.message;
          console.log(message);
        });
      }else{
        MessageBox.confirm('确认要登录？','您还未登录，请登录！').then(action=>{
					if(action=='confirm'){
						this.$router.push('/login');
					}
					
				}).catch(err=>{
					if(err=='cancel'){
					}
				})
      }
      
    },
    // add(e) {
    //   this.n++;
    //   e.preventDefault();
    //   e.stopPropagation();
      
      
    // },
    // minus(e) {
    //   if (this.n > 0) {
    //     this.n--;
    //     e.preventDefault();
    //     e.stopPropagation();
    //   }
    //  },
    // 加载数据的方法
    loadData(id, page) {
      // 修改状态
      this.busy = true;
      // 显示加载提示框
      this.$indicator.open({
        text: "加载中...",
        spinnerType: "fading-circle",
      });
      this.axios
        .get("/goods", {
          params: {
            uid: this.userinfo.id,
            id: id,
            page: page,
          },
        })
        .then((res) => {
          // console.log(res);
          // 获取总页数
          this.pagecount = res.data.pagecount;
          // console.log(this.pagecount);
          // 获取商品数据
          let goods = res.data.results;

          goods.forEach((good) => {
            if (good.image != null) {
              good.image = require("../assets/images/" + good.image);
            }
            
            this.goods.push(good);
          });
          // console.log(goods);
          // 修改状态
          this.busy = false;
          // 关闭加载提示框
          this.$indicator.close();
        });
    },
    // 向下滚动时调用的方法
    loadMore() {
      // 页码累加
      this.page++;
      // console.log(this.page);
      // 调用loadData()方法

      if (this.page <= this.pagecount) {
        this.loadData(this.active, this.page);
        //console.log(this.page)
      }
    },
  },
  watch: {
    active(value) {
      // 清空之前的数据
      this.goods = [];
      // 将页码重置1
      this.page = 1;
      // 此时的value代表的切换后的顶部选项卡的ID
      // 既然id(分类ID)已经知道了,那么此时就需要发送请求以获取服务器的相关数据
      // 调用loadData()方法
      this.loadData(value, this.page);
    },
  },
  mounted() {
    // // 监听滚动事件，然后用handleScroll这个方法进行相应的处理
     window.addEventListener('scroll',this.handleScroll),
    // 发送HTTP请求以获取服务器所有分类的数据
    this.axios.get("/category").then((res) => {
      // 获取服务器返回的结果
      let results = res.data.results;
      // 将服务器返回结果存储到category变量中
      results.forEach((result) => {
            if (result.category_img != null) {
              result.category_img = require("../assets/images/goods/" + result.category_img);
              // console.log(result.image)
            } 
            this.category.push(result);
          });
      // this.category = results;
    });
    // 发送HTTP请求以获取服务器中默认分类下包含的商品数据
    this.goods=[]
    // 调用loadData()方法
    this.loadData(this.active, 1);

    //   ///////////////////////////////
    // this.axios.get("/value").then(res=>{
    //   let results=res.data.results;
    //   console.log(results[0])
    //   this.active=results[0][typeid];
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
    
<style>
.index .top{
  margin-top: 40px;
}
.index .mint-swipe, .mint-swipe-items-wrap{
  height: 100px;
}
.mint-swipe-item>img{
  height: 100%;
  width: 100%;
}
.index .qiehuan{
  margin-left: 10px;
  color: #aaa;
}
.index .ziti{
  display:inline-block;
  background-color: rgba(255, 192, 203, 0.438);
  color: #e02e24;
  margin-top: 5px;
  padding: 1px;
}
.index .router-link-exact-active {
  color: #000;
}
.index .mint-navbar .mint-tab-item {
  padding: 0;
}
.index .mint-navbar .mint-tab-item.is-selected{
  border-bottom: 2px solid #e02e24;
  color: #e02e24;
}
.index .is_fixed {
    position: fixed;
    top: 40px;
    width: 100%;
    z-index: 99999;
    padding-bottom: 10px;
}
.mint-navbar .mint-tab-item-icon{
  height: 35px;
  width: 35px;
}
.mint-navbar .mint-tab-item-label{
  font-size: 12px;
  height: 18px;
}
.index .c {
  width: 100%;
  background-color: #eee ;
}
.index .zhuce {
  color: #fff;
  margin-left: 5px;
  font-size: 5px;
}
.index .index_header {
  padding: 10px;
  font-size: 14px;
}
.index .index_body_sp {
  background-color: #fff;
  margin: 10px 0;
  font-size: 16px;
  line-height: 18px;
  height: 250px;
}
.index .index_body_sp .router{
  color: #000;
}
.index .img{
  width: 100%;
  margin: 10px 0;
}
.index .img>img{
  display: block;
  margin: 10px auto;
  width: 90%;
  height: 150px;
  border-radius: 5px;
}
.index .content{
  padding: 0 20px;
  position: relative;
  height: 60;
}
.index .content .bold{
  font-weight: bold;
  font-size: 15px;
}
.index .content .shop.mint-button--default{
  position: absolute;
  right: 10px;
  bottom: 8px;
  margin-bottom: 5px;
  background-color: #e02e24;
 color: #fff;
 width: 95px;
 
}
.index .content .shoping{
  position: absolute;
  display: inline-block;
  margin-bottom: 6px;
  right: 30px;
  top: 40px;
}
.index .button{
   border: 1px #e02e24 solid;
   border-radius: 3px;
   box-shadow: none;
   background-color: #fff;
   height: 24px;
   width: 24px;
   margin: 4px 5px;
   color: #e02e24;
}

.index .content .price{
  font-size: 20px;
  display: inline-block;
  font-weight: bold;
  color: #e02e24;
  margin:  15px 0;
}
.index .mint-header {
  width: 100%;
  padding: 0 16px;
}
.index .mint-tabbar>.mint-tab-item.is-selected{
  color: #e02e24;
}
</style>

