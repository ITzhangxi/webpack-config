const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
let config = {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(path.join(__dirname, 'dist'))
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.jsx$/,
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            // {
            //     test: /\.styl$/,
            //     use: [
            //         'style-loader',
            //         'css-loader',
            //         {
            //             loader: 'postcss-loader',
            //             options: {
            //                 sourceMap: true
            //             }
            //         },
            //         'stylus-loader'
            //     ]
            // },
            {
                test: /\.(gif|jpg|jpeg|svg|png)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        name: 'images/[name].[hash:8].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        // make sure to include the plugin!
        new webpack.DefinePlugin({
            // 作用：webpack 打包的时候将 process.env 变量也打包到项目中，process.env编程了全局变量，可以根据它判断环境变量了
            'process.env': isDev ? '"development"' : '"production"'
        }),
        new HTMLPlugin(),
        new VueLoaderPlugin()
    ]
}

if (isDev) {
    config.module.rules.push({
        test: /\.styl$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                },
            },
            'stylus-loader'
        ]
    })
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        port: 3737,
        host: '0.0.0.0', // 这样写的好处是既可以用localhost 127.0.0.1 以及目前电脑的ip地址可以访问
        overlay: {
            error: true // 作用：出现错误的时候将错误提示展示到页面上
        },
        // open: true, // npm run dev 时候打开新的页面
        hot: true, // 热加载 不过需要两个插件 webpack.HotModuleReplacementPlugin webpack.NoEmitOnErrorsPlugin
    }
    config.plugins.push(
        // 下面两个插件是用于热加载的
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
} else {
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push({
        test: /\.styl$/,
        use: ExtractPlugin.extract({
            // 单独将css打包成独立的文件
            // 否则的话会将所有的css文件都打包到bundle.js文件中
            fallback: 'style-loader',
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
    })
    config.plugins.push(
        // 通过插件extract-text-webpack-plugin 命名css输出路径和文件名称
        new ExtractPlugin('css/styles .[contentHash:8].css'),
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
    )
}

module.exports = config


// chunkhash 和 hash 的区别在于 hash打包的时候，所有的hash值一样，而chunkhash 没有生成的值都不一样