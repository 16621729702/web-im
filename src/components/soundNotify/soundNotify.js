import Vue from 'vue'
import soundNotify from './soundNotify.vue'

let SoundNotify = new (Vue.extend(soundNotify))({
  data: {}
}).$mount()

document.querySelector('body').appendChild(SoundNotify.$el)

soundNotify.installSoundNotify = function (str) {
  SoundNotify.play()
}

export default soundNotify
