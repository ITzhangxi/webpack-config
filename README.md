# package插件介绍
```js
devDependencies = {
        "autoprefixer": "^8.6.5", // css自动添加兼容性的前缀
        "babel-core": "^6.26.3",
        "babel-helper-vue-jsx-merge-props": "^2.0.3",
        "babel-loader": "^7.1.5",
        "babel-plugin-syntax-jsx": "^6.18.0",
        "babel-plugin-transform-vue-jsx": "^3.7.0",
        "babel-preset-env": "^1.7.0",
        "cross-env": "^5.2.0",
        "css-loader": "^1.0.0",
        "extract-text-webpack-plugin": "^3.0.2",
        "file-loader": "^1.1.11",
        "html-webpack-plugin": "^3.2.0",  // 将引用插入HTML中 script link
        "postcss-loader": "^2.1.5",
        "style-loader": "^0.21.0",
        "stylus": "^0.54.5",
        "stylus-loader": "^3.0.2",
        "url-loader": "^1.0.1",
        "vue-loader": "^15.2.4",
        "vue-style-loader": "^4.1.0", // vue样式加载器 功能和style-loader功能一样 但是它支持样式热更新
        "vue-template-compiler": "^2.5.16",
        "webpack": "3.10.0",
        "webpack-dev-server": "2.9.7",  // webpack启动本地服务
        "webpack-merge": "^4.1.3"  // webpack配置合并
}




scripts =  {
    // “cross-env”代表的是兼容windows lunx mac 中设置参数  “NODE_ENV=production”将参数NODE_ENV设置为production 
    // “webpack” 启动webpack服务 --config 启动webpack配置 “build/webpack.config.client.js” ： webpack配置的路径
    "build:client": "cross-env NODE_ENV=production webpack --config build/webpack.config.client.js",
    // 这句话指的是 先将dist文件删除  然后在build出dist文件
    "build": "npm run clean && npm run build:client",
    // “webpack-dev-server” 热更新
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.client.js",
    // “rimraf” 这是删除文件以及文件夹 “rimraf dist” 删除更目录下dist文件夹以及里面的文件和文件夹
    "clean": "rimraf dist",
    // 执行eslint代码  “--ext” 代表哪些扩展名文件被eslint文件监控  “src/” src下所有这些带后缀的文件都被监控
    "lint": "eslint --ext .js --ext .jsx --ext .vue src/",
     // 自动修复eslint报的语法错
     "link-fix": "eslint --fix --ext .js --ext .jsx --ext .vue src/",
     // git 提交之前eslint检测一下，如果有语法错误不执行commit
     "precommit": "npm run lint"
  }
  
  
  // eslint 需要的插件 npm i eslint eslint-config-standard eslint-plugin-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node eslint-plugin-html -D 
  // eslint-loader babel-eslint 写代码是自动提示语法错误
  
  // 执行eslint报错 ：[ESLINT_LEGACY_OBJECT_REST_SPREAD] DeprecationWarning: The 'parserOptions.ecmaFeatures.experiment...
  // 解决方案 ： npm install eslint-config-standard@next 即可

```

# .editorconfig 解释
```text
root = true

[*]
charset = utf-8
end-of-line = 1f
indent_size = 2  // tab键采用2个空格
indet_style = space // tab键用空格代替 而不是用制表符
insert_final_newline = true // eslint要求文件最后一行需要添加空行，添加这句话会自动检测最后一行是否为空行，如果没有的话，保存的时候，自动添加一行空行
trim_trailing_whitespace = true // 在写代码是 最后一行有空格 自动删除空格
```

# webpack3.x ---> webpack4.x
1. 删除webpack相关插件
```
npm uninstall webpack webpack-dev-server webpack-merge -D
```

2. 下载webpack相关插件
```
npm install webpack webpack-dev-server webpack-merge webpack-cli -D
```
> webpack 启动的部分脚本都是放在 webpack-cli
