<template>
  <audio class="web-im-SoundNotify" src="" ref="sound"></audio>
</template>

<script>
export default {
  name: 'web-im-soundNotify',
  data () {
    return {
      soundUrl: 'https://s.ziyadiaoyu.com/webim-sound.' + (window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? 'ogg' : 'mp3')
    }
  },
  methods: {
    play () {
      let me = this
      me.$refs.sound.src = me.soundUrl
      me.$refs.sound.play()
    }
  }
}
</script>

<style lang="css" scoped>
  .web-im-SoundNotify{
    display: none;
  }
</style>
