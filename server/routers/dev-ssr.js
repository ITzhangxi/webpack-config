// 配置开发环境服务器渲染配置
const Router = require('koa-router')
const axios = require('axios')
// 和fs作用差不多 但是它将文件写到内存中
const MemoryFS = require('memory-fs')
const fs = require('fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')
const path = require('path')

const serverConfig = require('../../build/webpack.config.server')
const serverRenderer = require('./server-render')

// =======================================
// node启动webpack
const serverCompiler = webpack(serverConfig)
// 实例化memory-fs
const mfs = new MemoryFS()
// 将服务端打包的文件存放到内存中 这比fs写到磁盘中速度快些
serverCompiler.outputFileSystem = mfs
// =======================================

// 申明包
let bundle

// 监测webpack打包 这个里和webpack-dev-server功能超不多 修改客户端代码时候，这个watch都要执行 利用这点实现开发时实时更新
serverCompiler.watch({}, (err, stats) => {
  // 监测webpack编译出现错的时候将异常抛出
  if (err) throw err

  // =======================================
  // 但是有点注意 比如eslint之类的编译会出现问题 不会存放到err中 存到了stats中 我们需要将它出现的抛出去
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.log(warn))
  // =======================================

  // =======================================
  // 获取VueServerPlugin在webpack.config.server打包出来的文件为vue-ssr-server-bundel.json的路径 webpack.config.server获取打包出来的文件路径 以及VueServerPlugin在webpack.config.server打包出来的文件为vue-ssr-server-bundel.json
  const bundlePath = path.join(
    serverConfig.output.path,
    'vue-ssr-server-bundle.json'
  )
  // 用memory-fs读取vue-ssr-server-bundel.json文件，并转换成utf-8
  //  此时bundle就是vue-ssr-server-bundel.json文件
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  // =======================================
  // 每次获取bundle 是后台打印处理啊
  console.log('new bundle generated')
})

// koa的中间件 用来处理服务端渲染返回的东西 指定返回的HTML的内容
const handleSSR = async (ctx) => {
  if (!bundle) {
    ctx.body = 'palease wait later'
    return
  }

  // =======================================
  // 服务端从这里开始渲染html
  // 服务端只是渲染了html 此时需要向html中引用webpack-devserver客户端打包出来的js
  // 因为这个服务端渲染开启的是两个服务 一个是客户端服务 另一个是服务端服务
  // 那么服务端服务从客户端服务获取js文件，需要用axios获取
  const clientManifestResp = await axios.get(
    'http://127.0.0.1:8080/public/vue-ssr-client-manifest.json'
  )
  // clientManifestResp是promise 转换成
  const clientManifest = clientManifestResp.data
  // 通过fs获取HTML的模板
  const template = fs.readFileSync(
    path.join(__dirname, '../srr-template.ejs'),
    'utf-8'
  )

  // 创建renderer实例 createBundleRenderer解析bundle文件然后生成html
  const renderer = VueServerRenderer.createBundleRenderer(bundle, {
    inject: false, // 禁用所有自动注入
    clientManifest // 添加js css资源，以用于注入到HTML中
  })

  // 服务端渲染
  await serverRenderer(ctx, renderer, template)
}

// 实例化koa的路由
const router = new Router()
// koa路由不管执行哪一步都要执行 handleSSR服务端渲染
router.get('*', handleSSR)

module.exports = router
