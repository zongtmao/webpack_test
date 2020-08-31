# webpack性能优化
* 开发环境优化
* 生产环境优化

## 开发环境优化
* 优化打包构建速度
* 优化代码调试 source map
**HMR:**
在DevServer中设置hot:true即可
> 样式文件：直接可以使用HMR功能，因为style-loader里内部实现了，这也是所以为什么在开发环境使用style-loader，而生产环境需要考虑性能问题，不用style-loader

> js文件： 默认不能使用HMR，改变时同样会刷新整个页面  
    解决：修改js文件代码，添加支持HMR~
    注意：HMR功能对js的处理，只能处理非入口js文件的其他文件

```js
// 支持热更新代码，让HMR生效
if (module.hot) {
    module.hot.accept("./print.js", function() { //监听print.js
        console.log("代码发生了变化");
        print();
    })
}
```

> html文件：默认不能使用HMR并不能热更新
    解决：修改entry入口，将HTML引入entry: ["./src/index.js", "./src/index.html"],但是还是不能使用HMR，会整站更新，这也是合理的，因为HTML一般只有一个，它变就必须要更新


**source-map:**
是一种提供源代码到构建后代码映射的技术,在webpack.config.js中设置devtool: "inline-source-map"


### source-map 外部
    会生成单独的map文件: 错误代码准确信息和源代码的错误位置
### inline-source-map 内联
    直接在bulit.js里，只生成一个map资源，没有单独文件，但是它构建速度更快 
    错误代码准确信息和源代码的错误位置
### hidden-source-map 外部
    会生成单独的map文件：错误代码原因，但是没有错误位置，不能追踪到源代码位置 （线上推荐）
### eval-source-map
    也不会生成单独map文件，在built.js里，每个模块后面都会生成一个map代码
    错误代码准确信息和源代码的错误位置

### nosources-source-map 外部
    错误代码准确信息但是没有任何源代码信息（线上推荐）

### cheap-source-map 外部
    错误代码准确信息和源代码的错误位置，但只能精确到行，其他的可以追踪具体位置
### cheap-module-source-map 外部
    错误代码准确信息和源代码的错误位置

**结论：**
    开发环境：eval-source-map(推荐，vue-cli采用的)/cheap-module-source-map
        速度快(eval>inline>cheap>..)
            eval-cheap-source-map
            eval-source-map
        调试友好：
            ource-map
            cheap-module-source-map
            cheap-source-map
    生成环境：source-map (推荐)/cheap-module-source-map
        源代码需不需要隐藏，调试要不要更友好
        内联会让代码体积变大，所以生成环境不推荐使用
        source-map

        nosources-source-map 全部隐藏
        hidden-source-map 只隐藏源代码


## 生产环境优化
* 优化打包构建速度
* 优化代码运行的性能