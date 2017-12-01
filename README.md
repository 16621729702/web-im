# web-im

> 基于环信web-im 开发的即时聊天工具

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### 消息数据结构
[1] 文本
```javascript
  {
    data: "文本",  
    format: "2017/11/11 下午3:11:01",
    sentByMe: false,
    status: "unread",
    type: "txt",
    userInfo: {
      avatar: "头像",
      nickname:  "昵称"
    }
  }
```
[2] 分享链接（商城客服）
```javascript
  {
    detail: "文本",
    format: "2017/11/11 下午3:11:01",
    href: "链接",
    image: '图片'
    sentByMe: false,
    status: "unread",
    type: "url",
    title: "title",
    userInfo: {
      avatar: "头像",
      nickname:  "昵称"
    }
  }
```
[3] 图片
```javascript
  {
    accessToken: 'token', //暂时没发现有什么用
    filename: '图片名称' //暂时没发现有什么用
    format: "2017/11/11 下午3:11:01",
    height: 48,
    sentByMe: false,
    secret: "秘钥", //暂时没发现有什么用
    status: "unread",
    type: "img",
    width: 48,
    url: '图片地址'
    userInfo: {
      avatar: "头像",
      nickname:  "昵称"
    }
  }
```
[4] 定位
```javascript
  {
    accessToken: 'token', //暂时没发现有什么用
    filename: '图片名称' //暂时没发现有什么用
    format: "2017/11/11 下午3:11:01",
    height: 48,
    image: '图片',
    location: {
      address: '完整地址名称',
      lat: "40.04327126983335",
      lng: "116.30571126937866",
      name: '名称'
    },
    sentByMe: false,
    secret: "秘钥", //暂时没发现有什么用
    status: "unread",
    type: "loc",
    width: 48,
    url: '图片地址'
    userInfo: {
      avatar: "头像",
      nickname:  "昵称"
    }
  }
```
[5] 音频
```javascript
  {
    filename: '音频名称 xxx.amr' //暂时没发现有什么用
    format: "2017/11/11 下午3:11:01",
    secret: "秘钥", //暂时没发现有什么用
    sentByMe: false,
    status: "unread",
    type: "audio",
    url: '音频地址'
    userInfo: {
      avatar: "头像",
      nickname:  "昵称"
    }
  }
```
[6] 图片表情。 客户端的一种图片表情，与显示图片一样，根据stickerName显示响应图片。
```javascript
  {
    data: "emoji_104_big" // 表情名称
    format: "2017/11/11 下午3:11:01",
    sentByMe: false,
    status: "unread",
    type: "sticker",
    userInfo: {
      avatar: "头像",
      nickname:  "昵称"
    }
  }
```
