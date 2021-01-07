<template>
    <div class="detail">
        <!-- 顶部导航 -->
         <mt-header title="订单详情" fixed  slot="left" class="top">
             <router-link slot="left" to="/">
                <mt-button icon="back">返回</mt-button>
            </router-link>
         </mt-header>
         <div class="state">
           <h3>取货状态 ：{{res.state}}</h3> 
         </div>

         <div class="body1">
             <div>
                <span class="tit-p">收货人</span>
                <span class="tit-m">{{res.username}}</span>
             </div>
             <div>
                <span class="tit-p">自提门店</span>
                <span class="tit-m">{{res.shopname}}</span>
             </div>
             <div id="feile">
                <span class="tit-p">门店地址</span>               
                <div class="tit-m" style="">{{res.address}}</div>
             </div>
     
         </div>
         <div class="shangpin">
             <div><img v-if="res.image!=undefined" :src="require(`../assets/images/${res.image}`)"></div>
             <div>
                 <h3>{{res.goodsname}}</h3>
                 <h3>已提交</h3>
             </div>
             <div>
                 <h3>￥{{res.totalmoney}}/件</h3>
                 <h3>共{{res.ordernum}}件</h3><br>
                 <button>申请售后</button>
             </div>
         </div>
         <hr>
         <div class="price">
             <div>
                 <h3>商品总额</h3>
                 <h3>￥{{res.totalmoney*res.ordernum}}</h3>
             </div>
             <div>
                 <h3>合计实付</h3>
                 <h3>￥{{res.totalmoney*res.ordernum}}</h3>
             </div>
         </div>
         
         <!-- 底部 -->
         <div class="foot">
             <div>
                 <p>订单编号 ：{{ orderdate}}</p>
                 <button>复制</button>
             </div>
             <p>下单时间 ：{{moment.unix(res.orderdate/1000).format("YYYY-MM-DD") }}</p>
             <div>
                 <table></table>
                 <p>联系不上 <a href="" style="color=bule;">平台找客服</a>协助</p>
             </div>
             <div id="again">
                 <button >再次购满</button>
             </div>
         </div>
        
    </div>
</template>

<style>
.detail{ margin: 0; padding: 0;}
/* 顶部top样式 */
.detail .top{
    background-color: #E02E24;
}
.detail .state{
    margin-top: 40px;
    color: black;
    font-size: 15px;
    font-weight: bolder;
}
.detail .state>h3{
    margin-left: 20px;
    margin-bottom: 0;
    padding-top: 15px;
    padding-bottom: 15px;
}
.detail .body1>div>span:last-child{
    margin-left: 25px;
}
.detail .body1>div:first-child>span:last-child{
    margin-left: 42px;
}
.detail .tit-p{
    margin-left: 20px;
    font-size: 15px;
    color: #A9A9A9;
    line-height: 40px;
}
.detail .tit-m{
    color: rgb(54, 51, 51);
    font-size: 15px;
}
.detail .shangpin{
    display: flex;
}
.detail .shangpin>div{
    margin-top: 15px;
}
.detail .shangpin>div:first-child{
    width: 110px;
    margin-left: 20px;

}
.detail .shangpin>div:first-child>img{
    width: 100%;
}
.detail .shangpin>div:nth-child(2)>h3:first-child{
    color: black;
    font-size: 15px;
    margin-left: 10px;
    margin-top: 0;
}
.detail .shangpin>div:nth-child(2)>h3:last-child{
    color: #A9A9A9;
    font-size: 15px;
    margin-left: 10px;
    margin-top: 10px;
}
.detail .shangpin>div:nth-child(3){
    margin-left: 60px;
    text-align: center;
    margin-top: 0;
}
.detail .shangpin>div:nth-child(3)>h3:first-child{
    color: black;
    font-size: 15px;
    
}
.detail .shangpin>div:nth-child(3)>h3:nth-child(2){
    color: #A9A9A9;
    font-size: 15px;
    margin-left: 10px;
    margin-top: 10px;
    
}
.detail .shangpin>div:nth-child(3)>button{
    color: black;
    outline: none;
    padding: 3px;
    border-radius: 4px;
    border: 1px solid rgb(116, 113, 109);
    font-size: 15px;
    background-color: white;
}
.detail .price>div{
    display: flex;
    justify-content: space-between;
}
.detail .price>div:first-child>h3{
    margin-top: 15px;
    color:#A9A9A9;
    font-size: 15px;
    margin-bottom: 15px;
}
.detail .price>div:first-child>h3:first-child{
    margin-left: 20px;
    
}
.detail .price>div:first-child>h3:last-child{
    margin-right: 15px;
}
.detail .price>div:last-child>h3{
    margin-bottom: 15px;
}
.detail .price>div:last-child>h3:first-child{
    margin-left: 20px;

}
.detail .price>div:last-child>h3:last-child{
    font-size: 20px;
    font-weight: bolder;
    color: rgb(202, 16, 16);
    margin-right: 15px;
}

.detail .foot>div:first-child{
    display: flex;
    justify-content: space-between;
}
.detail .foot>div:first-child>p{
    margin-left: 20px;
    color: #A9A9A9;
    font-size: 18px;
    margin-bottom:0;

}
.detail .foot>div:first-child>button{
    margin-right: 15px;
    border: 1px solid #A9A9A9;
    border-radius: 4px;
    width: 50px;
    height: 30px;
    background-color: white;
}
.detail .foot>p{
    margin-left: 20px;
    margin-bottom: 10px;
    color: #A9A9A9;
    font-size: 18px;
}
.detail .foot>div:nth-child(3){
    text-align: center;
    background-color: rgb(240,240,240);
    height: 80px;
    
}
.detail .foot>div:nth-child(3)>p{
    margin-top: 15px;
    font-size: 18px;
    color: #A9A9A9;
}
.detail #again{
    height: 70px;
    background-color: white;
}
.detail #again>button{
    float: right;
    margin-right: 15px;
    margin-top: 30px;
    border: 1px solid #A9A9A9;
    background-color: white;
    padding: 5px;
    font-size: 15px;
    border-radius: 4px;
}
.detail #feile{
    display: flex;
    justify-content: space-between
}
.detail #feile>div{
    width: 200px;
    height: 50px;
    margin-right: 55px;
    margin-top: 10px;
}
</style>
<script>
export default {
    props:['id'],
    data(){
        return{
            res:{},
            orderdate:Math.ceil(Math.random()*10000000000000000)
        }
    },
    methods:{
        
    },
    mounted(){
        this.axios.get('/orderdetail',{
            params:{
                id:this.id
            }
        }).then(res=>{
            this.res=res.data.results;
            console.log(res.data);
        });
    }
}
</script>