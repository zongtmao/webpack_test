// 缓存
/**
 * 1、babel缓存
 * 2、文件缓存：文件名后加hash值
 *    问题：因为js和css使用一个hash，如果重新打包会导致所有缓存失效（而我只改了一个文件）
 *    解决：chunkhash:根据chunk生成hash值，如果打包来源于同一个，那么hash就一样，但是即使配成chunkhash还是会一样，因为css是在js中引入的，属于同一个chunk
 *    终极解决：contenthash:根据文件的内容生成hash,不同的文件hash值肯定不一样
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