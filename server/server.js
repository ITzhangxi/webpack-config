// const Koa = require('koa')
// const send = require('koa-send')
// const path = require('path')
// const app = new Koa()
// const staticRouter = require('./routers/static')
// const isDev = process.env.NODE_ENV === 'development'
//
// app.use(async (ctx, next) => {
//   try {
//     console.log(`request path ${ctx.path}`)
//     // next()异步执行的 所以要用 await 否则页面显示 No found  切记啊
//     await next()
//   } catch (err) {
//     console.log(err)
//     ctx.status = 500
//     if (isDev) {
//       ctx.body = err.message
//     } else {
//       ctx.body = 'please again'
//     }
//   }
// })
//
// // 通过koa-send解决静态文件问题，切记不能在32行之后执行这段代码
// app.use(async (ctx, next) => {
//   if (ctx.path === '/favicon.ico') {
//     await send(ctx, '/favicon.ico', {root: path.join(__dirname, '../')})
//   } else {
//     await next()
//   }
// })
//
// app.use(staticRouter.routes()).use(staticRouter.allowedMethods())
//
// let pageRouter
// if (isDev) {
//   pageRouter = require('./routers/dev-ssr')
// } else {
//   pageRouter = require('./routers/ssr')
// }
// // 加载路由中间件
// app.use(pageRouter.routes()).use(pageRouter.allowedMethods())
//
// const HOST = process.env.HOST || '0.0.0.0'
// const PORT = process.env.PORT || 3333
//
// app.listen(PORT, HOST, () => {
//   console.log(`server is listening on ${HOST}:${PORT}`)
// })

const Koa = require('koa')
const send = require('koa-send')
const path = require('path')

const staticRouter = require('./routers/static')

const app = new Koa()

const isDev = process.env.NODE_ENV === 'development'

app.use(async (ctx, next) => {
  try {
    console.log(`request with path ${ctx.path}`)
    await next()
  } catch (err) {
    console.log(err)
    ctx.status = 500
    if (isDev) {
      ctx.body = err.message
    } else {
      ctx.bosy = 'please try again later'
    }
  }
})

// 解决静态路径的问题
app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    await send(ctx, '/favicon.ico', {root: path.join(__dirname, '../')})
  } else {
    await next()
  }
})

app.use(staticRouter.routes()).use(staticRouter.allowedMethods())

let pageRouter
if (isDev) {
  pageRouter = require('./routers/dev-ssr')
  // pageRouter = require('./routers/dev-ssr-no-bundle')
} else {
  // pageRouter = require('./routers/ssr')
  pageRouter = require('./routers/ssr')
}
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333

app.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST}:${PORT}`)
})
