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
    chatRecord: {},
    contact: {},
    user: {},
    selected: ''
  },
  mutations: {
    setUser (state, u) {
      state.user = u
    },
    setChatRecord (state, name, d) {
      // if (a) {
      //   state.chatRecord[name] = d;
      // }
    },
    setContact (state, p) {
      state.contact[p.name] = p.data
    },
    setSelected (state, s) {
      state.selected = s
    },
    setConcatStatus (state, c) {
      state.contact[c.name].detail = c.status
    }
  },
  getters: {
    getUser: state => state.user,
    getChatRecord: state => state.chatRecord,
    getContact: state => state.contact,
    getSelected: state => state.selected
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
