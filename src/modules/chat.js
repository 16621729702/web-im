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
    console.log(message)
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
        var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response)
        node.src = objectURL
      },
      onFileDownloadError: function () {
        console.log('File down load error.')
      }
    }
    WebIM.utils.download.call(conn, option)
  },
  onPresence: function (message) {},
  onRoster: function (message) {},
  onInviteMessage: function (message) {},
  onOnline: function () {
    console.log('online')
  },
  onOffline: function () {
    window.location.replace('/')
  },
  onError: function (message) {
    console.log(message, 'error')
  },
  onReceivedMessage: function (message) {}, //收到消息送达服务器回执
  onDeliveredMessage: function (message) {}, //收到消息送达客户端回执
  onReadMessage: function (message) {}, //收到消息已读回执
  onCreateGroup: function (message) {},
  onMutedMessage: function (message) {}
})

export default conn
