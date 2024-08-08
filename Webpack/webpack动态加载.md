## webpack 动态加载

在使用 webpack + React 开发的时候，我们在路由级别进行代码分割，这样可以减少首屏加载的代码量，提升首屏加载速度。

代码是这样的

```js
const Editor = lazy(() =>
  import(/* webpackChunkName: "editor" */ "@/pages/Editor")
);
```

同时，在页面内有一些大型模块的时候，我们也会使用动态加载的方式，比如**用户点击按钮之后对页面进行截图**

```js
document.getElementById("btn").addEventListener("click", async () => {
  await import(/* webpackChunkName: 'html2canvas'*/ "html2canvas").then(
    ({ default: importRes }) => {
      // 触发截图
    }
  );
});
```

那么， webpack 是如何实现动态加载的呢？

## 案例

还是之前的案例，我们在`index.js`中引入了`minus.js`和`sum.js`，并且在点击按钮的时候，分别调用了`minus`和`sum`方法。

```js
const minus = require("./minus");

function component() {
  const element = document.createElement("button");

  element.innerHTML = "Hello webpack";

  element.addEventListener("click", () => {
    import("./sum").then(({ default: sum }) => {
      console.log(sum(1, 2));
    });
    console.log(minus(1, 2));
  });

  return element;
}

document.body.appendChild(component());
```

打包出来的 index.js 的代码如下:

```js
const minus = __webpack_require__(/*! ./minus */ "./src/minus.js");

function component() {
  const element = document.createElement("button");

  element.innerHTML = "Hello webpack";

  element.addEventListener("click", () => {
    // 🚧🚧:  看这里
    __webpack_require__
      .e(/*! import() */ "src_sum_js")
      .then(__webpack_require__.bind(__webpack_require__, "./src/sum.js"))
      .then(({ default: sum }) => {
        console.log(sum(1, 2));
      });

    console.log(minus(1, 2));
  });

  return element;
}

document.body.appendChild(component());

//# sourceURL=webpack://webpack-basic-bundle/./src/index.js?
```

可以看到，webpack 在打包的时候，会将动态加载的模块单独打包成一个 chunk，这个 chunk 的名字是 `src_sum_js`，

当点击了按钮之后，可以从网络面板里面加载这个 chunk，然后执行里面的代码。

```js
(self["webpackChunkwebpack_basic_bundle"] =
  self["webpackChunkwebpack_basic_bundle"] || []).push([
  ["src_sum_js"],
  {
    "./src/sum.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (/* binding */ sum)\n/* harmony export */ });\nfunction sum (a,b) {\n    return a + b;\n}\n\n//# sourceURL=webpack://webpack-basic-bundle/./src/sum.js?'
      );
    },
  },
]);
```

结合前面的 seaJS, requireJS 的经验，我们可以猜测大概率是创建 script， 然后动态加载

```js
__webpack_require__.l = (url, done, key, chunkId) => {
  if (key !== undefined) {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var s = scripts[i];
      if (
        s.getAttribute("src") == url ||
        s.getAttribute("data-webpack") == dataWebpackPrefix + key
      ) {
        script = s;
        break;
      }
    }
  }
  if (!script) {
    needAttach = true;
    script = document.createElement("script");

    script.charset = "utf-8";
    script.timeout = 120;
    if (__webpack_require__.nc) {
      script.setAttribute("nonce", __webpack_require__.nc);
    }
    script.setAttribute("data-webpack", dataWebpackPrefix + key);

    script.src = url;
  }
  inProgress[url] = [done];
  var onScriptComplete = (prev, event) => {
    // avoid mem leaks in IE.
  };

  script.onerror = onScriptComplete.bind(null, script.onerror);
  script.onload = onScriptComplete.bind(null, script.onload);
  needAttach && document.head.appendChild(script);
};
```

本节对应的代码在 `_demo/_webpack/dynamic-import` 目录下

> 本文首发于个人Github[前端开发笔记](https://github.com/chenxiaoyao6228/fe-notes)，由于笔者能力有限，文章难免有疏漏之处，欢迎指正