import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //标识用户是否登录
    isLogined:localStorage.getItem('isLogined')||0,
    //存储用户相关信息
    userinfo:JSON.parse(localStorage.getItem('userinfo'))||{},
    //存储店铺相关信息
    storeinfo:JSON.parse(localStorage.getItem('storeinfo'))||{}
  },
  mutations: {
    //用户登录成功
    loginMutation(state,payload){
      state.isLogined=1;
      state.userinfo=payload
    },
    logoutMutation(state){
      state.isLogined=0;
      state.userinfo={}
    },
    storeMutation(state,payload){
      state.storeinfo=payload
    }
  },
  actions: {
  },
  modules: {
  }
})
