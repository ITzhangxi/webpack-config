const merage = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const devServer = {
  port: 8080,
  host: '127.0.0.1',
  overlay: {
    error: false
  },
  hot: true
}
const definePlugin = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"'
    }
  }),
  new HTMLPlugin({
    template: path.join(__dirname, 'template.html')
  })
]
const config = merage(baseConfig, {
  entry: path.join(__dirname, '../practice/index.js'),
  // 原始代码（只有行内） 与上面一样除了每行特点的从loader中进行映射
  devtool: '#cheap-module-eval-source-map',
  devServer,
  // 指定import Vue from 'vue' vue的路径 vue.esm.js可以在new Vue()中写入template模板
  // 不指定的话 默认开发环境使用的vue是vue.runtime.esm.js 它和vue.esm.js区别在于后者可以在new Vue()中写入template模板，前者不可以
  resolve: {
    alias: {
      'vue': path.join(__dirname, '../node_modules/vue/dist/vue.esm.js')
    }
  },
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
  plugins: definePlugin.concat([
    // 下面两个插件是用于热加载的
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ])
})

module.exports = config

// chunkhash 和 hash 的区别在于 hash打包的时候，所有的hash值一样，而chunkhash 没有生成的值都不一样
