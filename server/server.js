const Koa = require('koa')
const send = require('koa-send')
const path = require('path')
const app = new Koa()
const pageRouter = require('./routers/dev-ssr')
const isDev = process.env.NODE_ENV === 'development'

app.use(async (ctx, next) => {
  try {
    console.log(`request path ${ctx.path}`)
    // next()异步执行的 所以要用 await 否则页面显示 No found  切记啊
    await next()
  } catch (err) {
    console.log(err)
    ctx.status = 500
    if (isDev) {
      ctx.body = err.message
    } else {
      ctx.body = 'please again'
    }
  }
})

// 通过koa-send解决静态文件问题，切记不能在32行之后执行这段代码
app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    await send(ctx, '/favicon.ico', {root: path.join(__dirname, '../')})
  } else {
    await next()
  }
})

// 加载路由中间件
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333

app.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST}:${PORT}`)
})
