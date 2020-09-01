// tree shaking 去除无用代码
/**
 * 前提：1、必须使用es6模块化 2、开启production环境
 * 作用：减少代码体积
 * 
 * 还可以在package.json中配置 "sideEffects": false //所有代码都没有副作用（都可以进行tree shaking）
 * 问题：可能会把css / @babel/polyfill这些文件干掉（引入了没用，被认为是副作用）
 * 解决："sideEffects": ["*.css"] //不对css tree shaking
 * 
 */

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //将css提取成单独文件
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");

// production时不需定义，因为默认就是production
process.env.NODE_ENV = "production";

// 复用loader
const commonCssLoader = [
    // "style-loader",
    MiniCssExtractPlugin.loader,
    "css-loader", {
        // 还需要在package.json中定义browserslist, 定义node环境变量
        loader: "postcss-loader",
        options: {
            ident: "postcss",
            plugins: () => [
                require("postcss-preset-env")()
            ]
        }
    }
];

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "js/built.[contenthash:10].js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [{
                // js校验
                // 需在package.json中设置eslintConfig --> airbnb
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: "pre", // 优先执行
                loader: "eslint-loader",
                options: {
                    fix: true
                }
            },
            {
                // 使用oneof,一下loader只会匹配一个，这样就不会每次都要过一遍loader，提升构建速度
                // 注意：不能有两个配置处理同一类型的文件，比如eslint-loader和babel-loader都是处理js,这时就需要将一个提取到外边
                oneOf: [{
                        test: /\.css$/,
                        use: [...commonCssLoader]
                    }, {
                        test: /\.less$/,
                        use: [
                            ...commonCssLoader,
                            "less-loader"
                        ]
                    },
                    /**
                     * 正常讲，一个文件只能被一个loader处理，
                     * 当一个文件要被多个loader处理时，一定要指定loader的执行先后顺序
                     * 先执行eslint  再执行babel
                     */
                    {
                        // 兼容性处理
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        useBuiltIns: "usage",
                                        corejs: {
                                            version: 3
                                        },
                                        targets: {
                                            chrome: "60",
                                            firefox: "50",
                                            ie: "9",
                                            safari: "10",
                                            edge: "17"
                                        }
                                    }
                                ]
                            ],
                            // 第二次构建时，会读取之前的缓存
                            cacheDirectory: true //开启babel缓存
                        }
                    }, {
                        test: /\.(jpg|png|gif)/,
                        loader: "url-loader",
                        options: {
                            limit: 8 * 1024,
                            name: "[hash:10].[ext]",
                            outputPath: "images",
                            esModule: false // 处理HTML中img，需设置
                        }
                    }, {
                        // 处理HTML中img
                        test: /\.html$/,
                        loader: "html-loader"
                    }, {
                        // 其他文件处理
                        exclude: /\.(js|css|less|html|jpg|png|gif)/,
                        loader: "file-loader",
                        options: {
                            outputPath: "fonts"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            // html压缩
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: "css/built.[contenthash:10].css"
        }),
        new OptimizeCssAssetsWebpackPlugin()
    ],
    mode: "production"
}