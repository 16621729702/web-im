<template>
  <div v-html="text"></div>
</template>

<script>

export default {
  props: {
    message: ''
  },
  data () {
    return {
      text: ''
    }
  },
  created () {
    let me = this
    var url = me.message.data.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/i);
    if (url) {
      me.text = me.message.data.replace(url[0], '<a class="inlineblock web-im-textHref" target="_blank" href="' + url[0] + '">' + url[0] + '</a>'); 
    } else {
      me.text = me.message.data
    }
  }
}
</script>
<style>
  .web-im-textHref{
    padding: 0 5px;
    color: #039bfb;
    text-decoration: none;
    &:hover {
      color: #ff8000;
    }
  }
</style>
