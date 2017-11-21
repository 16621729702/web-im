<template>
  <div v-if="item.type" :class="['boxsizing', 'web-im-message', byMe]">
    <Avatar :src="item.userInfo.avatar" className="inlineblock"></Avatar>
    <span :class="'inlineblock ' + byMe">{{ item.userInfo.nickname }}</span>
    <span :class="'inlineblock ' + byMe +  ' web-im-messageFormat'">{{ item.format }}</span>
    <div class="clr"></div>
    <div :class="['inlineblock', 'web-im-messageContent', (item.type === 'audio' && item.url === soundHref) ? 'web-im-blink' : '']">
      <img class="web-im-messageImage" v-if="item.type === 'img'" :src="item.url" />
      <div class="web-im-messageUrl pointer" v-else-if="item.type === 'url'" @click="openNewTab" :data-href="item.href">
        <img :src="item.image" />
        <div class="web-im-urlTitle">{{ item.title }}</div>
        <div class="web-im-urlDescription">{{ item.detail }}</div>
      </div>
      <AudioMessage v-else-if="item.type === 'audio'" :message="item"></AudioMessage>
      <div v-else-if="item.type ==='loc'">
        <img class="web-im-messageImage" :src="item.url"/><br>
        {{ item.location.address }}<br>
        {{ item.location.name }}<br>
        lng: {{item.location.lng}}<br>
        lat: {{item.location.lat}}
      </div>
      <TextMessage v-else="item.type === 'text'" :message="item"></TextMessage>
    </div>
</div>
</template>

<script>
import Avatar from '@/components/Avatar'
import TextMessage from '@/components/Text'
import AudioMessage from '@/components/Audio'

export default {
  components: {
    Avatar: Avatar,
    TextMessage: TextMessage,
    AudioMessage: AudioMessage
  },
  props: {
    item: {}
  },
  computed: {
    soundHref () {
      return this.$store.getters.getSound
    }
  },
  data () {
    return {
      byMe: ''
    }
  },
  created () {
    this.byMe = this.item.sentByMe ? 'fr' : 'fl'
  },
  methods: {
    openNewTab (e) {
      window.open(e.currentTarget.dataset.href)
    }
  }
}
</script>
<style lang='less' src="less_url/_messages.less" scoped></style>
