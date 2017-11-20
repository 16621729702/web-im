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
      if (me.$refs.contactItem.classList.contains('selected')) {
        return
      }
      let uid = e.currentTarget.dataset.uid
      let cur = me.$store.getters.getContact[uid]
      if (!cur.detail) {
        me.$ajax({
          url: 'https://www.ziyadiaoyu.com/biz_im_message?token=' + me.curUser.token + '&to_username=' + uid + '&random=' + (new Date()).getTime(),
          type: 'get',
          success: function (data) {
            let json = JSON.parse(data).entities.reverse()
            me.$store.commit('setChatRecord', {
              target: 'replace',
              name: me.username,
              data: []
            })
            json.forEach((item) => {
              if (!item.from) { return }
              let payload = item.new_payload.bodies[0];
              let finalType = payload.type;
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
              };
              if (finalType === 'txt') {
                message.data = payload.msg
                if (item.new_payload.ext && item.new_payload.ext.isWebURL) {
                  finalType = 'url'
                  message.ext.webChatDetail = item.new_payload.ext.webChatDetail
                  message.ext.webChatHref = item.new_payload.ext.webChatHref
                  message.ext.webChatImage = item.new_payload.ext.webChatImage
                  message.ext.webChatTitle = item.new_payload.ext.webChatTitle
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
              message = me.$messageHandler(message, finalType, me.curUser)
              me.$store.commit('setChatRecord', {
                target: 'append',
                name: me.username,
                data: message.data
              })
            })
            me.$store.commit('setConcatStatus', { name: uid, status: true })
            me.$store.commit('setSelected', uid)
          },
          error: function () {
            me.$notify('网络错误，请稍候重试', 'error')
          }
        })
      }
    }
  }
}
</script>
<style lang='less' src="less_url/_contactItem.less"></style>
