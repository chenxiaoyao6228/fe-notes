## 前言

由于中项目模块组件繁多，为了在面对部署模块的 bug 的时候能够快速找到对应的组件，内部统一使用了 React-dev-inspector 作为组件审查工具。
[体验地址](https://react-dev-inspector.zthxxx.me/)，本文来简单分析一下其工作原理以及启发:

- 接入步骤
- 具体原理
- 业务中的借鉴

## 接入步骤

接入主要包括三个部分的配置

### babel 配置

```js
 {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    include: path.resolve(__dirname, '../src'),
    loader: require.resolve('babel-loader'),
    options: {
    plugins: [
        !isEnvProduction && require.resolve('react-dev-inspector/plugins/babel'),
    ].filter(Boolean),
    },
}
```

### webpack

```js
const devConfig = {
  devtool: "eval-cheap-module-source-map",
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      middlewares.unshift(launchEditorMiddleware);
      return middlewares;
    },
    // ....
  },
};
```

### InspectorWrapper HOC

```ts
// 浏览器页面按住键盘组合键： 'shift', 'z', 'x', 唤起后点击元素，即可跳转到vscode
import { Inspector } from "react-dev-inspector";
const InspectorWrapper =
  process.env.NODE_ENV! === "development" ? Inspector : React.Fragment;

const AppWithInspector: React.FC<any> = ({ children }) => {
  return (
    <InspectorWrapper keys={["shift", "z", "x"]} disableLaunchEditor={false}>
      {children}
    </InspectorWrapper>
  );
};
export default AppWithInspector;
```

### .env.local

```
REACT_EDITOR=code // 指定对应的editor
```

使用时保证已经通过 vscode 的`install 'code' command in path`安装了环境变量

## 具体原理

上面几处配置具体分为对应不同的功能

### babel 解析

主要是遍历项目组件的 JSX 元素，分别加上必要的组件名, 代码行数等参数, 最终构建出来的组件的 html 是这样的

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/10/2019-10-29-13-33-36.png)

主要修改了JSX 中的JSXOpeningElement类型节点
```tsx
const doJSXOpeningElement: NodeHandler<JSXOpeningElement, { relativePath: string }> = (
  node,
  option,
) => {
  const { stop } = doJSXPathName(node.name);
  if (stop) return { stop };
  const { relativePath } = option;

  // 写入行号
  const lineAttr = jsxAttribute(
    jsxIdentifier('data‐inspector‐line'),
    stringLiteral(node.loc.start.line.toString()),
  );
  // 写入列号
  const columnAttr = jsxAttribute(
    jsxIdentifier('data‐inspector‐column'),
    stringLiteral(node.loc.start.column.toString()),
  );
  // 写入组件所在的相对路径

  const relativePathAttr = jsxAttribute(
    jsxIdentifier('data‐inspector‐relative‐path'),
    stringLiteral(relativePath),
  );
  // 在元素上增加这几个属性
  node.attributes.push(lineAttr, columnAttr, relativePathAttr);
  return { result: node };
};
```

### Inspector 组件

运行时监听用户的操作，弹出遮罩层以及在用户点击的时候发送向 dev-server 发起一个打开浏览器的请求， 通过浏览器可以看到发出的请求

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/10/2019-10-29-13-33-36.png)

- webpack 构建：启动 react‐dev‐utils 里的一个中间件,监听一个特定的路径,在本机服务端执行打开 VSCode 的指令

```js
// launchEditorEndpoint.js
module.exports = "/__open‐stack‐frame‐in‐editor";
const launchEditor = require("./launchEditor");
const launchEditorEndpoint = require("./launchEditorEndpoint");
module.exports = function createLaunchEditorMiddleware() {
  return function launchEditorMiddleware(req, res, next) {
    if (req.url.startsWith(launchEditorEndpoint)) {
      const lineNumber = parseInt(req.query.lineNumber, 10) || 1;
      const colNumber = parseInt(req.query.colNumber, 10) || 1;
      launchEditor(req.query.fileName, lineNumber, colNumber);
      res.end();
    } else {
      next();
    }
  };
};
```

## 业务中的借鉴

在开发内部国际化文案修改 chrome 插件的时候，借鉴了 Inspector 的方式，让用户去选择文案并更新
