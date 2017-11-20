<template>
  <div class="web-im-messageAudio pointer" @click="playAudio">
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
      let target = e.currentTarget.parentNode
      if (target.classList.contains('web-im-blink')) {
        target.classList.remove('web-im-blink')
      } else {
        target.classList.add('web-im-blink')
      }
      console.log(me.message)
    }
  }
}
</script>