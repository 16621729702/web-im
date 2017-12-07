import notify from 'module_path/notification'
import uuid from 'uuid'

let curUser = null
function f (message, type, notification) {
  let me = this
  let finalType = type
  if (!curUser) {
    curUser = me.$store.getters.getUser
  }
  let name = message.from
  let result = {
    created: new Date().getTime()
  }
  let notifyBody = {
    title: message.ext.nickname
  }
  if (message.from === curUser.username) {
    result.sentByMe = true
    name = message.to
  } else {
    result.sentByMe = false
  }
  if (type === 'txt') {
    if (message.ext) {
      if (message.ext.isWebURL) {
        finalType = 'url'
      } else if (message.ext.isSticker) {
        finalType = 'sticker'
      }
    }
  } else if (type === 'img' && message.ext.isLocation) {
    finalType = 'loc'
  }
  result.data = {
    sentByMe: result.sentByMe,
    type: finalType,
    status: message.status,
    _id: uuid.v4()
  }
  result.data.userInfo = {
    avatar: (result.sentByMe ? result.avatar : message.ext.avatar),
    nickname: (result.sentByMe ? result.nick : message.ext.nickname)
  }
  result.data.format = (message.created ? new Date(message.created) : new Date()).toLocaleString()
  switch (finalType) {
    case 'txt':
      result.brief = message.data
      result.data.data = message.data
      break
    case 'sticker':
      result.brief = '[ 表情 ]'
      result.data.data = message.ext.stickerName
      break
    case 'loc':
      result.brief = '[ 定位信息 ]'
      result.data.width = message.width
      result.data.height = message.height
      result.data.url = message.url
      result.data.secret = message.secret
      result.data.filename = message.filename
      result.data.accessToken = message.accessToken
      result.data.location = {
        address: message.ext.locationAddress,
        lat: message.ext.locationLatitude,
        lng: message.ext.locationLongitude,
        name: message.ext.locationName
      }
      break
    case 'audio':
      result.brief = '[ 音频 ]'
      result.data.secret = message.secret
      result.data.url = message.url
      result.data.filename = message.filename
      break
    case 'img':
      result.brief = '[ 图片 ]'
      result.data.width = message.width
      result.data.height = message.height
      result.data.url = message.url
      result.data.secret = message.secret
      result.data.filename = message.filename
      result.data.accessToken = message.accessToken
      notifyBody.icon = message.url
      break
    case 'url':
      result.brief = '[ 分享链接 ]'
      result.data.detail = message.ext.webChatDetail
      result.data.href = message.ext.webChatHref
      result.data.image = message.ext.webChatImage
      result.data.title = message.ext.webChatTitle
      notifyBody.icon = message.ext.webChatImage
      break
  }
  if (!me.$store.getters.getContact[name]) {
    me.$store.commit('setContact', {
      name: name,
      data: {
        detail: false,
        avatar: message.ext.avatar,
        nick: message.ext.nickname,
        unread: message.data.status === 'unread' ? 1 : 0,
        brief: result.brief
      }
    })
  } else {
    if (name !== me.$store.getters.getSelected) {
      me.$store.commit('setConcatUnread', {
        append: true,
        name: name,
        unread: 1
      })
    }
    me.$store.commit('setConcatBrief', {
      name: name,
      brief: result.brief
    })
  }
  if (notification) {
    notifyBody.body = result.brief
    notify(notifyBody)
  }
  me.$store.dispatch('setChatRecord', {
    replace: false,
    name: name,
    data: [result.data],
    created: result.created
  })
}

export default f
