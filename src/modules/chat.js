let conn = new window.WebIM.connection({
  isMultiLoginSessions: window.WebIM.config.isMultiLoginSessions,
  https: typeof window.WebIM.config.https === 'boolean' ? window.WebIM.config.https : location.protocol === 'https:',
  url: window.WebIM.config.xmppURL,
  heartBeatWait: window.WebIM.config.heartBeatWait,
  autoReconnectNumMax: window.WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: window.WebIM.config.autoReconnectInterval,
  apiUrl: window.WebIM.config.apiURL,
  isAutoLogin: true
})

conn.listen({
  onOpened: function (message) {
    console.log('opened')
  },
  onClosed: function (message) {
    console.log('close')
  },
  onTextMessage: function (message) {
    window.app.$soundNotify()
    window.app.$tranformReceivedMessage(message, 'txt', true)
  },
  onEmojiMessage: function (message) {},
  onPictureMessage: function (message) {
    window.app.$soundNotify()
    window.app.$tranformReceivedMessage(message, 'img', true)
  },
  onCmdMessage: function (message) {},
  onAudioMessage: function (message) {
    window.app.$soundNotify()
    window.app.$tranformReceivedMessage(message, 'audio', true)
  },
  onLocationMessage: function (message) {
    window.app.$soundNotify()
    window.app.$tranformReceivedMessage(message, 'loc', true)
  },
  onFileMessage: function (message) {},
  onVideoMessage: function (message) {
    var node = document.getElementById('privateVideo')
    var option = {
      url: message.url,
      headers: {
        'Accept': 'audio/mp4'
      },
      onFileDownloadComplete: function (response) {
        var objectURL = window.WebIM.utils.parseDownloadResponse.call(conn, response)
        node.src = objectURL
      },
      onFileDownloadError: function () {
        console.log('File down load error.')
      }
    }
    window.WebIM.utils.download.call(conn, option)
  },
  onPresence: function (message) {},
  onRoster: function (message) {},
  onInviteMessage: function (message) {},
  onOnline: function () {
    console.log('online')
  },
  onOffline: function () {
    if (window.app.$cookie.analysisCookie().token) {
      window.app.$cookie.setCookie('username', '', -1)
      window.app.$cookie.setCookie('nick', '', -1)
      window.app.$cookie.setCookie('avatar', '', -1)
      window.app.$cookie.setCookie('token', '', -1)
      window.app.$cookie.setCookie('pd', '', -1)
      window.app.$store.commit('reset')
      window.app.$notify('?????????', 'error')
      window.app.$router.replace('/login')
      window.app.$webIM.close()
    }
  },
  onError: function (message) {
    var token = window.app.$cookie.analysisCookie().token
    if (message.type === 8) {
      window.app.$notify('???????????????????????????????????????', 'error')
    } else if (message.type === 7) {
      if (token) {
        window.app.$notify('????????????????????????', 'error')
      }
    } else if (message.type === 16) {
      window.app.$notify('???????????????????????????', 'error')
    } else if (message.type === 34) {
      window.app.$notify('??????????????????????????????????????????', 'error')
    }
    if (token) {
      window.app.$cookie.setCookie('username', '', -1)
      window.app.$cookie.setCookie('nick', '', -1)
      window.app.$cookie.setCookie('avatar', '', -1)
      window.app.$cookie.setCookie('token', '', -1)
      window.app.$cookie.setCookie('pd', '', -1)
      window.app.$store.commit('reset')
      window.app.$router.replace('/login')
      window.app.$webIM.close()
    }
  },
  onReceivedMessage: function (message) {},
  onDeliveredMessage: function (message) {},
  onReadMessage: function (message) {},
  onCreateGroup: function (message) {},
  onMutedMessage: function (message) {}
})

export default conn
