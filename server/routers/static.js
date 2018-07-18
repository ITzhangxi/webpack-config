const Router = require('koa-router')
const send = require('koa-send')
// 参数prefix是只处理静态文件文件/public开头的路径
const staticRouter = new Router({ prefix: '/public' })
staticRouter.get('*', async ctx => {
  await send(ctx, ctx.path)
})

module.exports = staticRouter
