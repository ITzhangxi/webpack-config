module.exports = (isDev) => {
    return {
        preserveWhiteSpace: true, // template中标签内文件不小心换行了且上一行结尾的是空格 这里了自动将空格给删除
        extractCSS: true, // 将vue文件中的css单独打包出来，尤大神开发时认为将vue文件中的css一起打包到js中，这样模块加载，用到哪个模块就加载哪个模块，这样效率高些，但是我们现在的需求就将vue文件中的css单独打包出来，此时需要对vue-loader 添加配置选项extractCSS
        cssModules: {
            localIdentName: isDev ? '[path]-[name]-[hash:base64:8]' : '[hash:base64:8]', // 重新命名class类名[path]此css所在的文件夹位置 [name]原本的类名 [hash:base64:8] hash值为base64 去前8位
            camelCase: true // 开启 CSS Modules 。 指的是 template中的类名通过$style.类名给标签添加与style中对应的类名 但是style中药添加属性 module 和scoped相同的位置
        }
    }
}