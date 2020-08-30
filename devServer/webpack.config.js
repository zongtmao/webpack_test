// devServer配置，代码用打包其他资源的代码
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "build.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            // 其他资源 exclude:排除
            exclude: /\.(css|js|html)$/,
            loader: "file-loader"
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    mode: "development",

    // 开发服务器：devServer 自动编译，自动打开浏览器，自动刷新浏览器
    // 特点：只会在内存中编译打包，不会有任何输出
    // 启动devServer指令：npx webpack-dev-server
    devServer: {
        // 项目构建后路径
        contentBase: path.resolve(__dirname, "dist"),
        // 启动gzip压缩
        compress: true,
        // 端口号
        port: 3000,
        // 自动打开浏览器
        open: true
    }
}