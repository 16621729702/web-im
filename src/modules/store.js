import Vue from 'vue'
import Vuex from 'vuex'
import typeDetection from 'module_path/typeDetection'

Vue.use(Vuex)

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
      Vue.set(state, 'user', u)
    },
    setContact (state, p) {
      let obj = {}
      obj[p.name] = p.data
      Vue.set(state.contact, p.name, p.data)
    },
    setSelected (state, s) {
      state.selected = s
      state.contact[s].unread = 0
    },
    setConcatStatus (state, c) {
      state.contact[c.name].detail = c.status
    },
    setConcatUnread (state, c) {
      if (c.append) {
        state.contact[c.name].unread += c.unread
      } else {
        state.contact[c.name].unread = c.unread
      }
    },
    setConcatBrief (state, c) {
      state.contact[c.name].brief = c.brief
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
          Vue.set(context.state.chatRecord, c.name, c.data)
        } else if (dataType === 'object') {
          Vue.set(context.state.chatRecord, c.name, [c.data])
        }
      } else {
        if (!context.state.chatRecord[c.name]) {
          Vue.set(context.state.chatRecord, c.name, [])
        }
        if (dataType === 'array') {
          context.state.chatRecord[c.name] = ([]).concat(context.state.chatRecord[c.name], c.data)
        } else if (dataType === 'object') {
          context.state.chatRecord[c.name] = ([]).concat(context.state.chatRecord[c.name], [c.data])
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
export default store
