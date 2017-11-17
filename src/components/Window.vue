<template>
  <div class="web-im-window">
   <div class="boxsizing web-im-menu" v-if="user.avatar">
     <Avatar :src="user.avatar" :title="user.nick"></Avatar>
     <div class="web-im-menuList"></div>
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
        user: {}
      }
    },
    created () {
      let me = this
      const cookies = me.$cookie.analysisCookie()
      if (cookies.username && cookies.nick && cookies.avatar && cookies.token && cookies.pd) {
        me.user = {
          avatar: decodeURIComponent(cookies.avatar),
          nick: decodeURIComponent(cookies.nick),
          token: decodeURIComponent(cookies.token),
          pd: decodeURIComponent(cookies.pd),
          username: decodeURIComponent(cookies.username)
        }
      } else {
        me.$router.replace('/login')
      }
    },
    methods: {
      logout () {
        let me = this
        me.user = {}
        me.$cookie.setCookie('username', '', -1)
        me.$cookie.setCookie('nick', '', -1)
        me.$cookie.setCookie('avatar', '', -1)
        me.$cookie.setCookie('token', '', -1)
        me.$cookie.setCookie('pd', '', -1)
        me.$webIM.close()
        me.$notify('已退出', 'success')
        me.$router.replace('/login')
      }
    }
  }
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' src="less_url/_window.less" scoped></style>

