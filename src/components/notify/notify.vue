<template>
  <transition name="fade">
    <div :class="['web-im-notify', 'tc', className]" v-show="content">
      {{content}}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'web-im-notify',
  data () {
    return {
      content: '',
      className: '',
      time: 3000,
      timeout: true
    }
  },
  methods: {
    hide () {
      let me = this
      me.timeout && clearTimeout(me.timeout)
      me.timeout = setTimeout(() => {
        me.content = ''
        me.className = ''
      }, me.time)
    },
    show (str, className) {
      let me = this
      let type = typeof str
      if (type === 'null' || type === 'undefined' || type === 'object' || type === 'function') {
        str = ''
      }
      if (str) {
        me.content = str
        me.className = className
        me.hide()
      }
    }
  }
}
</script>

<style lang="less" src='./notify.less'></style>
