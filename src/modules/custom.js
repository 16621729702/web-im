import Notify from 'component_path/notify/notify.js'

const install = function (Vue) {
  Vue.component(Notify.name, Notify)

  Vue.prototype.$notify = Notify.installNotify
}

export default install
