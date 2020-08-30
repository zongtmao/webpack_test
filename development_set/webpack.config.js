// 开发环境配置
/**
 * 处理js,css,html,图片，其他资源，文件目录输出配置等
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        // 打包后在dist文件夹里多一个js文件夹
        filename: "js/build.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [{
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                // 其他资源打包
                exclude: /\.(js|css|html|less|png|jpg|gif)$/,
                loader: "file-loader",
                options: {
                    name: "[hash:10].[ext]",
                    outputPath: "fonts" //其他资源打包后存放位置
                }
            },
            {
                // 处理图片资源
                test: /\.(png|jpg|gif)$/,
                loader: "url-loader",
                options: {
                    limit: 8 * 1024,
                    esModule: false, //关闭es6模块化，采用commonjs
                    name: "[hash:10].[ext]",
                    outputPath: "images" //指定打包后生成的文件夹，图片会放在images下面
                }
            },
            {
                // 负责引入img,从而被url-loader进行处理
                test: /\.html$/,
                loader: "html-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    mode: "development",
    // devServer配置
    devServer: {
        port: 3000,
        contentBase: path.resolve(__dirname, "dist"),
        compress: true,
        open: true
    }
}