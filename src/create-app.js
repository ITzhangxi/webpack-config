import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'
import createRouter from './router'

import '../assets/styles/base.css'
import '../assets/images/done.svg'
import '../assets/styles/base-stylus.styl'

Vue.use(VueRouter)
export default () => {
  const router = createRouter()
  const app = new Vue({
    router,
    render: h => h(App)
  })
  return {app, router}
}
