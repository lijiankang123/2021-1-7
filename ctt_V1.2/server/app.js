//加载Express模块
const express = require('express');
//加载cors模块
const cors = require('cors');
//加载mysql模块
const mysql = require('mysql');
//
const bodyParser=require('body-parser');

const md5=require('md5')

//创建WEB服务器
const server = express();


server.use(bodyParser.urlencoded({
    extended: false              //扩展模式
  }));

server.use(cors({
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080']
}))

//创建MySQL连接池
const pool = mysql.createPool({
    //数据库服务器地址
    host: '127.0.0.1',
    //数据库服务器端口号
    port: '3306',
    //数据库用户名
    user: 'root',
    //数据库用户密码
    password: '',
    //数据库名称
    database: 'ctt',
    //最大连接数
    connectionLimit: 15
});

// 获取所有的商品分类
server.get('/category', (req, res) => {
  // 查询ctt_category数据表的全部记录
  let sql = 'select id,category_name,category_img from ctt_category order by id';
  // 执行SQL查询
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send({ code: 200, message: '查询成功', results: results });
  });
});

//获取指定分类下包含的商品数据
server.get('/goods', (req, res) => {
  //获取用户id
  let uid=req.query.uid;
  // 获取地址栏URL参数 --- 商品分类ID
  let id = req.query.id;
  // 获取地址栏URL参数 --- 页码
  let page = req.query.page;
  // console.log(page);
  // 每页显示的记录数量
  let pagesize = 5;
  // 根据当前的页码,并且结合LIMIT语句的标准公
  // 式来计算机出offset参数值
  let offset = (page - 1) * pagesize;
  //执行SQL语句,以获取总记录数
  let sql = 'SELECT COUNT(id) AS count FROM ctt_goods WHERE typeid=?';

  //声明变量，用于存储总记录数
  let rowcount;
  pool.query(sql, [id], (error, results) => {
    if (error) throw error;
    rowcount = results[0].count;
    // console.log(results)
    // console.log(rowcount);
    /////////////////////////////////////////////////
    //计算出总页数
    let pagecount = Math.ceil(rowcount / pagesize);
    // console.log(uid)
    // console.log(id)
    // console.log(pagecount);
    // 查找特定分类下包含的商品数据
    sql='SELECT g.id,g.typeid,g.goodsname,g.saleprice,g.costprice,g.content,g.image,g.goodsdate,g.buycount,IFNULL(s.productnum,0) AS productnum FROM	ctt_goods g LEFT JOIN ctt_shopcart s ON g.id = s.productid AND s.userid=? WHERE	g.typeid =? LIMIT ?,?';
    // sql = 'SELECT id,typeid,goodsname,saleprice,costprice,content,image,goodsdate,buycount FROM ctt_goods WHERE typeid=? LIMIT ?,?';
    // 执行SQL查询
    pool.query(sql, [uid,id, offset, pagesize], (error, results) => {
      //console.log(results);
      if (error) throw error;
      // console.log(results)
      res.send({
        code: 200,
        message: "查询成功",
        results: results,
        pagecount: pagecount
      });
    });
   
  });
});



//用户注册接口
server.post('/register', (req, res) => {
  console.log(req.body.telephone)
 
  //console.log(md5('12345678'));

  //获取用户名和密码信息
  let username = req.body.username;
  let password = req.body.password;
  let telephone = req.body.telephone;
  let nickname = req.body.nickname;
  // 先需要以username为条件进行用户的查找操作
  let sql = 'SELECT COUNT(id) AS count FROM ctt_user WHERE username=?';
  // 执行SQL查询
  pool.query(sql, [username], (error, results) => {        
    if (error) throw error;
    if (results[0].count) {
      res.send({ code: 201, message: "用户注册失败" });
    } else {
      // 插入记录的SQL语句
      sql = 'INSERT INTO ctt_user(username,password,telephone,nickname) VALUES(?,MD5(?),?,?)';
      // 执行SQL语句
      pool.query(sql, [username,password,telephone,nickname], (error, results) => {
        if (error) throw error;
        //console.log(results);
        res.send({ code: 200, message: "用户注册成功" })
      })
    }
  });

});

// 用户登录的接口
server.post('/login',(req,res)=>{
  // 获取用户名和密码信息
  let username = req.body.username;
  let password = md5(req.body.password);
  // SQL查询语句
  let sql = 'SELECT id,username,nickname,avatar FROM ctt_user WHERE username=? AND password=?';
  // 执行SQL查询
  pool.query(sql,[username,password],(error,results)=>{
    if(error) throw error;
    if(results.length){
      res.send({code:200,message:"登录成功",info:results[0]});
    } else {
      res.send({code:201,message:"登录失败"});
    }
  });
});

//获取购物车信息接口
server.get('/shopcart',(req,res)=>{
    // 获取用户的ID
    let id = req.query.id;
    // 查询的SQL语句商品图片、商品名称、商品id、加入商品单价、加入商品数量、加入商品时间
    let sql = 'SELECT s.userid, g.image,g.goodsname,s.productid,g.saleprice,s.productnum,s.createtime FROM ctt_shopcart s,ctt_goods g,ctt_user u WHERE s.productid=g.id AND u.id=s.userid AND u.id=? ORDER BY s.createtime';
    // 执行SQL查询
    pool.query(sql,[id],(error,results)=>{
      if(error) throw error;
      console.log(id)
      res.send({code:200,message:"查询成功",results:results});
    });
  });
  //修改购物车数量接口
server.get('/updatecart',(req,res)=>{
  // 获取用户的ID
  let uid = req.query.uid;
  //获取商品的ID
  let gid =req.query.gid;
  //获取商品数量
  let num = req.query.num;
  //获取商品价格
  let price=req.query.price;
  //获取加入购物车时间
  let date=req.query.date;
  //查询购物车表是否有改变的商品信息
  let sql = 'SELECT COUNT(cartid) AS count FROM ctt_shopcart WHERE userid=? AND productid=?'
  // 执行SQL查询
  pool.query(sql,[uid,gid],(error,results)=>{
    if(error) throw error;
    if(results[0].count){
      sql='UPDATE ctt_shopcart SET productnum=?,price=? WHERE userid=? AND productid=?'
      pool.query(sql,[num,price,uid,gid],(error,results)=>{
        if(error) throw error;
        res.send({code:200,message:"更新成功",results:results})
      })
    }else{
      sql='INSERT INTO ctt_shopcart VALUES(NULL,?,?,?,?,?)'
      pool.query(sql,[gid,uid,num,price,date],(error,results)=>{
        if(error) throw error;
        res.send({code:200,message:"插入成功",results:results})
      })
    }

  });
});

//删除购物车商品


//购物车结算接口
server.get('/deletecart',(req,res)=>{
  // 获取用户的ID
  let uid = req.query.uid;
  //获取商品的ID
  let gid =req.query.gid;
  //获取店铺ID
  let sid=req.query.sid;
  //获取商品数量
  let num = req.query.num;
  //订单金额
  let price=req.query.price;
  //订单时间
  let date=req.query.date;
  let oderid='3';
  //插入新数据
  let sql = 'INSERT INTO ctt_order VALUES(NULL,?,?,?,?,?,?,?)'
  // 执行SQL查询
  pool.query(sql,[gid,uid,sid,oderid,num,price,date],(error,results)=>{
    if(error) throw error;
    sql='DELETE FROM ctt_shopcart WHERE userid=? AND productid=?'
    pool.query(sql,[uid,gid],(error,results)=>{
      if(error) throw error;
      res.send({code:200,message:"删除成功"})
    })
  });
});


//商铺信息接口
server.get('/shops',(req,res)=>{
  let sql = "SELECT id,shopname,address,shopimage FROM ctt_shop ORDER BY id";
  pool.query(sql,(error,results)=>{
    if(error) throw error;
    res.send({
      cood:200,
      message:"商铺查询成功",
      results:results
    })
  })
});


//////////////////////////////////
////////     订单接口     ////////
//////////////////////////////////
//获取ctt_state 表中的id和state数据
server.get('/classify',(req,res)=>{
  let sql = 'SELECT id,state FROM ctt_state';
  pool.query(sql,(error,results)=>{
    if(error) throw error;
    res.send({
      cood:200,
      mamssage:'查询成功',
      results:results
    })
  })
});

//获取指定分类下包含的商品订单
server.get('/order',(req,res)=>{
  let id = req.query.id;
  let uid=req.query.uid;
  let sql;
  if(id == 1){
    sql = 'SELECT o.id,o.goodsid,o.totalmoney,o.orderdate,g.image,g.content,s.state,o.ordernum,o.userid FROM ctt_order o,ctt_goods g,ctt_state s WHERE g.id=o.goodsid AND o.order_id=s.id AND o.userid=?';
    pool.query(sql,[uid],(error,results)=>{
      if(error) throw error;
      res.send({
        cood:200,
        message:"查询成功",
        results:results
      })
    })
  }else{
    sql = 'SELECT o.id,o.goodsid,o.totalmoney,o.orderdate,g.image,g.content,s.state,o.ordernum,o.userid FROM ctt_order o,ctt_goods g,ctt_state s WHERE g.id=o.goodsid AND o.order_id=s.id AND o.userid=? AND o.order_id=?';
    pool.query(sql,[uid,id],(error,results)=>{
      if(error) throw error;
      res.send({
        cood:200,
        message:"查询成功",
        results:results
      })
    })
  }
});

//订单详情接口
server.get('/orderdetail',(req,res)=>{
  let id=req.query.id;
  let sql='SELECT o.totalmoney,o.orderdate,o.ordernum,u.username,s.shopname,s.address,e.state,g.goodsname,g.image FROM ctt_order o,ctt_user u,ctt_goods g,ctt_shop s,ctt_state e WHERE o.userid=u.id AND o.goodsid=g.id AND o.order_id=e.id AND o.shopid=s.id AND o.id=?';
  pool.query(sql,[id],(error,results)=>{
    if(error) throw error
    res.send({
      code:200,
      message:"订单详情查询成功",
      results:results[0]
    })
  })
});
//商品详情接口
server.get('/goodsdetail',(req,res)=>{
  let id=req.query.id;
  let uid=req.query.uid;
  let sql='SELECT g.id,g.image,g.saleprice,g.costprice,g.content,g.details, IFNULL(s.productnum,0) AS productnum FROM ctt_goods g LEFT JOIN ctt_shopcart s ON s.productid=g.id AND s.userid=? WHERE  g.id=?'
  pool.query(sql,[uid,id],(error,results)=>{
    if(error) throw error
    res.send({
      code:200,
      message:"商品详情查询成功",
      results:results[0]
    })
  })
})
//随机10个商品
server.get('/randomgoods',(req,res)=>{
  let list=[];
  let id=0;
  let sql='SELECT COUNT(id) AS count FROM ctt_goods'
  pool.query(sql,(error,results)=>{
    if(error) throw error
    let count=results[0].count;
    for(let i=0;i<10;i++){
      id=parseInt(Math.floor(Math.random()*count))
      sql='SELECT id,typeid,goodsname,saleprice,costprice,content,image,goodsdate,buycount FROM ctt_goods WHERE id=?'
      pool.query(sql,[id],(error,results)=>{
        if(error) throw error
        list.push(results[0])
        if(list.length==10){
          // console.log(list.length) 
          res.send({
            code:200,
            message:"随机商品查询成功",
            results:list
          })
        }        
      })
    }   
  })
})

//指定WEB服务器监听的端口
server.listen(3000);