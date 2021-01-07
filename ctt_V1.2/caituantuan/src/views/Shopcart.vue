<template>
  <div class="all">
    <!-- 顶部导航兰开始 -->
    <div class="top">
      <mt-header title="购 物 车">
        <router-link to="/" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
    </div>
    <!-- 顶部导航栏结束 -->
     
    <!-- 面部区域开始 -->
    <div class="main">
      <p>
       <span>自提点：{{ storeinfo.address }}</span>
      </p>
      <div class="main1" v-for="(item, i) of goodslist" :key="i">
        <div class="list_radio">
          <span class="check_i" :class="{ checkall_i: item.checked }"  @click="checkedGoods(item)"></span>
          <!-- <input type="checkbox" :class="{checked:item.checked}" @click="checkedGoods(item)"> -->
        </div>
        <!-- 商品图片开始 -->
        <div class="list_img">
            <img v-lazy="`${item.image}`" />
        </div>
        <div class="list_c">
            <!-- 商品名称 -->
            <p>{{ item.goodsname }}</p>
            <div class="list_pn">
              <!-- 商品价格 -->
              <span>¥ {{ parseFloat(item.saleprice ).toFixed(2)}}</span>
              <span class="button">
                <button @click="sub(item.productnum, i)">-</button>
                <input type="number" :value="item.productnum" disabled />
                <button @click="add(item.productnum, i)">+</button>
              </span>
            </div>
        </div>

      </div>
    <!-- 面部区域结束 -->
    <!-- 底部区域开始 -->
    <div class="bottom_all">
      <div class="bottom_l">
        <div style="float: left; margin-left: 0.75rem" v-show="!checkedAll">
          <span class="check_ii" @click="checkAll(true)"></span>
          <!-- <p>全选</p> -->
          <!-- <label><input type="checkbox" name="demo1" checked="checkedAll"  @click="checkAll(true)">全选</label> -->
        </div>
        <div style="float: left; margin-left: 0.75rem" v-show="checkedAll">
          <span class="checkall_i" @click="checkAll(false)"></span>
          <!-- <p>取消全选</p> -->
          <!-- <label><input type="checkbox" name="demo1" checked="!checkedAll"    @click="checkAll(false)">取消全选</label> -->
        </div>
        <div style="float: right; margin-right: 1rem">
          合计：
          <span style="color: #ff4c4c"
            >&yen;<span class="allPrice1" id="finalPrice">{{
              parseFloat(totalMoney).toFixed(2)
            }}</span></span
          >&nbsp;&nbsp;&nbsp; 数量：<span class="fontColor1">{{
            checkNum
          }}</span>
        </div>
      </div>
      <div class="bottom_r">
        <mt-button type="danger" @click="settlement">结算</mt-button>
      </div>
    </div>
    <!-- 底部区域结束  -->
    </div>
    <!-- 底部选项卡开始 -->
    <mt-tabbar v-model="selectedTab" fixed>
      <mt-tab-item id="index" @click.native.capture="index">
        首页
        <img
          src="../assets/images/index_enable.png"
          slot="icon"
          v-if="selectedTab == 'index'"
        />
        <img src="../assets/images/index_disable.png" slot="icon" v-else />
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
      <mt-tab-item id="gwc">
        购物车
        <img
          src="../assets/images/gouwu_dis.png"
          slot="icon"
          v-if="selectedTab == 'gwc'"
        />
        <img src="../assets/images/gouwu_en.png" slot="icon" v-else />
      </mt-tab-item>
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
</template>
 <script>
 import { MessageBox } from 'mint-ui';
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["isLogined", "userinfo", "storeinfo"]),
  },
  data() {
    return {
      goodslist: [],
      totalMoney: 0, //商品总价
      checkNum: 0, //选择的商品数量(结算需要显示的数量)
      checkednum: 0, //选中商品总数
      checkedAll: false,
      selectedTab: "gwc"
    };
  },
  mounted() {
    console.log(this.storeinfo);
    if (this.isLogined == 1) {
      // console.log("成功啦啦啦啦" + this.userinfo.id);
      // let id = 1;
      this.axios
        .get("/shopcart", {
          params: {
            id: this.userinfo.id,
          },
        })
        .then((res) => {
          let results = res.data.results;
          results.forEach((element) => {
            element.image = require("../assets/images/goods/" + element.image);
            this.goodslist.push(element);
          });
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
  methods: {
    index(){
      this.$router.push('/')
    },
    order(){
      this.$router.push('order')
    },
    //单选
    checkedGoods(item) {
      // console.log(触发了);
      //判断属性checked是否存在，不存在添加
      if (typeof item.checked == "undefined") {
        this.$set(item, "checked", true);
        console.log(this);
        this.checkNum++;
      } else {
        item.checked = !item.checked;
        item.checked ? this.checkNum++ : this.checkNum--;
      }
      this.totalPrice();
      this.goodslist.length == this.checkednum ? this.checkAll(true): (this.checkedAll = false);
    },
    //是否全选
    checkAll(flag) {
      this.checkedAll = flag;
      flag ? (this.checkNum = this.goodslist.length) : (this.checkNum = 0);
      this.goodslist.forEach((item, index) => {
        if (typeof item.checked == "undefined") {
          this.$set(item, "checked", this.checkedAll);
          console.log("创建" + this.checkedAll);
        } else {
          item.checked = this.checkedAll;
          console.log("已创建" + this.checkedAll);
        }
      });
      this.totalPrice();
    },
    //减少数量
    sub(num, index) {
      if (parseInt(num) <= 1) {
        // 最小数量必须为1,所以当数量减到最小的时候，默认为1
        this.goodslist[index].productnum = 1;
      } else {
        this.goodslist[index].productnum =
          parseInt(this.goodslist[index].productnum) - 1;
        let nowdate = Math.round(new Date().getTime() / 1000);
        let gnum = num - 1;
        // console.log(gnum)
        this.axios
          .get("/updatecart", {
            params: {
              uid: this.goodslist[index].userid,
              gid: this.goodslist[index].productid,
              num: gnum,
              price: this.goodslist[index].saleprice,
              date: nowdate,
            },
          })
          .then((res) => {
            let message = res.data.message;
            console.log(message);
          });
      }
      this.totalPrice();
    },
    // 增加数量
    add(num, index) {
      this.goodslist[index].productnum =
        parseInt(this.goodslist[index].productnum) + 1;
      // console.log( this.goodslist[index])
      let nowdate = Math.round(new Date().getTime() / 1000);
      let gnum = num + 1;

      this.axios
        .get("/updatecart", {
          params: {
            uid: this.goodslist[index].userid,
            gid: this.goodslist[index].productid,
            num: gnum,
            price: this.goodslist[index].saleprice,
            date: nowdate,
          },
        })
        .then((res) => {
          let message = res.data.message;
          console.log(message);
        });
      this.totalPrice();
    },

    //总价
    totalPrice() {
      this.totalMoney = 0;
      let money = 0;
      this.checkNum = 0;
      this.checkednum=0;
      this.goodslist.forEach((item, index) => {
        if (item.checked) {
          money += item.saleprice * item.productnum;
          this.checkNum += item.productnum;
          this.checkednum++
        }
      });
      this.totalMoney = money;
    },
    //结算
    settlement() {
      //获取当前Unix时间戳
      console.log(this.storeinfo.id);
      if(this.storeinfo.id==undefined){
        confirm('请选择店铺')
        this.$router.push('/stores')
        return
      }
      let nowdate = Math.round(new Date().getTime());
      this.goodslist.forEach((item, index) => {
        if (item.checked) {
          this.axios
            .get("/deletecart", {
              params: {
                uid: this.goodslist[index].userid,
                gid: this.goodslist[index].productid,
                num: this.goodslist[index].productnum,
                price: this.goodslist[index].saleprice,
                date: nowdate,
                sid: this.storeinfo.id,
              },
            })
            .then((res) => {
              let message = res.data.message;
              console.log(message);
            });
        } 
      });
      this.$router.go(0)
    },
  },
};
</script>
<style>
.all{
  background: url(../assets/images/eee.png) no-repeat;
  background-attachment: fixed;
  background-size: 800px;
  height: 600px;
}
.all .main>p{
  font-size: 14px;
  padding: 10px;
}
.all .top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
}
.all .main {
  margin-top: 40px;

}
.all .main1 {
  padding: 10px;
  display: flex;
  margin: 5px 5px;
  background-color: #fff;
}

.all .list_radio {
  line-height: 83px;
}
.all .list_radio > spen {
  text-align: center;
  margin-top: 30px;
}
.all .list_m {
  border-bottom: 1px solid #999;
  display: flex;
  align-items: center;
  width: 100%;
}

.all .list_img img {
  margin-right: 15px;
  width: 80px;
  height: 80px;
  border-radius: 5px;
}

.all .list_pn {
 color: #e02e24;
 font-size: 16px;
 font-weight: bold;
 margin-top: 35px;
}
.all .button{
  margin-left: 100px;
}
.all .list_pn button {
  /* border-radius: 50%; */
  width: 20px;
  height: 20px;
  border: 1px solid #ddd;
  background-color: #fff;
}
.all .list_pn input {
  width: 20px;
  text-align: center;
  border: none;
}
.all .bottom_all {
  width: 100%;
  background:#fff;
  position: fixed;
  bottom: 55px;
  display: flex;
  height: 41px;
}
.all .bottom_l {
  width: 80%;
  line-height: 41px;
  display: flex;
}


.all .bottom_r .mint-button--normal, .mint-button--small {
 height: 30px;
 width: 80px;
 margin-right: 10px;
 border-radius: 20px;
 margin-top: 5px;
}
.all .bottom_l div input {
  margin-right: 0.3rem;
}
.all .check_i {
  height: 24px;
  width: 24px;
  display: inline-block;
  background: url(../assets/check_on.png) no-repeat;
  background-size: 20px;
  margin-right: 5px;
}
.all .check_ii{
  height: 24px;
  width: 24px;
  display: inline-block;
  background: url(../assets/check_on.png) no-repeat;
  background-size: 20px;
  margin-right: 5px;
  margin-top: 10px;

}
.all .checkall_i {
  height: 24px;
  width: 24px;
  display: inline-block;
  background: url(../assets/check.png) no-repeat;
  background-size: 20px;
  margin-right: 5px;
  margin-top: 10px;

}
.index .mint-tabbar > .mint-tab-item.is-selected {
  color: #e02e24;
}
</style>

