import Router from 'vue-router'
import Home from '../views/Home.vue'

export default () => {
  return new Router({
    mode: 'history',
    routes: [{
      path: '/',
      component: Home
    }]
  })
}
