import createApp from './create-app'

const {app, router} = createApp()

router.onReady(_ => {
  app.$mount('#root')
})
