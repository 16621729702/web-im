function f (message, type, me) {
  let result = {
    lasted:  message.created,
    sentByMe: message.from === me.username,
    created: message.created
  }
  result.data = {
    sentByMe: message.from === me.username,
    type: type,
    status: message.status
  }
  result.data.userInfo = {
    avatar: (result.sentByMe ? me.avatar : message.ext.avatar),
    nickname: (result.sentByMe ? me.nick : message.ext.nickname)
  }
  result.data.format = (message.created ? new Date(message.created) : new Date()).toLocaleString()
  switch (type) {
    case 'txt':
      result.brief = message.data
      result.data.data = message.data
      break
    case 'sticker':
      result.brief = '[ 表情 ]'
      result.data.data = message.data
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
      break
    case 'url':
      result.brief = '[ 分享链接 ]'
      result.data.detail = message.ext.webChatDetail
      result.data.href = message.ext.webChatHref
      result.data.image = message.ext.webChatImage
      result.data.title = message.ext.webChatTitle
      break
  }
  return result
}

export default f
