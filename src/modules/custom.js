import Notify from 'component_path/notify/notify.js'
import Sound from 'component_path/sound/sound.js'
import SoundNotify from 'component_path/soundNotify/soundNotify.js'

const install = function (Vue) {
  // Vue.component(Notify.name, Notify)
  // Vue.component(Sound.name, Sound)

  Vue.prototype.$sound = Sound.installSound
  Vue.prototype.$soundNotify = SoundNotify.installSoundNotify
  Vue.prototype.$notify = Notify.installNotify
}

export default install
