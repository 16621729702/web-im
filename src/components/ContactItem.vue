<template>
  <div :class="['boxsizing', 'web-im-contactItem', 'pointer', selected]" :data-uid="username" @click="choose" ref="contactItem">
    <Avatar :src="user.avatar"></Avatar>
    <p class="web-im-nick">{{ user.nick }}</p>
    <p class="web-im-brief">{{ user.brief }}</p>
    <div class="web-im-notice tc" v-show="user.unread">{{ user.unread }}</div>
  </div>
</template>
<script>
import Avatar from '@/components/Avatar'
import receipt from 'module_path/receipt'

export default {
  name: 'contactuser',
  components: {
    Avatar: Avatar
  },
  props: {
    user: {},
    username: ''
  },
  data () {
    return {
      selected: ''
    }
  },
  computed: {
    choosen () { return this.$store.getters.getSelected },
    curUser () { return this.$store.getters.getUser }
  },
  watch: {
    choosen: function (n) {
      let me = this
      me.selected = me.username === n ? 'selected' : ''
    }
  },
  methods: {
    choose (e) {
      let me = this
      if (!me.requesting && me.$refs.contactItem.classList.contains('selected')) {
        return
      }
      me.$store.commit('setLoadingMessage', true)
      me.requesting = true
      me.$sound('')
      let uid = e.currentTarget.dataset.uid
      let cur = me.$store.getters.getContact[uid]
      if (!cur.detail) {
        me.$ajax({
          url: 'https://www.ziyadiaoyu.com/biz_im_message?token=' + me.curUser.token + '&to_username=' + uid + '&random=' + (new Date()).getTime(),
          type: 'get',
          success: function (data) {
            let json = JSON.parse(data).entities.reverse()
            me.$store.dispatch('setChatRecord', {
              target: 'replace',
              name: me.username,
              data: []
            })
            let dataArray = []
            json.forEach((item) => {
              if (!item.from) { return }
              let payload = item.new_payload.bodies[0]
              let finalType = payload.type
              let message = {
                error: false,
                ext: {
                  nickname: cur.nick,
                  avatar: cur.avatar
                },
                from: item.from,
                id: item._id,
                to: item.to,
                type: 'chat',
                created: item.created,
                status: item.status
              }
              if (finalType === 'txt') {
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
              } else if (finalType === 'img') {
                message.accessToken = me.curUser.token
                message.secret = payload.secret
                message.filename = payload.filename
                message.url = payload.url
                message.file_length = payload.file_length
                message.height = payload.size.height
                message.width = payload.size.width
                if (payload.isLocation) {
                  finalType = 'loc'
                  message.ext.locationAddress = payload.locationAddress
                  message.ext.locationLatitude = payload.locationLatitude
                  message.ext.locationLongitude = payload.locationLongitude
                  message.ext.locationName = payload.locationName
                }
              } else if (finalType === 'audio') {
                message.secret = payload.secret
                message.filename = payload.filename
                message.url = payload.url
              } else {
                return
              }
              message = me.$tranformHistoryMessage(message, finalType, me.curUser)
              dataArray.push(message.data)
            })
            me.$store.dispatch('setChatRecord', {
              replace: true,
              name: me.username,
              data: dataArray,
              created: json[json.length - 1].created
            })
            me.successhandler(uid)
          },
          error: function () {
            me.$notify('??????????????????????????????', 'error')
          }
        })
      } else {
        me.successhandler(uid)
      }
    },
    successhandler: function (uid) {
      let me = this
      me.$store.commit('setConcatStatus', { name: uid, status: true })
      me.$store.commit('setSelected', uid)
      me.$store.commit('setLoadingMessage', false)
      receipt(me.curUser.username, uid)
    }
  }
}
</script>
<style lang='less' src="less_url/_contactItem.less"></style>
