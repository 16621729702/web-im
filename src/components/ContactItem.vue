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
      me.$store.commit('setSelected', uid)
      let cur = me.$store.getters.getContact[uid]
      if (!cur.detail) {
        me.$store.commit('setConcatStatus', { name: uid, status: true })
        me.$ajax({
          url: 'https://www.ziyadiaoyu.com/biz_im_message?token=' + me.curUser.token + '&to_username=' + uid + '&random=' + (new Date()).getTime(),
          type: 'get',
          success: function (data) {
            let json = JSON.parse(data).entities.reverse()
            console.log(json)
          },
          error: function () {
            me.$notify('网络错误，请稍候重试', 'error')
            me.$store.commit('setConcatStatus', { name: uid, status: false })
            me.$store.commit('setSelected', '')
          }
        })

        // xhr.open('get', 'https://www.ziyadiaoyu.com/biz_im_message?token=' + Demo.ziyaUser.token + '&to_username=' + id + '&random=' + (new Date()).getTime(), true);
        // xhr.send(null);
        // xhr.onreadystatechange = function() {
        //     if (xhr.status === 200 && xhr.readyState === 4) {
        //       Demo.chatRecord[id].messages = [];
        //       JSON.parse(xhr.responseText).entities.reverse().forEach(function(item) {
        //         var payload = item.new_payload.bodies[0];
        //         var finalType = payload.type;
        //         var message = {
        //           error: false,
        //           ext: {
        //             nickname: man.nick,
        //             attr2: "v2",
        //             avatar: man.avatar,
        //             attr1: "v1"
        //           },
        //           from: item.from,
        //           id: item._id,
        //           to: item.to,
        //           type: 'chat',
        //           created: item.created
        //         };
        //         if (payload.type === 'txt') {
        //           message.data = payload.msg;
        //           if (item.new_payload.ext && item.new_payload.ext.isWebURL) {
        //             message.ext.isWebURL = item.new_payload.ext.isWebURL;
        //             message.ext.webChatDetail = item.new_payload.ext.webChatDetail;
        //             message.ext.webChatHref = item.new_payload.ext.webChatHref;
        //             message.ext.webChatImage = item.new_payload.ext.webChatImage;
        //             message.ext.webChatTitle = item.new_payload.ext.webChatTitle;
        //           }
        //         } else if (payload.type === 'img') {
        //           message.accessToken = Demo.token;
        //           message.secret = payload.secret;
        //           message.filename = payload.filename;
        //           message.url = payload.url;
        //           message.file_length = payload.file_length;
        //           if (payload.size) {
        //             message.thumb = payload.size.thumb;
        //           }
        //           if (payload.isLocation) {
        //             message.ext.isLocation = true;
        //             message.ext.locationAddress = payload.locationAddress;
        //             message.ext.locationLatitude = payload.locationLatitudes;;
        //             message.ext.locationLongitude = payload.locationLongitude;
        //             message.ext.locationName = payload.locationName;
        //           }
        //         } else if (payload.type === 'audio') {
        //           message.secret = payload.secret;
        //           message.filename = payload.filename;
        //           message.url = payload.url;
        //           message.file_length = payload.file_length;
        //           finalType = 'aud';
        //         } else {
        //           return;
        //         }
        //         Demo.api.addToChatRecord(message, finalType, item.status);
        //       });
        //       resolve(id);
        //     } else if (xhr.status === 400) {
        //       man.detail = false;
        //       Demo.api.NotifyError('网络错误，请稍候重试');
        //       reject(id);
        //     }
        // }
      }
    }
  }
}
</script>
<style lang='less' src="less_url/_contactItem.less"></style>
