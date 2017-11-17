<template>
  <div class="boxsizing web-im-contactItem pointer" v-if="item.username" data-uid="item.username">
    <Avatar :src="item.avatar"></Avatar>
    <p class="web-im-nick">{{ item.nick }}</p>
    <p class="web-im-brief">{{ item.brief }}</p>
    <div class="web-im-notice tc">1</div>
  </div>
</template>
<script>
import Avatar from '@/components/Avatar'
export default {
  name: 'contactItem',
  components: {
    Avatar: Avatar
  },
  props: {
    item: {}
  }
}
</script>
<style lang='less' src="less_url/_contactItem.less"></style>
