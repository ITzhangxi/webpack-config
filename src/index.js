import Vue from 'vue'
import Router from 'vue-router'
import App from './app.vue'
import router from './router'
import '../assets/styles/base.css'
import '../assets/images/done.svg'
import '../assets/styles/base-stylus.styl'

Vue.use(Router)
// const root = document.createElement('div')
// document.body.appendChild(root)

new Vue({
  router: router(),
  render: (h) => h(App)
}).$mount('#root')
