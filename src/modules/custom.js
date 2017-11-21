import Notify from 'component_path/notify/notify.js'
import Sound from 'component_path/sound/sound.js'

const install = function (Vue) {
  // Vue.component(Notify.name, Notify)
  // Vue.component(Sound.name, Sound)

  Vue.prototype.$sound = Sound.installSound
  Vue.prototype.$notify = Notify.installNotify
}

export default install
