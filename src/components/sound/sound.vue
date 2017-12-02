<template>
  <audio class="web-im-sound" src="" ref="sound" @ended="end"></audio>
</template>

<script>
export default {
  name: 'web-im-sound',
  methods: {
    load (str) {
      let me = this
      me.$refs.sound.src = str
      if (str) {
        me.$refs.sound.play()
      }
      window.app.$store.commit('setSound', str)
    },
    end (e) {
      let me = this
      if (e.target) {
        me.$refs.sound.src = ''
        window.app.$store.commit('setSound', '')
      }
    }
  }
}
</script>

<style lang="less" src='./sound.less' scoped></style>
