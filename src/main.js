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
Vue.prototype.$messageHandler = function (message, type, me) {
  // console.log(message)
  let result = {}
  result.sentByMe = message.from === me.username
  result.data = {
    sentByMe: message.from === me.username,
    type: type,
    status: message.status
  }
  result.data.userInfo = {
    avatar: (result.sentByMe ? me.avatar : message.ext.avatar),
    nickname: (result.sentByMe ? me.nick : message.ext.nickname)
  }
  result.data.format = (message.created ? new Date(message.created) : new Date()).toLocaleString()
  switch (type) {
    case 'txt' :
      result.brief = message.data
      result.data.data = message.data
      break
    case 'loc':
      result.brief = '[ 定位信息 ]'
      result.data.width = message.width
      result.data.height = message.height
      result.data.url = message.url
      result.data.secret = message.secret
      result.data.filename = message.filename
      result.data.accessToken = message.accessToken
      result.data.location = {
        address: message.ext.locationAddress,
        lat: message.ext.locationLatitude,
        lng: message.ext.locationLongitude,
        name: message.ext.locationName
      }
      break
    case 'audio':
      result.brief = '[ 音频 ]'
      result.data.secret = message.secret
      result.data.url = message.url
      result.data.filename = message.filename
      break
    case 'img':
      result.brief = '[ 图片 ]'
      result.data.width = message.width
      result.data.height = message.height
      result.data.url = message.url
      result.data.secret = message.secret
      result.data.filename = message.filename
      result.data.accessToken = message.accessToken
      break
    case 'url':
      result.brief = '[ 分享链接 ]'
      result.data.detail = message.ext.webChatDetail
      result.data.href = message.ext.webChatHref
      result.data.image = message.ext.webChatImage
      result.data.title = message.ext.webChatTitle
      break
  }
  return result
}

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
    setChatRecord (state, c) {
      if (c.target === 'replace') {
        state.chatRecord[c.name] = c.data
      } else if (c.target === 'append') {
        state.chatRecord[c.name].push(c.data)
      }
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
