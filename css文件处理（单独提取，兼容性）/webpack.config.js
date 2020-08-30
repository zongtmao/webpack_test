/**
 * css提起单独文件：mini-css-extract-plugin
 * css兼容性处理:1. postcss插件
 *              2. browserslist设置
 *              3. node环境变量设置，默认是生成环境
 * 
 * css压缩插件：optimize-css-assets-webpack-plugin
 */

//  设置node环境变量
process.env.NODE_ENV = "development";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 提取css插件：mini-css-extract-plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩css插件
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "js/build.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [{
            test: /\.css$/,
            // style-loader创建style标签
            use: [
                // "style-loader", 
                //使用MiniCssExtractPlugin时不需要这个style-loader，插件以link方式引入
                MiniCssExtractPlugin.loader,
                "css-loader",
                /**
                 * 兼容性处理 postcss --> postcss-loader postcss-preset-env
                 */
                //    使用loader默认写法
                // "postcss-loader" 不做修改的情况可以这么写，如果要改，就要用对象形式
                {
                    loader: "postcss-loader",
                    options: {
                        ident: "postcss", //固定写法
                        plugins: () => [
                            // 使用postcss插件
                            /*postcss-preset-env这个插件帮postcss在package.json中找到browserslist里面的配置
                             * 通过配置加载指定的css兼容样式
                             "browserslist": {
                                 "development": [
                                     "last 1 chrome version", //兼容最近的Chrome浏览器
                                     "last 1 firefox version",
                                     "last 1 safari version"
                                 ],
                                //  这个默认是看生成环境的兼容，跟下面的mode没有关系，
                                //所以要设置node环境变量：process.env.NODE_ENV = development
                                 "production": [
                                     ">0.2%", //兼容98%以上的浏览器
                                     "not dead",
                                     "not op_mini all"
                                 ]
                             }
                             */
                            require("postcss-preset-env")()
                        ]
                    }
                }
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "css/build.css" //打包后的css重命名
        }), //使用css提起插件
        new OptimizeCssAssetsWebpackPlugin() //使用css压缩插件
    ],
    mode: "development"
}