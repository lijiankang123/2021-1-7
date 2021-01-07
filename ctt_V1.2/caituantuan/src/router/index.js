import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Index from '../views/Index'
import Login from '../views/Login'
import Register from '../views/Register'
import Shopcart from '../views/Shopcart'
import Stores from '../views/Stores'
import Order from '../views/Order'
import Details from '../views/Details'
import Detail from '../views/Detail'

Vue.use(VueRouter)

const routes = [
  
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  ////////////////菜团团项目//////////////////

  {
    path:'/',
    component:Index
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/register',
    component:Register
  },
  {
    path:'/details/:id',
    component:Details,
    props:true
  },
  {
    path:'/detail/:id',
    component:Detail,
    props:true
  },
  {
    path:'/shopcart',
    component:Shopcart
  },
  {
    path:'/stores',
    component:Stores
  },
 {
   path:'/order',
   component:Order

 },
  // {
  //   path:'/order',
  //   // path:'/shopcat',
  //   component:Order
  // },
  ////////////////////////////////////
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
