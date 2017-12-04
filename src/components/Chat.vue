<template>
  <div class="web-im-chatWindow">
    <div class="web-im-contactWindow">
      <Loading v-show="loading"></Loading>
      <ContactItem v-for="item in contactArray" :user="contact[item.u]" :key="item.u" :username="item.u"></ContactItem>
    </div>
    <div class="web-im-messageWindow" v-show="selected">
      <div class="web-im-messageTitle tc" v-if="contact && selected">{{ contact[selected].nick }}</div>
      <div class="web-im-messages clr">
        <Loading v-show="loadingMessage"></Loading>
        <Messages v-show="!loadingMessage" v-if="selectedRecord" v-for="(item, index) in selectedRecord" :item="item" :key="index"></Messages>
      </div>
    </div>
    <div class="web-im-inputWindow" v-show="selected">
      <div class="web-im-selectors">
        <span class="inlineblock icon icon-tupian pointer" title="图片" @click="selectImages"></span>
        <span class="inlineblock icon icon-biaoqing pointer" title="表情" @click="showEmojis"></span>
        <input type="file" style="display: none;" multiple accept="image/jpg, image/png, image/gif, image/jpeg, image/jpg, image/raw" ref="file" @change="sendImageMessage">
        <div class="web-im-emojiMap clr" @click="selectEmoji" v-show="showEmoji">
          <img class="fl pointer" v-for="(value, key) in emoji" :data-emoji="key" :title="key.replace(reg, '')" :src="emojiUrl.replace('{name}', value)" />
        </div>
      </div>
      <textarea class="boxsizing web-im-textarea" v-model="messageText" placeholder="文字消息..." @keydown="downHandler" @keyup="upHandler"></textarea>
      <div class="boxsizing fr web-im-operationModel pointer" @click="showModels"></div>
      <div class="fr web-im-send tc pointer" @click="sendTextMessage">发送</div>
      <div class="boxsizing fr web-im-operationModels pointer" v-show="showModel" @click="selectModel">
        <div data-model="1" :class="[operationModel === '1' ? 'selected' : '']">enter发送消息，ctrl + enter换行</div>
        <div data-model="2" :class="[operationModel === '2' ? 'selected' : '']">ctrl + enter发送消息，enter换行</div>
      </div>
    </div>
  </div>
</template>

<script>
  import ContactItem from '@/components/ContactItem'
  import Loading from '@/components/Loading'
  import Messages from '@/components/Messages'
  import emoji from 'module_path/emoji'
  import upload from 'module_path/uploadToQiniu'

  export default {
    name: 'Chat',
    components: {
      ContactItem: ContactItem,
      Messages: Messages,
      Loading: Loading
    },
    data () {
      return {
        reg: /[^\u4e00-\u9fa5]/g,
        messageText: '',
        keyDown: false,
        operationModel: '1',
        showModel: false,
        showEmoji: false,
        emoji: emoji,
        emojiUrl: 'https://s.ziyadiaoyu.com/{name}.png',
        loading: true,
        sendingText: false
      }
    },
    computed: {
      loadingMessage () {
        return this.$store.getters.getLoadingMessage
      },
      selected () {
        return this.$store.getters.getSelected
      },
      contact () {
        return this.$store.getters.getContact
      },
      contactArray () {
        return this.$store.getters.getContactArray
      },
      chatRecord () {
        return this.$store.getters.getChatRecord
      },
      user () {
       return this.$store.getters.getUser
      },
      selectedRecord () {
        let me = this
        return me.chatRecord[me.selected]
      }
    },
    watch: {
      selectedRecord (n) {
        let me = this
        me.$nextTick(() => {
          let all = document.querySelectorAll('.web-im-message')
          const len = all.length
          if (len > 1) {
            all[len - 1].scrollIntoView(false)
            all = null
          }
        })
      }
    },
    created () {
      let me = this
      document.addEventListener('click', function () {
        me.showModel = false
        me.showEmoji = false
      }, false)
      me.$ajax({
        url: 'https://www.ziyadiaoyu.com/biz_im_list?token=' + me.$cookie.analysisCookie().token + '&random=' + (new Date()).getTime(),
        type: 'get',
        success: function (data) {
          let json = JSON.parse(data).entities.messages
          if (me.user.username) {
            json.forEach((item) => {
              if (item.from_user) {
                const payload = item.new_payload.bodies[0]
                const from_user = (item.from_user.username !== me.user.username ? item.from_user : item.to_user)
                const to_user = (item.from_user.username === me.user.username ? item.from_user : item.to_user)
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
                  message.accessToken = me.user.token
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
                message = me.$tranformHistoryMessage(message, finalType, me.user)
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
                    data: [message.data],
                    created: message.created
                  })
                }
              }
            })
          }
          me.loading = false
        },
        error: function () {
          me.$notify('网络错误，请稍后再试', 'error')
        }
      })
    },
    methods: {
      sendImageMessage () {
        let me = this
        let files = me.$refs.file.files
        const length = files.length
        let i = 0
        for (; i < length; i++) {
          me.uploadSingleImage(files[i])
        }
      },
      uploadSingleImage (fileObject) {
        let me = this
        let file = {
          data: fileObject,
          filename: fileObject.name,
          filetype: fileObject.type.split('/')[1],
          url: window.URL.createObjectURL(fileObject)
        }
        const id = me.$webIM.getUniqueId()
        let msg = new WebIM.message('img', id)
        let reader = new FileReader()
        reader.onload = (e) => {
          let img = document.createElement('img')
          img.src = e.target.result
          img.onload = () => {
            let option = {
              apiUrl: WebIM.config.apiURL,
              file: file,
              to: me.selected,
              width: img.width,
              height: img.height,
              roomType: false,
              chatType: 'singleChat',
              onFileUploadError: function () {
                me.$notify('图片上传失败', 'error')
              },
              success: function () {
                const now = new Date()
                let message = {
                  accessToken: me.user.token,
                  created: now.getTime(),
                  error: false,
                  secret: me.user.secret,
                  filename: file.filename,
                  url: img.src,
                  height: option.height,
                  width: option.width,
                  data: me.messageText,
                  id: id,
                  sentByMe: true,
                  status: '',
                  type: "chat",
                  from: me.user.username,
                  to: me.selected,
                  ext: {
                    avatar: me.user.avatar,
                    nickname:  me.user.nick
                  }
                }
                console.log()
                message = me.$tranformHistoryMessage(message, 'img', me.user)
                me.$store.dispatch('setChatRecord', {
                  name: me.selected,
                  data: [message.data],
                  created: now.getTime()
                })
                me.$refs.file.value = ''
              },
              flashUpload: WebIM.flashUpload
            }
            msg.set(option);
            me.$webIM.send(msg.body)
          }
        }
        reader.readAsDataURL(file.data)
      },
      sendTextMessage () {
        let me = this
        if (me.messageText && !me.sendingText) {
          me.sendingText = true
          const id = me.$webIM.getUniqueId()
          let msg = new WebIM.message('txt', id)
          msg.set({
              msg: me.messageText,
              to: me.selected,
              roomType: false,
              success: function (id, serverMsgId) {
                const now = new Date()
                let message = {
                  error: false,
                  data: me.messageText,  
                  id: id,
                  created: now.getTime(),
                  sentByMe: true,
                  status: '',
                  type: "chat",
                  from: me.user.username,
                  to: me.selected,
                  ext: {
                    avatar: me.user.avatar,
                    nickname:  me.user.nick
                  }
                }
                message = me.$tranformHistoryMessage(message, 'txt', me.user)
                me.$store.dispatch('setChatRecord', {
                  name: me.selected,
                  data: [message.data],
                  created: now.getTime()
                })
                me.messageText = ''
                me.sendingText = false
              },
              fail: function (e) {
                me.$notify('消息发送失败', 'error')
                me.sendingText = false
              }
          });
          msg.body.chatType = 'singleChat';
          me.$webIM.send(msg.body);
        }
      },
      upHandler (e) {
        let me = this
        if (e.keyCode === 17) {
          me.keyDown = false
        }
      },
      downHandler (e) {
        const code = e.keyCode
        let me = this
        if (code === 17) {
          me.keyDown = true
        } else if (code === 13) {
          e.preventDefault()
          if (me.operationModel === '1') {
            if (me.keyDown) {
              me.messageText += '\n'
            } else {
              me.sendTextMessage()
            }
          } else {
            if (me.keyDown) {
              me.sendTextMessage()
            } else {
              me.messageText += '\n'
            }
          }
        }
      },
      selectImages () {
        this.$refs.file.click()
      },
      showEmojis (e) {
        e.stopPropagation()
        this.showEmoji = true
        this.showModel = false
      },
      selectEmoji (e) {
        let me = this
        let dataset = e.target.dataset
        if (dataset.emoji) {
          me.messageText += dataset.emoji
        }
      },
      showModels (e) {
        e.stopPropagation()
        this.showModel = true
        this.showEmoji = false
      },
      selectModel (e) {
        let me = this
        let dataset = e.target.dataset
        if (dataset.model) {
          me.operationModel = dataset.model
        }
      }
    }
  }
</script>

<style lang='less' src="less_url/_chat.less" scoped></style>
