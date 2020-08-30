// 最基础的webpack配置 
/**
 * webpack本身能打包js跟json文件，图片，样式等资源需要loader实现
 */
const path = require("path");

module.exports = {
    // 入口文件
    entry: "./src/index.js",
    // 输出文件
    output: {
        filename: "build.js",
        path: path.resolve(__dirname, "dist")
    },
    // mode:模式
    mode: "development"
}