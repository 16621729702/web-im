<template>
  <transition name="fade">
    <div class="web-im-scalePictrue" v-show="imageUrl" >
      <div class="web-im-scalePictrue-close tc pointer" @click="hide"></div>
      <img :src="imageUrl" class="web-im-scalePictrue-img" :width="imgWidth" :height="imgHeight" />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'web-im-scalePictrue',
  data () {
    return {
      imageUrl: '',
      imgWidth: 'auto',
      imgHeight: 'auto'
    }
  },
  methods: {
    hide () {
      let me = this
      me.imageUrl = ''
      me.imgWidth = 'auto'
      me.imgHeight ='auto'
    },
    show (src) {
      let me = this
      const h = window.innerHeight
      const w = window.innerWidth
      let img = document.createElement('img')
      img.src = src
      img.onload = () => {
        const _w = img.width
        const _h = img.height
        if (_w > w || _h > h) {
          const _r = _w / _h
          const r = w / h
          if (_r > r) {
            me.imgWidth = w
            me.imgHeight =  w / _r
          } else {
            me.imgWidth = h * _r
            me.imgHeight = h
          }
        }
      }
      me.imageUrl = src
    }
  }
}
</script>

<style lang="less" src='./scalePicture.less'></style>
