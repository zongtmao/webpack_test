/**
 * 打包HTML里的资源，需要plugins: 下载 引入 使用
 * html-webpack-plugin 插件
 * 功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（js/css）
 * 需要结构时可配置模板，如下：
 */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "build.js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        // 复制了index.html文件，会自动引入js,css文件。注：自己再不需要引入
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    mode: "development"
}