import Vue from 'vue'
import scalePictrue from './scalePicture.vue'

let ScalePictrue = new (Vue.extend(scalePictrue))({
  data: {}
}).$mount()

document.querySelector('body').appendChild(ScalePictrue.$el)

scalePictrue.installScalePicture = function (src) {
  ScalePictrue.show(src)
}

export default scalePictrue
