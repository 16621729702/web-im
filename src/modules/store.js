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
    sound: '',
    contactArray: [],
    loadingMessage: true
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
    setLoadingMessage (state, b) {
      state.loadingMessage = b
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
    },
    reset (state) {
      Vue.set(state, 'chatRecord', {})
      Vue.set(state, 'contact', {})
      Vue.set(state, 'user', {})
      Vue.set(state, 'selected', '')
      Vue.set(state, 'sound', '')
      Vue.set(state, 'contactArray', [])
      Vue.set(state, 'loadingMessage', true)
    }
  },
  actions: {
    setChatRecord (context, c) {
      const dataType = typeDetection(c.data)
      if (!context.state.chatRecord[c.name]) {
        context.state.contactArray.push({ u: c.name, created: c.created })
      } else {
        let i = 0
        let length = context.state.contactArray.length
        for (; i < length; i++) {
          if (context.state.contactArray[i].u === c.name) {
            context.state.contactArray[i].created = c.created
            break
          }
        }
      }
      context.state.contactArray.sort((a, b) => a.created > b.created ? -1 : 1)
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
    }
  },
  getters: {
    getUser: state => state.user,
    getChatRecord: state => state.chatRecord,
    getContact: state => state.contact,
    getSelected: state => state.selected,
    getSound: state => state.sound,
    getContactArray: state => state.contactArray,
    getLoadingMessage: state => state.loadingMessage
  }
})
export default store
