import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import Vuex from 'vuex'
import App from './app.vue'
import createRouter from './router'
import createStore from '../store/store'

import '../assets/styles/base.css'
import '../assets/images/done.svg'
import '../assets/styles/base-stylus.styl'

Vue.use(VueRouter)
Vue.use(Meta)
Vue.use(Vuex)

export default () => {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return {app, router, store}
}
