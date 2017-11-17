// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './routers'
import ajax from 'module_path/ajax'
import custom from 'module_path/custom.js'
import webIM from 'module_path/chat.js'
import { Chinese } from 'module_path/language.js'
import * as cookieHandler from 'module_path/cookie'

Vue.config.productionTip = false

Vue.use(custom)
Vue.use(Vuex)

Vue.prototype.$ajax = ajax
Vue.prototype.$webIM = webIM
Vue.prototype.$lang = Chinese
Vue.prototype.$cookie = cookieHandler

let store = new Vuex.Store({
  state: {
    chatRecord: [],
    contact: {},
    scroller: 0
  },
  mutations: {
    writeInIndex (state, l) {
      state.list = l
    },
    writeInIndexPage (state, p) {
      state.page = p
    },
    writeInScroller (state, s) {
      state.scroller = s
    }
  },
  getters: {
    indexList: state => { return state.list },
    indexPage: state => { return state.page },
    indexScroller: state => { return state.scroller }
  }
})
/* eslint-disable no-new */
window.app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
