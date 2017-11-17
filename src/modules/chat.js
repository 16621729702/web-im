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
    console.log('opened')//连接成功回调
    // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
    // 手动上线指的是调用conn.setPresence() 如果conn初始化时已将isAutoLogin设置为true
    // 则无需调用conn.setPresence()             
  },
  onClosed: function (message) {
    console.log(message)
  },
  onTextMessage: function (message) {
    console.log(message)
  }, //收到文本消息
  onEmojiMessage: function (message) {
    console.log(message)
  }, //收到表情消息
  onPictureMessage: function (message) {
    console.log(message)
  }, //收到图片消息
  onCmdMessage: function (message) {
    console.log(message)
  }, //收到命令消息
  onAudioMessage: function (message) {
    console.log(message)
  }, //收到音频消息
  onLocationMessage: function (message) {
    console.log(message)
  }, //收到位置消息
  onFileMessage: function (message) {
    console.log(message)
  }, //收到文件消息
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
  }, //收到视频消息
  onPresence: function (message) {}, //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
  onRoster: function (message) {}, //处理好友申请
  onInviteMessage: function (message) {}, //处理群组邀请
  onOnline: function () {
    console.log('online');
  }, //本机网络连接成功
  onOffline: function () {
    window.location.replace('/')
  }, //本机网络掉线
  onError: function (message) {
    console.log(message, 'error');
  }, //失败回调
  onReceivedMessage: function (message) {}, //收到消息送达服务器回执
  onDeliveredMessage: function (message) {}, //收到消息送达客户端回执
  onReadMessage: function (message) {}, //收到消息已读回执
  onCreateGroup: function (message) {}, //创建群组成功回执（需调用createGroupNew）
  onMutedMessage: function (message) {} //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
})

export default conn
