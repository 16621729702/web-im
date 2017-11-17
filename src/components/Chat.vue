<template>
  <div class="web-im-chatWindow">
    <div class="web-im-contact">
      <ContactItem v-for="item in contact" :item="item"></ContactItem>
    </div>
  </div>
</template>

<script>
  import ContactItem from '@/components/ContactItem'
  export default {
    name: 'Chat',
    components: {
      ContactItem: ContactItem
    },
    data () {
      return {
        contact: []
      }
    },
    mounted () {
      let me = this
      me.$ajax({
        url: 'https://www.ziyadiaoyu.com/biz_im_list?token=' + me.$cookie.analysisCookie().token + '&random=' + (new Date()).getTime(),
        type: 'get',
        success: function ( data) {
          var json = JSON.parse(data).entities.messages;
          json.forEach((item) => {
            
          })
        },
        error: function (err) {

        }
      })
    },
    methods: {
    }
  }
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' src="less_url/_chat.less" scoped></style>

