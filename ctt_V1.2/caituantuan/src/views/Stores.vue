<template>
  <div>
    <!-- 顶部头开始 -->
    <div class="top">
       <mt-header
    title="菜团团">
    <router-link to="/" slot="left">
    <mt-button icon="back"></mt-button>
    </router-link>
    </mt-header>
    <!-- 顶部头结束 -->
    <div class="chench">
      <p>当前选择的地址</p>
      <p><span>{{shop.address}}</span>
      <!-- <span>其它地址></span> -->
      </p>
    </div>
    </div>
    <div class="main">
       <mt-tab-container>
      <mt-tab-container-item>
          <div class="main_top" v-for="(items,index) of shops" :key="index">
            <div class="main_button">
              <img v-lazy="items.shopimage">
            </div>
            <div class="main_p">
              <div class="main_button">
                <p>{{items.shopname}}</p>
                <button @click="intoshop(index)">进店</button>
              </div>
              <p>{{items.address}}</p>
            </div>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>  
</template>
<script>
export default {
  data(){
    return{
      active:"1",
      selected:"item01",
      selectedTed:"index",
      category:[],
      shops:[],
      shop:{}
    }
  },
  methods:{
    intoshop(index){
      // this.shop=shops[index]
      this.shop=this.shops[index];
      this.$store.commit('storeMutation',this.shop);
      localStorage.setItem('storeinfo',JSON.stringify(this.shop));
      this.$router.push('/');

      
    }
  },
  mounted(){
    this.axios.get("/shops").then(res=>{
      let results=res.data.results;
      results.forEach(shops=>{
        if(shops.shopimage!=null){
          shops.shopimage = require('../assets/images/stores/' + shops.shopimage)
        }
        this.shops.push(shops);
      })
      // this.shops=results;
      console.log(this.shops)
      this.shop=this.shops[0]
      this.$store.commit('storeMutation',this.shop);
      localStorage.setItem('storeinfo',JSON.stringify(this.shop));
    })
  }
}
</script>

<style scoped>
.top{
  background-color: white;;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 666;

}
.mint-header{
  background-color: red;
}
.chench{
  /* background-color:honeydew; */
  font-size:15px;
  margin-left:5px;
  margin-bottom: 12px;;
}
.chench p:nth-child(1){
  font-size:14px;
  margin-bottom:10px;
  margin:12px 5px;
}
.chench p:nth-child(2) span:nth-child(1){
  font-size:17px;
  margin:60px 5px;
  padding-top:50px;
  margin-right:30px;
  font-weight: bolder;
}
.chench p:nth-child(2) span:nth-child(2){
  margin-bottom:9px;
  font-size:12px;
}
.main{
  padding: 15px;
  margin-top: 126px;
}
  .main_top{
    display: flex;
    margin-bottom: 10px;
  }
  .main_button{
    display: flex;
    justify-content: space-between;
  }
  .main_button>button{
    background-color: red;
    border: 0;
    color: white;
    padding: 5px 10px;
    border-radius: 3px;
  }
  .main_top img{
    width: 80px;
    height: 80px;
  }
  .main_p{
    width: 260px;
    margin-left: 15px;
  }
  .main_p>p:first-child{
     font-size: 20px;
     color: black;
     margin-bottom: 15px;
  }
  .main_p>p:nth-child(2){
    font-size: 13px;
    color: #ccc;
  }
</style>

