<template>
  <audio class="web-im-sound" src="" ref="sound"></audio>
</template>

<script>
export default {
  name: 'web-im-sound',
  methods: {
    load (str) {
      let me = this
      if (str) {
        me.$refs.sound.src = str
        me.$refs.sound.play()
      } else {
        me.$refs.sound.pause()
      }
      app.$store.commit('setSound', str)
    }
  }
}
</script>

<style lang="less" src='./sound.less' scoped></style>
