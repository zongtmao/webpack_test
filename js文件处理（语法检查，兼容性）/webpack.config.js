// ji语法检查
/**
 * 语法检查： eslint-loader eslint (依赖于它)
 * 注意只检查自己写的源代码，第三方库不需要检查 exclude: /node_modules/
 * 设置检查规则： 
 *      package.json 中eslintConfig中设置~
 *      airbnb(js规范库) --> eslint-config-airbnb-base 依赖于(eslint eslint-plugin-import) 
 * 第一步：去package.json中设置eslintConfig,如下
 *      "eslintConfig": {
            "extends": "airbnb-base"
        }
    第二步：写相关配置 
        //eslint-disable-next-line 下一行eslint所有规则失效即在js中设置下一行代码不进行eslint检查
    
*/

// js兼容性处理 babel-loader @babel/preset-env @babel/core 其中后面这个是依赖包
/**
 * 1.基础兼容： @babel/preset-env 只能转换基本语法，promise这些无法转换
 * 2.全部js兼容性处理：@babel/polyfill 使用：直接在js文件中用import "@babel/polyfill";即可
 *   问题：我只需解决部分兼容性问题，但是将所有兼容性代码全部引入，体积变大了
 * 3.需要做兼容性处理的就做：按需加载 --> core-js库,
 *   注意：使用corejs时，不能再用第二种方案
 */

//  js压缩：将mode:production 时会自动压缩
// html压缩：在HtmlWebpackPlugin中配置,如下：
/**
 * new HtmlWebpackPlugin({
     template: "./src/index.html",
    minify: {
        collapseWhitespace: true, //移除空格
        removeComments: true //移除注释
    }
})
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
        }, {
            // 其他资源 exclude:排除
            exclude: /\.(css|js|html)$/,
            loader: "file-loader"
        }, {
            // JS语法检查
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "eslint-loader",
            options: {
                fix: true //自动修复
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                // 预设：指示babel做怎样的兼容性处理
                presets: [
                    [
                        "@babel/preset-env",
                        // core-js配置
                        {
                            // 按需加载
                            useBuiltIns: "usage",
                            corejs: {
                                version: 3 //指定版本
                            },
                            // 指定兼容性做到那个版本浏览器
                            targets: {
                                chrome: "60",
                                firefox: "50",
                                ie: "9",
                                safari: "10",
                                edge: "17"
                            }
                        }
                    ]
                ]
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            minify: {
                collapseWhitespace: true, //移除空格
                removeComments: true //移除注释
            }
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