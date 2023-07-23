## 前言

样式处理是 wepback 中不可少的一部分，一般项目中的完整配置包括`styleName-loader`, `css-module-loader`, `less-loader`, `css-loader`, `style-loader`,

本节主要介绍这些插件的基本原理。

```js
const config = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ["style‐loader", "css‐loader", "less‐loader"],
      },
    ],
  },
};
```

## less-loader

less-loader 的原理比较简单,就是调用 less 库提供的方法,转译 less 语法后输出，下面摘取主要的实现部分

```js
const loaderUtils = require("loader-utils");
const less = require("less");
function loader(source) {
  const options = loaderUtils.getOptions(this) || {};
  const callback = this.async(); // 转译比较耗时，因此这里使用异步的方式
  options.filename = this.resource; // 不然无法解析index.less中 @import "./common.less"
  less.render(source, options, (err, { css, imports } = {}) => {
    if (err) {
      done(err);
      return;
    }
    imports.forEach(this.addDependency, this); // 收集.less文件中@import引入的文件
    callback(err, css);
  });
}
module.exports = loader;
```

## css-loader

css-loader 的作用主要是解析 css 文件中的@import 和 url 语句,处理 css-modules,并将结果作为一个 js 模块返回。

假如我们有 a.css、b.css、c.css:

```css
// a.css
@import "./b.css"; // 导入b.css
.a {
  font‐size: 16p x;
} 

// b.css
@import "./c.css"; // 导入c.css
.b {
  color: red;
} 

// c.css
.c {
  font‐weight: bolder;
}
```


```js
const postcss = require('postcss')
const loaderUtils = require('loader-utils')
const postcssImportParser = require('./plugins/postcss-import-parser')
const postcssUrlParser = require('./plugins/postcss-url-parser')
const { getImportCode, getModuleCode, getExportCode } = require('./utils')


async function loader(source){
  const callback = this.async();
  const options = {
    import:true,
    esModule:true,
    importLoaders:undefined,
    modules:false,
    sourceMap:false,
    url:true
  }

  // 处理 @import './common.css'
  const importPluginImports = [];
  const importPluginApi = [];
  const resolver = this.getResolve({});
  // 处理url(./2.png)
  const urlPluginImports = [];
  const replacements = [];

  const {
    resourcePath
  } = this;
  const result = await postcss([
    postcssImportParser({
      imports: importPluginImports,
      api: importPluginApi,
      resolver,
      context: this.context,
      // urlHandler: url => loaderUtils.stringifyRequest(this, url)
      urlHandler: url => {
        const loadersRequest = this.loaders.slice(this.loaderIndex, this.loaderIndex + 1).map(x => x.request).join("!");
        const req = `-!${loadersRequest}!`
        const comReq = req + url
        return loaderUtils.stringifyRequest(this, comReq)
      }
    }),
    postcssUrlParser({
      imports: urlPluginImports,
      replacements,
      context: this.context,
      resolver,
      urlHandler: url => loaderUtils.stringifyRequest(this, url)
    })
  ])
  .process(source, {
    hideNothingWarning: true,
    from: resourcePath,
    to: resourcePath,
    map: false
  })
  const imports = [].concat(importPluginImports).concat(urlPluginImports);
  const api = [].concat(importPluginApi);
  imports.unshift({
    importName: "___CSS_LOADER_API_IMPORT___",
    url: loaderUtils.stringifyRequest(this, require.resolve("./runtime/api"))
  });

  const importCode = getImportCode(imports)
  const moduleCode = getModuleCode(result, api, replacements)
  const exportCode = getExportCode(options)
  const str = `${importCode}${moduleCode}${exportCode}`
  console.log('===========my css loader==========')
  console.log(str)
  console.log('===========my css loader 2222==========')
  callback(null, str);

}
module.exports = loader

```


## style-loader

经过 css-loader 的转译,我们已经得到了完整的 css 样式代码,style-loader 的作用就是将结果以 style 标签的方式插入 DOM 树中, 主要源码如下：

```js
import loaderUtils from "loader‐utils";
module.exports = function (content) {
  // do nothing
};
module.exports.pitch = function (remainingRequest) {
  const requestPath = loaderUtils.stringifyRequest(
    this,
    "!!" + remainingRequest
  );

  return `    
            const content = require(${requestPath})     
            const style = document.createElement('style');  
            style.innerHTML = content;     
            document.head.appendChild(style);   
         `;
};
```
