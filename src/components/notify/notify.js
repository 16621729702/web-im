import Vue from 'vue'
import notify from './notify.vue'

let Notify = new (Vue.extend(notify))({
  data: {}
}).$mount()

document.querySelector('body').appendChild(Notify.$el)

notify.installNotify = function (str, className) {
  Notify.show(str, className)
}

export default notify
