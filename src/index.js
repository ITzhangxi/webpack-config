import Vue from 'vue'
import App from './app.vue'
import '../assets/styles/base.css'
import '../assets/images/done.svg'
import '../assets/styles/base-stylus.styl'

const root = document.createElement('div')
document.body.appendChild(root)

new Vue({
    render: h => h(App)
}).$mount(root)