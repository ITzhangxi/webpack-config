const path = require('path') // 这是node模块中 解决路径引用问题
const merage = require('webpack-merge')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const VueServerPlugin = require('vue-server-renderer/server-plugin') // vue服务器渲染所需要的插件

let config

const isDev = process.env.NODE_ENV === 'development'
const plugins = [
  new ExtractPlugin('styles.[contentHash:8].css'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VUE_ENV': '"server"'
  })
]
if (isDev) {
  plugins.push(new VueServerPlugin())
}
config = merage(baseConfig, {
  // 这个必须指定打包的环境是node环境 因为我们这个程序在node端运行
  target: 'node',
  entry: path.join(__dirname, '../src/server-entry.js'),
  devtool: 'source-map',
  output: {
    libraryTarget: 'commonjs2', // 指定模块打包系统
    filename: 'server-entry.js',
    path: path.join(__dirname, '../server-build')
  },
  // 不要打包这些文件生产环境依赖为包
  externals: Object.keys(require('../package.json').dependencies),
  // vue有的service-render有个webpack插件，给我提供一个代码调试的功能 指引文件出错在具体行数
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: ExtractPlugin.extract({
          fallback: 'vue-style-loader',
          use: [
            'css-loader',
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
  plugins
})
module.exports = config

// chunkhash 和 hash 的区别在于 hash打包的时候，所有的hash值一样，而chunkhash 没有生成的值都不一样
