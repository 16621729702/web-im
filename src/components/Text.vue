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
  mounted () {
    let me = this
    let text = me.message.data
    text = text.replace(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/i, function (item) {
      return '<a class="inlineblock web-im-textHref" target="_blank" href="' + item + '">' + item + '</a>'
    })
    me.text = text.replace(/\[[^\x00-\xff]+\]/g, function (str) {
      return '<img src="' + me.emojiUrl.replace('{name}', emoji[str]) + '" width="30" height="30" class="web-im-emoji" />'
    })
  }
}
</script>
<style lang="less">
  .web-im-textHref{
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
