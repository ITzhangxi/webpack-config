import createApp from './create-app'

export default context => {
  return new Promise((resolve, reject) => {
    const {app, router} = createApp()
    // 这时候将路由跳转到context.url 因为router不能自动执行
    router.push(context.url)
    router.onReady(() => {
      // 获取具有加载出来的组件
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new Error('no match component'))
      }
      resolve(app)
    })
  })
}
