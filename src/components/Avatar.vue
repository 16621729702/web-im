<template>
  <img :src="src" :class="['web-im-avatar', className]" :title="title">
</template>

<script>
export default {
  name: 'avatar',
  props: {
    src: '',
    title: '',
    className: ''
  }
}
</script>

<style lang='css' scoped>
  .web-im-avatar {
    min-width: 20px;
    min-height: 20px;
    border-radius: 50%; 
  }
</style>

