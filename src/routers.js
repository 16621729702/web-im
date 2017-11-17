import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Window from '@/components/Window'
import Chat from '@/components/Chat'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/window',
      component: Window,
      children: [
        {
          path: 'chat',
          component: Chat,
        }
      ] 
    },
    {
      path: '*',
      redirect: { name: 'login' }
    }
  ]
})
