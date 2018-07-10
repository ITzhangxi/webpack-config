const path = require('path') // 这是node模块中 解决路径引用问题
const VueLoaderPlugin = require('vue-loader/lib/plugin') // 处理vue-loader加载器的
const HTMLPlugin = require('html-webpack-plugin') // 为html文件中引入的外部资源如 script、link 动态添加每次 compile 后的hash，防止引用缓存的外部文件问题
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin') // 抽离css样式
const isDev = process.env.NODE_ENV === 'development' // 从package.json 中script中获取 NODE_ENV 参数来分辨开发模式或者生产环境
let config = {
    entry: path.join(__dirname, 'src/index.js'), // webpack 文件入口
    output: {
        filename: 'bundle.[hash:8].js', // 出口文件的名称 [hash:8] 代表将出口文件添加hash值，方式文件缓存
        path: path.join(__dirname, 'dist') // 出口文件的位置
    },
    module: {
        // 配置加载器的规则
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.jsx$/,
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
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
                        limit: 1024, // 当文件大于1024kb的时候 不将图片文件转换成base64
                        name: 'images/[name].[hash:8].[ext]' // 将文件大于limit设置的大小的图片重新命名并且存放到 images 目录下 这个目录是相对于出口文件的路径来说的 [name]代表文件原来的名称 [hash:8]  添加hash值 8 位数 [ext] 扩展名
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

// 根据生产环境和测试环境进行配置
if (isDev) {
    config.module.rules.push({
        test: /\.styl$/,
        use: [
            'vue-style-loader',
            'css-loader',
            {
                loader: 'postcss-loader', // 在具有兼容性的css前添加前缀
                options: {
                    sourceMap: true // 启用源映射支持，postcss-loader将使用其他加载器给出的先前源映射并相应地更新它，如果在postcss-loader之前没有应用先前的加载器，则加载器将为您生成源映射
                },
            },
            'stylus-loader'
        ]
    })
    config.devtool = '#cheap-module-eval-source-map'   // 原始代码（只有行内） 与上面一样除了每行特点的从loader中进行映射
    config.devServer = {
        port: 3737,
        host: '0.0.0.0', // 这样写的好处是既可以用localhost 127.0.0.1 以及目前电脑的ip地址可以访问
        overlay: true,
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