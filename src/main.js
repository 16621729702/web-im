// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './routers'
import ajax from 'module_path/ajax'
import custom from 'module_path/custom.js'
import webIM from 'module_path/chat.js'
// import { Chinese } from 'module_path/language.js'
import * as cookieHandler from 'module_path/cookie'
import notification from 'module_path/notification'
import typeDetection from 'module_path/typeDetection'

Vue.config.productionTip = false

Vue.use(custom)
Vue.use(Vuex)

Vue.prototype.$ajax = ajax
Vue.prototype.$webIM = webIM
Vue.prototype.$cookie = cookieHandler
Vue.prototype.$notification = notification
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
    case 'txt':
      result.brief = message.data
      result.data.data = message.data
      break
    case 'sticker':
      result.brief = '[ 表情 ]'
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
    selected: '',
    sound: ''
  },
  mutations: {
    setUser (state, u) {
      state.user = u
    },
    setContact (state, p) {
      state.contact[p.name] = p.data
    },
    setSelected (state, s) {
      state.selected = s
      state.contact[s].unread = 0
    },
    setConcatStatus (state, c) {
      state.contact[c.name].detail = c.status
    },
    setConcatUnread (state, c) {
      state.contact[c.name].unread = c.unread
    },
    setSound (state, i) {
      state.sound = i
    },
    initChatRecord (state, c) {
      state.chatRecord[c.name] = c.data
    }
  },
  actions: {
    setChatRecord (context, c) {
      const dataType = typeDetection(c.data)
      if (c.replace) {
        if (dataType === 'array') {
          context.state.chatRecord[c.name] = c.data
        } else if (dataType === 'object') {
          context.state.chatRecord[c.name] = [c.data]
        }
      } else {
        if (!context.state.chatRecord[c.name]) {
          context.state.chatRecord[c.name] = []
        }
        if (dataType === 'array') {
          context.state.chatRecord[c.name] = context.state.chatRecord[c.name].concat(c.data)
        } else if (dataType === 'object') {
          context.state.chatRecord[c.name].push(c.data)
        }
      }
    },
  },
  getters: {
    getUser: state => state.user,
    getChatRecord: state => state.chatRecord,
    getContact: state => state.contact,
    getSelected: state => state.selected,
    getSound: state => state.sound
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
