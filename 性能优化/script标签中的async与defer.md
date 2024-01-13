## 前言

当浏览器解析 DOM 时候，遇到 script 标签时，会暂停 DOM 的解析，先加载并执行 script 中的代码，然后再继续 DOM 的解析。

比如

```html
<script>
  window.env = {
    version: "production",
  };
</script>
```

上面的代码的处理顺序如下:

> 1. 浏览器解析到 script 标签时，会暂停 DOM 的解析
> 2. 加载并执行 script 中的代码
> 3. 执行完毕后，触发 script 的 load 事件
> 4. 继续 DOM 的解析

这样会导致页面的加载和渲染被阻塞，影响用户体验。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/async-defer-1.png)

async 和 defer 是用于在 HTML 中加载外部 JavaScript 脚本的两个属性，它们可以帮助优化页面加载和脚本执行的顺序，从而提高页面的性能。

## defer

defer 是 HTML 解析完才会执行。如果是多个，按照**加载的顺序**依次执行。**defer 脚本会在 DOMContentLoaded 和 load 事件之前执行**

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/async-defer-2.png)

当脚本依赖其他脚本或需要在 DOM 解析后执行时，可以考虑使用 defer 属性.

一些使用场景：

- DOM 操作： 如果你的脚本需要操作页面的 DOM 元素，确保它在页面完全解析后再执行。这样可以避免在脚本执行时尝试访问尚未加载的 DOM 元素。

- 依赖其他脚本： 如果你的脚本依赖于其他已加载的脚本，为了确保**正确的执行顺序**，可以使用 defer。这样可以避免在依赖脚本未加载完成时尝试执行。

- 初始化代码： 如果你的脚本负责初始化应用程序或页面的某些功能，最好在 DOM 解析完成后再运行。这可以确保你的脚本在正确的上下文中执行，以免因为未完全加载的 DOM 而出现问题。

一个具体的业务使用场景是课件列表首页，二级页面课件解析需要依赖一个很大的 js 库，且该页面有很大概率被打开，这种情况下可以 defer 加载

## async

async 会在脚本加载完之后立即执行。如果是多个，执行顺序和加载顺序无关。async 会在 load 事件之前执行，但并不能确保与 DOMContentLoaded 的执行先后顺序。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/async-defer-3.png)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/async-defer-4.png)

当脚本不依赖其他脚本且不需要等待 DOM 解析时，可以考虑使用 async 属性.

- 分析或追踪代码： 如果你有一些用于分析用户行为或追踪页面性能的代码，这些代码通常不会直接操作 DOM，而是在页面加载时发送数据到服务器。这样的代码不会受到等待 DOM 解析的限制，可以使用 async 加载

- 独立组件： 如果你编写的 JavaScript 脚本是独立的组件，不依赖于其他脚本或 DOM 解析，可以使用 async。例如，一些独立的小部件或插件，它们可能只需要自己的逻辑而不涉及整个页面的结构

- 异步加载内容： 如果你希望在页面加载完成后异步加载一些内容（例如通过 AJAX 或 Fetch 请求），这些请求的响应不会影响页面的初始渲染，可以使用 async

## script

不是所有的 script 都需要加上 defer 或者 async 属性，需要根据实际情况来决定是否使用。

- 内联脚本： 如果你的脚本很小并且是内联的（即直接在 HTML 文件中嵌入），则它们会在解析到 script 标签时立即执行，不需要考虑 async 或 defer

- 不涉及 DOM 操作的脚本： 如果你的脚本只是进行一些计算或逻辑处理，与页面的 DOM 结构无关，那么加载顺序可能不是关键，你可以根据需要决定是否使用 async 或 defer。

- 脚本加载顺序无关紧要的情况： 如果脚本之间的加载顺序对页面的功能没有太大影响，也可以根据需要灵活选择是否使用 async 或 defer。

- 独立的脚本： 如果你的脚本是独立的，不依赖于其他脚本，而且也不需要等待 DOM 解析完成，可以考虑使用 async，或者将脚本放在页面的末尾，不使用 async 或 defer

## 总结

| 类型         | 执行顺序         | 是否阻塞执行 | 适用场景                       |
| ------------ | ---------------- | ------------ | ------------------------------ |
| script       | 在 HTML 中的顺序 | 是           | -                              |
| script defer | 在 HTML 中的顺序 | 否           | 依赖其他脚本/DOM 操作          |
| script async | 网络加载的顺序   | 否           | 三方工具/独立组件/异步加载内容 |
