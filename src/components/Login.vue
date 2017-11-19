<template>
  <div class='web-im-login'>
    <img src='https://s.ziyadiaoyu.com/rel.png' class='logo' />
    <div class='login'>
      <h2 class='tc'>登录</h2>
      <input class="boxsizing" type='text' placeholder='用户名' maxlength='50' :value="username" data-v="username"  @keyup="inputHandler" />
      <input class="boxsizing" type='password' placeholder='密码' maxlength='50' :value="pwd" data-v="pwd" @input="inputHandler" />
      <div class='button pointer' @click="ziyaLogin">{{ text }}</div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  name: 'login',
  data () {
    return {
      username: '',
      pwd: '',
      text: '登录',
      user: {}
    }
  },
  mounted () {
    let me = this
    const cookies = me.$cookie.analysisCookie()
    if (cookies.username && cookies.nick && cookies.avatar && cookies.token && cookies.pd) {
      me.$cookie.setCookie('username', cookies.username, 2)
      me.$cookie.setCookie('nick', cookies.nick, 2)
      me.$cookie.setCookie('avatar', cookies.avatar, 2)
      me.$cookie.setCookie('token', cookies.token, 2)
      me.$cookie.setCookie('pd', cookies.pd, 2)
      me.setCurUser(cookies.username, cookies.nick, cookies.avatar, cookies.token, cookies.pd)
      me.webImLogin()
    }
  },
  methods: {
    inputHandler: function (e) {
      var target = e.target
      this[target.dataset.v] = target.value
    },
    ziyaLogin: function () {
      let me = this
      if (me.text === '登录' && me.username && me.pwd) {
        me.text = '登录中...'
        me.$ajax({
          url: '/login',
          type: 'post',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: JSON.stringify({ username: me.username, password: md5(me.pwd) }),
          success: (data) => {
            let json = JSON.parse(data)
            let user = json.entities[0]
            me.$cookie.setCookie('username', user.username, 2)
            me.$cookie.setCookie('nick', user.nick, 2)
            me.$cookie.setCookie('avatar', user.avatar_url, 2)
            me.$cookie.setCookie('token', json.access_token, 2)
            me.$cookie.setCookie('pd', user.pd, 2)
            me.setCurUser(user.username, user.nick, user.avatar_url, json.access_token, user.pd)
            me.webImLogin()
          },
          error: (err) => {
            let text = '网络繁忙，请稍候再试'
            if (err.status === 400) {
              text = '用户名或密码错误，请重新输入'
            }
            me.$notify(text, 'error')
            window.setTimeout(() => { me.text = '登录' }, 100)
          }
        })
      }
    },
    setCurUser (u, n ,a ,t, p) {
      let me = this
      me.user = {
        username: u,
        nick: n,
        avatar: a,
        token: t,
        pd: p
      }
    },
    webImLogin () {
      let me = this
      if (!me.user.username || !me.user.pd) {
        me.$notify(me.$lang.notEmpty, 'error')
        return
      }
      let options = {
        apiUrl: window.WebIM.config.apiURL,
        user: me.user.username.toLowerCase(),
        pwd: me.user.pd,
        // accessToken: auth,
        appKey: window.WebIM.config.appkey,
        success: function (token) {
          me.$cookie.setCookie('webim_' + window.btoa(me.user.username).replace(/=*$/g, ''), token.access_token, 2)
          me.$router.replace('/window/chat')
          me.$store.commit('setUser', me.user);
        },
        error: function () {
          me.$router.replace(window.location.href)
        }
      }
      me.$webIM.open(options)
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' src="less_url/_login.less" scoped></style>

