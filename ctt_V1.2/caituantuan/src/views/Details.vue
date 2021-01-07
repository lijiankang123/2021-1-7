<template>
  <div class="details">
    <mt-header fixed>
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="navimg">
      <img
        v-if="goodsDetails.image != undefined"
        :src="require(`../assets/images/${goodsDetails.image}`)"
      />
    </div>
    <div class="price">
      <p>
        <span>￥</span><span>{{ goodsDetails.saleprice.toFixed(1) }}</span
        ><span>{{ goodsDetails.costprice.toFixed(1) }}元</span>
      </p>
      <p>限量抢购</p>
    </div>
    <div class="content">
      <p>{{ goodsDetails.content }}</p>
      <div class="content_footer">
        <p><span>售后无忧</span> | 品质保障·极速退款·次日自提</p>
      </div>
    </div>
    <div v-if="isShoping>0" class="btn" @click="addorminus">
      <button>-</button>
      <span>{{ n }}</span>
      <button>+</button>
    </div>
    <div v-else class="joinshop" @click="goshopcar">加入购物车</div>
    <div v-html="goodsDetails.details"></div>
    <div class="randomgoods">
      <p>今日特价</p>
      <div v-for="(item, i) of randomgoods" :key="i">
        <img :src="require(`../assets/images/${item.image}`)" alt="" />
        <h5>{{ item.goodsname }}</h5>
        <span class="span1">即将涨价</span>
        <span class="span2">仅剩{{ item.buycount }}件</span>
        <p><span>￥</span>{{ item.saleprice }}</p>
        <div @click="addshopcar" :data-price="item.saleprice"  :data-id="i" :data-goodid="item.id">加入购物车</div>
        <div class="btns" @click="aorm">
          <button :data-price="item.saleprice"  :data-id="i" :data-goodid="item.id">-</button>
          <span>1</span>
          <button :data-price="item.saleprice"  :data-id="i" :data-goodid="item.id">+</button>
        </div>
      </div>
    </div>
    <div class="shopping">
      <img src="../assets/images/icon/shopcar.png" alt="" />
      <span v-if="isShoping" style="font-size: 16px"
        >￥{{ total.toFixed(2) }}</span
      >
      <span v-else>购物车是空的</span>
      <div class="pay" @click="pay">去支付</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["id"],
  data() {
    return {
      goodsDetails: {
        saleprice: 0,
        costprice: 0,
      },
      randomgoods: [],
      isShoping: 0,
      n: 0,
      totalArr: [],
      arr:[0,0,0,0,0,0,0,0,0,0],
      arrtotal:0
    };
  },
  methods: {
   randomgoodscar(gid,num,price) {
      var gid=gid;
      var num=num;
      var price=price;
      let date = new Date().getTime();
      this.axios
        .get("/updatecart", {
          params: {
            uid:this.userinfo.id,
            gid:gid,
            num:num,
            price:price,
            date,
          },
        })
        .then((res) => {});
    },
     updatecart() {
      let date = new Date().getTime();
      this.axios
        .get("/updatecart", {
          params: {
            uid: this.userinfo.id,
            gid: this.goodsDetails.id,
            num: this.n,
            price: this.goodsDetails.saleprice,
            date,
          },
        })
        .then((res) => {
           
        });
    },
    pay() {
      if(this.isShoping>0){
      this.$router.push('/shopcart')
      // 单独支付
      //   let date = new Date().getTime();
      // this.$messagebox
      //   .confirm("", {
      //     title: "提示",
      //     message: "你确定要支付吗？",
      //     showCancelButton: true,
      //   })
      //   .then((result) => {
      //     this.axios
      //       .get("/deletecart", {
      //         params: {
      //           uid: this.userinfo.id,
      //           gid: this.goodsDetails.id,
      //           sid: this.storeinfo.id,
      //           num: this.n,
      //           price: this.goodsDetails.saleprice,
      //           date,
      //         },
      //       })
      //       .then((res) => {
      //         if (res.data.code == 200) {
      //           this.$messagebox.alert("支付成功").then(action=>{
      //             this.$router.go(0)
      //           });
      //         }
      //       });
      //   })
      //   .catch((err) => {});
      }
    },
    aorm(e) {
      if (e.target.innerHTML == "+") {
        e.target.parentNode.children[1].innerHTML++;
        this.isShoping++;
        ////////////////////////////////////////////////
        let n=e.target.parentNode.children[1].innerHTML;
        let price=e.target.dataset.price;
        let zj=n*price;
        let i=e.target.dataset.id;
        let goodid=e.target.dataset.goodid
        // this.arr[i]=zj;
        this.$set(this.arr,i,zj)
        this.randomgoodscar(goodid,n,price);
        // console.log(this.arr)
        ////////////////////////////////////////////////
      } else if (e.target.innerHTML == "-") {
        if (e.target.parentNode.children[1].innerHTML == 1) {
          e.target.parentNode.style.display = "none";
          e.target.parentNode.previousElementSibling.style.display = "block";
        }
        e.target.parentNode.children[1].innerHTML--;
        this.isShoping--;
        ////////////////////////////////////////////////
        let n=e.target.parentNode.children[1].innerHTML;
        let price=e.target.dataset.price;
        let zj=n*price;
        let i=e.target.dataset.id;
        let goodid=e.target.dataset.goodid
        // this.arr[i]=zj;
        this.$set(this.arr,i,zj)
        this.randomgoodscar(goodid,n,price);
        // console.log(this.arr)
        ////////////////////////////////////////////////
      }
    },
    addshopcar(e) {
        this.isShoping++;
      e.target.style.display = "none";
      e.target.nextElementSibling.style.display = "block";
      e.target.nextElementSibling.children[1].innerHTML = "1";
      ////////////////////////////////////////////////
      let n=e.target.nextElementSibling.children[1].innerHTML;
      let price=e.target.dataset.price;
      let zj=n*price;
      let i=e.target.dataset.id;
      let goodid=e.target.dataset.goodid
      // this.arr[i]=zj;
      this.$set(this.arr,i,zj)
      this.randomgoodscar(goodid,n,price);
      // console.log(this.arr)
      ////////////////////////////////////////////////
    },
    goshopcar() {
      if(localStorage.getItem('isLogined')){
        this.isShoping++;
        this.n = 1;
        this.updatecart();
      }else{
        this.$messagebox
        .confirm("", {
          title: "提示",
          message: "您还没有登录,确定要登录吗？",
          showCancelButton: true,
        }).then(res=>{
          this.$router.push('/login')
        }).catch(res=>{})
      }
    },
    addorminus(e) {
      if (e.target.innerHTML == "+") {
        this.n++;
        this.updatecart();
      } else if (e.target.innerHTML == "-") {
        if (this.n == 1) {
          this.isShoping--;
        }
        this.n--;
        this.updatecart();
      }
    },
  },
  watch:{
    arr(){
      var sum=0
      for(var a of this.arr){
        sum+=a
      }
      this.arrtotal=sum
      console.log(this.arrtotal)
    }
  },
  computed: {
    ...mapState(["isLogined", "userinfo", "storeinfo"]),
    total: function () {
      return this.n * this.goodsDetails.saleprice+this.arrtotal;
    },
  },
  created(){
     
  },
  mounted() {
   
    // console.log(this.isLogined);
    // console.log(this.userinfo);
    // console.log(this.storeinfo);
    this.axios("/goodsdetail", {
      params: {
        id: this.id,
        uid:this.userinfo.id
      },
    }).then((res) => {
      console.log(res)
      this.goodsDetails = res.data.results;
      // console.log(this.goodsDetails);
      this.n=this.goodsDetails.productnum
           if(this.n>0){
              this.isShoping=1;
            }
    });
    this.axios("/randomgoods").then((res) => {
      this.randomgoods = res.data.results;
      console.log(this.randomgoods);
    });
  },
};
</script>

<style scoped>
.details h1,
h2,
h3,
h4,
h5,
p,
span,
img {
  margin: 0;
  padding: 0;
}
.details {
  position: relative;
}
.details .btn {
  position: absolute;
  right: 10px;
  top: 310px;
}
.details .btn > span,
.details .btn > button {
  display: inline-block;
  text-align: center;
  outline: none;
  width: 25px;
  height: 25px;
}
.details .btn > button,
.details .btns > button {
  border: 1px solid #f00;
  line-height: 15px;
  font-size: 20px;
}
.details .btn > button:nth-child(1),
.details .btns > button:nth-child(1) {
  background-color: #fff;
  color: #f00;
}
.details .btn > button:nth-child(3),
.details .btns > button:nth-child(3) {
  background-color: #f00;
  color: #fff;
}
.details .shopping {
  position: fixed;
  width: 90%;
  height: 40px;
  line-height: 40px;
  color: #fff;
  background-color: #f00;
  bottom: 50px;
  border-radius: 50px;
  left: 50%;
  margin-left: -45%;
}
.details .shopping > span {
  font-size: 10px;
  margin-left: 20px;
}
.details .shopping > img {
  vertical-align: middle;
  margin-left: 30px;
}
.details .shopping .pay {
  position: absolute;
  height: 25px;
  line-height: 25px;
  width: 15%;
  color: #f00;
  background-color: #fff;
  border-radius: 30px;
  padding: 3px 15px;
  top: 5px;
  right: 10px;
}
.details .joinshop {
  width: 80px;
  height: 25px;
  line-height: 25px;
  font-size: 12px;
  text-align: center;
  color: #fff;
  background-color: #f00;
  border-radius: 5px;
  position: absolute;
  right: 10px;
  top: 310px;
}
.details .randomgoods {
  height: 35px;
  line-height: 35px;
  background-color: #ccc;
}
.details .randomgoods > p {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #f33;
}
.details .randomgoods img {
  width: 100%;
}
.details .randomgoods .span1 {
  font-size: 12px;
  font-weight: 100;
  color: #fff;
  background-color: #f00;
  padding: 1px 1px;
}
.details .randomgoods .span2 {
  font-size: 12px;
  font-weight: 100;
  color: #f00;
  border: 1px solid #f00;
}
.details .randomgoods div {
  margin-top: 5px;
  background-color: #eee;
  padding: 10px 15px;
}
.details .randomgoods div > p {
  color: #f00;
  font-size: 16px;
  font-weight: 600;
}
.details .randomgoods div > p > span {
  font-size: 10px;
}
.details .randomgoods div {
  position: relative;
}
.details .randomgoods div > div {
  padding: 0;
  width: 80px;
  height: 25px;
  line-height: 25px;
  font-size: 12px;
  text-align: center;
  color: #fff;
  background-color: #f00;
  border-radius: 5px;
  position: absolute;
  right: 20px;
  bottom: 30px;
}
.details .randomgoods .btns {
  background-color: #fff;
  color: #000;
  display: none;
}
.details .randomgoods .btns button,
.details .randomgoods .btns > span {
  display: inline-block;
  text-align: center;
  outline: none;
  width: 25px;
  height: 25px;
}
.details p {
  margin: 0;
  padding: 0;
}
.details .navimg {
  margin-top: 45px;
}
.details .navimg img {
  width: 100%;
  height: 205px;
  vertical-align: bottom;
}
.details .price {
  color: #fff;
  height: 60px;
  background-color: #f00;
}
.details .price p:first-child span:first-child {
  font-size: #aaa;
  font-size: 10px;
}
.details .price p:first-child span:nth-child(2) {
  font-size: 24px;
}
.details .price p:first-child span:nth-child(3) {
  font-size: 10px;
  color: #000;
  text-decoration: line-through;
  margin-left: 10px;
}
.details .price p:last-child {
  font-size: 12px;
  font-weight: 100;
}
.details .price > p {
  margin: 0;
  padding: 0 15px;
  padding-top: 5px;
}
.details .content {
  padding-top: 10px;
}
.details .content p {
  font-size: 16px;
  font-weight: 600;
  padding-left: 10px;
}
.details .content .content_footer {
  margin: 0 auto;
  border-radius: 5px;
  width: 95%;
  height: 25px;
  line-height: 25px;
  background-color: #ccc;
  margin-top: 40px;
  margin-bottom: 10px;
}
.details .content .content_footer p {
  font-weight: 400;
  font-size: 12px;
}
.details .content .content_footer p span {
  font-size: 12px;
  font-weight: 600;
}
</style>