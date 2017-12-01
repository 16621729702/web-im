<template>
  <div v-html="text"></div>
</template>

<script>
import emoji from 'module_path/emoji'

export default {
  props: {
    message: ''
  },
  data () {
    return {
      text: '',
      emojiUrl: 'https://s.ziyadiaoyu.com/{name}.png'
    }
  },
  created () {
    let me = this
    var url = me.message.data.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/i)
    if (url) {
      me.text = me.message.data.replace(url[0], '<a class="inlineblock web-im-textHref" target="_blank" href="' + url[0] + '">' + url[0] + '</a>')
    } else {
      me.text = me.message.data.replace(/\[[^\x00-\xff]+\]/g, function (str) {
        return '<img src="' + me.emojiUrl.replace('{name}', emoji[str]) + '" width="30" height="30" class="web-im-emoji" />'
      })
    }
  }
}
</script>
<style lang="less">
  .web-im-textHref{
    padding: 0 5px;
    color: #039bfb;
    text-decoration: none;
    &:hover {
      color: #ff8000;
    }
  }
  .web-im-emoji {
    vertical-align: text-top;
  }
</style>
