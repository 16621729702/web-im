<template>
  <div class="web-im-chatWindow">
    <div class="web-im-contactWindow">
      <ContactItem v-for="(value, key) in contact" :user="value" :key="key" :username="key"></ContactItem>
    </div>
    <div class="web-im-messageWindow" v-show="selected">
      <div class="web-im-messageTitle tc" v-if="contact && selected">{{ contact[selected].nick }}</div>
      <div class="web-im-messages clr">
        <Messages v-if="selectedRecord" v-for="(item, index) in selectedRecord" :item="item" :key="index"></Messages>
      </div>
    </div>
    <div class="web-im-inputWindow" v-show="selected">
      <div class="web-im-selectors">
        <span class="inlineblock icon icon-tupian pointer"></span>
      </div>
      <textarea class="boxsizing web-im-textarea" v-model="messageText" placeholder="文字消息..." @keydown="downHandler" @keyup="upHandler"></textarea>
      <div class="fr web-im-send tc pointer" @click="sendMessage">发送</div>
    </div>
  </div>
</template>

<script>
  import ContactItem from '@/components/ContactItem'
  import Messages from '@/components/Messages'

  export default {
    name: 'Chat',
    components: {
      ContactItem: ContactItem,
      Messages: Messages
    },
    data () {
      return {
        messageText: '',
        keyDown: false
      }
    },
    computed: {
      selected () {
        return this.$store.getters.getSelected
      },
      contact () {
        return this.$store.getters.getContact
      },
      chatRecord () {
        return this.$store.getters.getChatRecord
      },
      selectedRecord () {
        let me = this
        return me.chatRecord[me.selected]
      }
    },
    watch: {
      selectedRecord () {
        let me = this
        me.$forceUpdate()
        me.$nextTick(() => {
          let all = document.querySelectorAll('.web-im-message')
          setTimeout(() => {
            all[all.length - 1].scrollIntoView(true)
            all = null
            // me.contactChaning = false
          }, 50)
        })
      }
    },
    created () {
      let me = this
      me.$ajax({
        url: 'https://www.ziyadiaoyu.com/biz_im_list?token=' + me.$cookie.analysisCookie().token + '&random=' + (new Date()).getTime(),
        type: 'get',
        success: function (data) {
          let json = JSON.parse(data).entities.messages
          let user = me.$store.getters.getUser
          if (user.username) {
            json.forEach((item) => {
              if (item.from_user) {
                const payload = item.new_payload.bodies[0]
                const from_user = (item.from_user.username !== user.username ? item.from_user : item.to_user)
                const to_user = (item.from_user.username === user.username ? item.from_user : item.to_user)
                let finalType = payload.type
                let message = {
                  error: false,
                  ext: {
                    nickname: from_user.nick,
                    avatar: from_user.avatar_url
                  },
                  from: from_user.username,
                  id: item._id,
                  to: to_user.username,
                  type: 'chat',
                  created: item.created,
                  status: item.status
                }
                if (payload.type === 'txt') {
                  message.data = payload.msg
                  if (item.new_payload.ext) {
                    if (item.new_payload.ext.isWebURL) {
                      finalType = 'url'
                      message.ext.webChatDetail = item.new_payload.ext.webChatDetail
                      message.ext.webChatHref = item.new_payload.ext.webChatHref
                      message.ext.webChatImage = item.new_payload.ext.webChatImage
                      message.ext.webChatTitle = item.new_payload.ext.webChatTitle
                    } else if (item.new_payload.ext.isSticker) {
                      finalType = 'sticker'
                      message.data = item.new_payload.ext.stickerName
                    }
                  }
                } else if (payload.type === 'img') {
                  message.accessToken = user.token
                  message.secret = payload.secret
                  message.filename = payload.filename
                  message.url = payload.url
                  message.height = payload.size.height
                  message.width = payload.size.width
                  if (payload.isLocation) {
                    finalType = 'loc'
                    message.ext.locationAddress = payload.locationAddress
                    message.ext.locationLatitude = payload.locationLatitude
                    message.ext.locationLongitude = payload.locationLongitude
                    message.ext.locationName = payload.locationName
                  }
                } else if (payload.type === 'audio') {
                  message.secret = payload.secret
                  message.filename = payload.filename
                  message.url = payload.url
                } else {
                  return
                }
                message = me.$tranformHistoryMessage(message, finalType, user)
                if (!me.contact[from_user.username]) {
                  me.$store.commit('setContact', {
                    name: from_user.username,
                    data: {
                      detail: false,
                      avatar: from_user.avatar_url,
                      nick: from_user.nick,
                      unread: message.data.status === 'unread' ? 1 : 0,
                      brief: message.brief
                    }
                  })
                  me.$store.dispatch('setChatRecord', {
                    replace: true,
                    name: from_user.username,
                    data: [message.data]
                  })
                }
              }
            })
            me.$forceUpdate()
          }
        },
        error: function () {
          me.$notify('网络错误，请稍后再试', 'error')
        }
      })
    },
    methods: {
      sendMessage () {
        let me = this
        if (me.messageText) {
          me.messageText = ''
        }
        console.log(1);
      },
      upHandler (e) {
        let me = this
        if (e.keyCode === 17) {
          me.keyDown = false
        }
      },
      downHandler (e) {
        e.preventDefault()
        const code = e.keyCode
        let me = this
        if (code === 17) {
          me.keyDown = true
        } else if (code === 13) {
          if (me.keyDown) {
            me.messageText += '\n'
          } else {
            me.sendMessage()
          }
        }
      },
    }
  }
</script>

<style lang='less' src="less_url/_chat.less" scoped></style>
