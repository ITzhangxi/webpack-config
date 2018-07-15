const path = require('path') // 这是node模块中 解决路径引用问题
const HTMLPlugin = require('html-webpack-plugin')
const merage = require('webpack-merge')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin') // 抽离css样式
const baseConfig = require('./webpack.config.base')
const isDev = process.env.NODE_ENV === 'development' // 从package.json 中script中获取 NODE_ENV 参数来分辨开发模式或者生产环境
const VueClientPlugin = require('vue-server-renderer/client-plugin') // 将客户端js打包出来  打包出来的文件是vue-ssr-client-manifest.json
const devServer = {
  port: 8080,
  host: '127.0.0.1',
  overlay: false,
  hot: true,
  // 对于单页面程序，浏览器的brower histroy可以设置成html5 history api或者hash，而设置为html5 api的，如果刷新浏览器会出现404 not found，原因是它通过这个路径（比如： /activities/2/ques/2）来访问后台，所以会出现404，而把historyApiFallback设置为true那么所有的路径都执行index.html。
  historyApiFallback: {
    index: '/public/index.html'
  }
}

let config = null

// 根据生产环境和测试环境进行配置
if (isDev) {
  config = merage(baseConfig, {
    // 原始代码（只有行内） 与上面一样除了每行特点的从loader中进行映射
    devtool: '#cheap-module-eval-source-map',
    devServer,
    module: {
      rules: [
        {
          test: /\.styl$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'postcss-loader', // 在具有兼容性的css前添加前缀
              options: {
                // 启用源映射支持，postcss-loader将使用其他加载器给出的先前源映射并相应地更新它，如果在postcss-loader之前没有应用先前的加载器，则加载器将为您生成源映射
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    plugins: [
      // 下面两个插件是用于热加载的
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: isDev ? '"development"' : '"production"'
        }
      }),
      // 设置html模板 并且将js css自动引入到该模板中
      new HTMLPlugin({
        // 模板路径
        template: path.join(__dirname, './template.html')
      }),
      // 将客户端js打包出来  打包出来的文件是vue-ssr-client-manifest.json
      new VueClientPlugin()
    ]
  })
} else {
  config = merage(baseConfig, {
    entry: {
      app: path.join(__dirname, '../src/index.js'),
      vendor: ['vue']
    },
    output: {
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.styl$/,
          use: ExtractPlugin.extract({
            // 单独将css打包成独立的文件
            // 否则的话会将所有的 css 文件都打包到bundle.js文件中
            fallback: 'vue-style-loader', // 编译后用什么 loader 来提取css文件
            use: [
              'css-loader', // 指需要什么样的loader去编译文件,这里由于源文件是 .css 所以选择 css-loader
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true
                }
              },
              'stylus-loader'
            ]
          })
        }
      ]
    },
    plugins: [
      // 通过插件extract-text-webpack-plugin 命名css输出路径和文件名称
      new ExtractPlugin('styles.[contentHash:8].css'),
      // 将内库代码单独打包 业务代码更新的时候，内库代码就不需要在刷新了，从而减少带宽资源浪费
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor' // 这里需要和 config.entry 的 vendor名字一致
      }),
      // 将webpack相关的代码单独打包到有个文件中
      // 有点：有新的模块加入的时候，webpack 会将每个模块添加一个id上去，有新的模块假如的时候，它插入的顺序可能在中间，会导致后面没有模块的ide发生变化，发生变化之后，会导致每个模块的它hash会发生变化，那么想利用hash 长缓存的作用就失去意义了，下面这个插件就可以规避这个问题，
      // 切记这个一定要放到上面这个的下面，否则就会失去意义
      new webpack.optimize.CommonsChunkPlugin({
        // 这个名字是随便声明的，只要在安全内没有声明的任何一个名字，一般是runtime
        name: 'runtime'
      })
    ]
  })
}

module.exports = config

// chunkhash 和 hash 的区别在于 hash打包的时候，所有的hash值一样，而chunkhash 没有生成的值都不一样
