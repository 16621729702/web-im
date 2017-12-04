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
      emojiUrl: '<img src="https://s.ziyadiaoyu.com/{name}.png" width="30" height="30" class="web-im-emoji" />'
    }
  },
  mounted () {
    let me = this
    let text = me.message.data
    text = text.replace(/https?:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/i, function (item) {
      return '<a class="inlineblock web-im-textHref" target="_blank" href="' + item + '">' + item + '</a>'
    })
    me.text = text.replace(/\[[^\x00-\xff]+\]/g, function (str) {
      return me.emojiUrl.replace('{name}', emoji[str])
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
