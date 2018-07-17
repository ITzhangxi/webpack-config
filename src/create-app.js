import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'
import createRouter from './router'
import Meta from 'vue-meta'

import '../assets/styles/base.css'
import '../assets/images/done.svg'
import '../assets/styles/base-stylus.styl'

Vue.use(VueRouter)
Vue.use(Meta)

export default () => {
  const router = createRouter()
  const app = new Vue({
    router,
    render: h => h(App)
  })
  return {app, router}
}
