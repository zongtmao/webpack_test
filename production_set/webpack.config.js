// 生产环境代码打包设置汇总(css, js, img, html等)

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
        filename: "js/built.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [...commonCssLoader]
            },
            {
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
                    ]
                }
            },
            {
                test: /\.(jpg|png|gif)/,
                loader: "url-loader",
                options: {
                    limit: 8 * 1024,
                    name: "[hash:10].[ext]",
                    outputPath: "images",
                    esModule: false // 处理HTML中img，需设置
                }
            },
            {
                // 处理HTML中img
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                // 其他文件处理
                exclude: /\.(js|css|less|html|jpg|png|gif)/,
                loader: "file-loader",
                options: {
                    outputPath: "fonts"
                }
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
            filename: "css/built.css"
        }),
        new OptimizeCssAssetsWebpackPlugin()
    ],
    mode: "production"
}