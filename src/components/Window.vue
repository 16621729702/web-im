<template>
  <div class="web-im-window">
   <div class="boxsizing web-im-menu" v-if="user.avatar">
     <Avatar :src="user.avatar" :title="user.nick"></Avatar>
     <div class="web-im-menuList tc">
       <div :class="['icon', 'icon-liaotianyoudian', 'pointer', selectedMenu === 'chat' ? 'selected' : '']" title="聊天" data-menu="chat" @click="selectMenu"></div>
       <!-- <div :class="['icon', 'icon-dingdan', 'pointer', selectedMenu === 'order' ? 'selected' : '']" title="我的订单" data-menu="order" @click="selectMenu"></div> -->
     </div>
     <div class="icon icon-dianyuan web-im-logout pointer" title="退出" @click="logout"></div>
   </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import Avatar from '@/components/Avatar'
  export default {
    components: {
      Avatar: Avatar
    },
    data () {
      return {
        user: {},
        selectedMenu: 'chat',
        routers: {
          chat: '/window/chat',
          order: '/window/menu'
        }
      }
    },
    created () {
      let me = this
      let user = me.$store.getters.getUser
      if (user.username && user.nick && user.avatar && user.token && user.pd) {
        me.user = {
          avatar: decodeURIComponent(user.avatar),
          nick: decodeURIComponent(user.nick),
          token: decodeURIComponent(user.token),
          pd: decodeURIComponent(user.pd),
          username: decodeURIComponent(user.username)
        }
      } else {
        me.$router.replace('/login')
      }
    },
    methods: {
      selectMenu (e) {
        let me = this
        let menu = e.currentTarget.dataset.menu
        me.selectedMenu = menu
        me.$router.replace(me.routers[menu])
      },
      logout () {
        let me = this
        me.user = {}
        me.$cookie.setCookie('username', '', -1)
        me.$cookie.setCookie('nick', '', -1)
        me.$cookie.setCookie('avatar', '', -1)
        me.$cookie.setCookie('token', '', -1)
        me.$cookie.setCookie('pd', '', -1)
        me.$store.commit('setUser', {})
        me.$notify('已退出', 'success')
        me.$router.replace('/login')
        me.$webIM.close()
      }
    }
  }
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' src="less_url/_window.less" scoped></style>

