// 打包图片资源配置
/**
 * 处理图片loader
 * url-loader  依赖于file-loader
 */

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
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            },
            {
                // 默认处理不了HTML中的img图片
                // 解决：使用html-loader 如下配置：
                test: /\.(png|jpg|gif)$/,
                // 使用一个loader
                loader: "url-loader",
                options: {
                    // 图片大小小于8kb,就会被base64处理
                    // base64优点：减少请求数量，缺点：图片体积会更大（文件请求更慢）
                    limit: 8 * 1024,
                    // 问题：url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs，解析时会出现[object Module]
                    // 解决：关闭url-loader的es6模块化，使用commonjs解析
                    // esModule: false,
                    // 给图片重命名
                    name: "[hash:10].[ext]"
                }
            },
            {
                test: /\.html$/,
                //    负责引入img,从而被url-loader进行处理
                loader: "html-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    mode: "development"
}