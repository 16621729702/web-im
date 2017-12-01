import Vue from 'vue'
import sound from './sound.vue'

let Sound = new (Vue.extend(sound))({
  data: {}
}).$mount()

document.querySelector('body').appendChild(Sound.$el)

sound.installSound = function (str) {
  Sound.load(str)
}

export default sound
