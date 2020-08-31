import "./css/iconfont.css";
import "./css/index.less";

import print from "./print.js";

print();

console.log("index.js被加载了");

function add(params) {
    return params;
}

console.log(add(10));

// 支持热更新代码，让HMR生效
if (module.hot) {
    module.hot.accept("./print.js", function() { //监听print.js
        console.log("代码发生了变化");
        print();
    })
}