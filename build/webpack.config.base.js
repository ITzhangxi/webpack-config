const path = require('path') // 这是node模块中 解决路径引用问题
const VueLoaderPlugin = require('vue-loader/lib/plugin') // 处理vue-loader加载器的
const HTMLPlugin = require('html-webpack-plugin') // 为html文件中引入的外部资源如 script、link 动态添加每次 compile 后的hash，防止引用缓存的外部文件问题
// const createVueLoaderOptions = require('./vue-loader.config')
let config = {
  entry: path.join(__dirname, '../src/index.js'), // webpack 文件入口
  output: {
    filename: 'bundle.[hash:8].js', // 出口文件的名称 [hash:8] 代表将出口文件添加hash值，方式文件缓存
    path: path.join(__dirname, '../dist'), // 出口文件的位置
    // 这里使用线上地址，解决服务端渲染引用webpack-dev-server今天资源问题
    publicPath: 'http://127.0.0.1:8080/public/'
  },
  module: {
    // 配置加载器的规则
    rules: [
      {
        // 这个加载器用于写代码是自动提示语法错误
        test: /\.(vue|js|jsx)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        // 这个句话的意思表示测加载器规则在优先于其他正则匹配之前处理 比如.vue文件eslint-loader处理优先于vue-loader处理
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
        // options: createVueLoaderOptions(isDev)
      }, {
        test: /\.jsx$/,
        loader: 'babel-loader'
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        use: [
          'vue-style-loader', // 将style-loader换成vue-style-loader 主要是因为vue-style-loader可以处理vue内部css修改之后样式热更新
          'css-loader'
        ]
      },
      {
        test: /\.(gif|jpg|jpeg|svg|png)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024, // 当文件大于1024kb的时候 不将图片文件转换成base64
            name: 'resources/[name].[hash:8].[ext]' // 将文件大于limit设置的大小的图片重新命名并且存放到 images 目录下 这个目录是相对于出口文件的路径来说的 [name]代表文件原来的名称 [hash:8]  添加hash值 8 位数 [ext] 扩展名
          }
        }]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HTMLPlugin()
  ]
}
module.exports = config

// chunkhash 和 hash 的区别在于 hash打包的时候，所有的hash值一样，而chunkhash 没有生成的值都不一样
