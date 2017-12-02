<template>
  <div class="web-im-messageAudio pointer" @click="playAudio" :data-src="message.url">
    <span class="inlineblock icon icon-weibiaoti102"></span>　声音
  </div>
</template>

<script>

export default {
  props: {
    message: {}
  },
  methods: {
    playAudio (e) {
      let me = this
      let ele = e.currentTarget
      let src = ele.dataset.src
      if (!ele.parentNode.classList.contains('web-im-blink')) {
        if (src.indexOf('.mp3') > 0) {
          me.$sound(src)
        } else {
          let options = { url: src };
          options.onFileDownloadComplete = function ( response ) { 
            const href = WebIM.utils.parseDownloadResponse.call(me.$webIM, response);
            me.message.url = href
            me.$sound(href)
          }
          options.onFileDownloadError = function () {
            me.$notify('音频下载失败，请稍后再试', 'error')
          }
          options.headers = { 
            'Accept': 'audio/mp3'
          }
          window.WebIM.utils.download.call(me.$webIM, options);
        }
      } else {
        me.$sound('')
      }
    }
  }
}
</script>