// 服务端渲染
// 引入模板引擎
const ejs = require('ejs')

module.exports = async (ctx, renderer, template) => {
  // 设置服务端响应头部
  ctx.headers['Content-Type'] = 'text/html'
  const context = {url: ctx.path}
  try {
    // context渲染为字符串
    const appString = await renderer.renderToString(context)
    // 获取mate内容
    const {title} = context.meta.inject()
    // ejs 渲染模板
    const html = ejs.render(template, {
      appString,
      style: context.renderStyles(),
      scripts: context.renderScripts(),
      // 这里呈现的就是vue组件中设置的title 这是带有title和text的标签
      title: title.text()
    })
    ctx.body = html
  } catch (err) {
    console.log('render error', err)
    throw err
  }
}
