// 打包样式文件基础配置

/**
 * 打包基础样式文件需要css-loader, style-loader,
 *      其中 css-loader将css文件打包在common.js里，style-loader在HTML中创建style标签，并加载css样式
 * 打包less等文件，需要css-loader, style-loader, less-loader
 *      其中less-loader使用时要安装less依赖
 */

const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "build.js",
        path: path.resolve(__dirname, "dist")
    },
    // loader配置 module是个对象，里面是rules数组
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.less$/,
            use: ["style-loader", "css-loader", "less-loader"]
        }]
    },
    mode: "development"
}