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
      let t = e.currentTarget
      let src = ''
      if (!t.parentNode.classList.contains('web-im-blink')) {
        src = t.dataset.src
      }
      this.$sound(src)
    }
  }
}
</script>