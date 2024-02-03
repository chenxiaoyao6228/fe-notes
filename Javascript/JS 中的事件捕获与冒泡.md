## 前言

本文主要理清 JS 中事件机制，内容包括:

- 如何查看事件的绑定
- 事件捕获与事件冒泡
- target 与 currentTarget
- 事件代理(事件委托)
- 阻止事件传播: stopPropagation 与 stopImmediatePropagation

这些属于比较基础的内容，但是对于理解一些高级概念如（React 的事件合成机制）比较有用。

## 如何查看事件的绑定

### chrome 开发者工具

现代浏览器的开发者工具提供了方便的功能来查看 DOM 元素上绑定的事件。在 Elements（元素）选项卡中，找到目标元素，然后查看右侧的事件监听器列表。你可以看到所有绑定在该元素上的事件及其处理函数。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/js-events-inspect-with-devtools.png)

### JS getEventListeners

通过 JavaScript 代码，我们可以直接检查元素上的事件监听器。对于 DOM 元素，可以使用以下方法:

```js
const element = document.getElementById("myElement");
const listeners = getEventListeners(element);
console.log(listeners);
```

其中，我们可以使用$0 来获取通过开发者工具选中的元素。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/js-events-inspect-with-getEventListeners.png)

## 事件捕获与事件冒泡

在理解事件捕获与事件冒泡之前，首先需要了解事件传播的三个阶段：

- 捕获阶段（Capture Phase）：事件从文档根节点自上而下向目标元素传播。
- 目标阶段（Target Phase）：事件达到目标元素。
- 冒泡阶段（Bubble Phase）：事件从目标元素自下而上向文档根节点传播。

事件捕获和事件冒泡是为了实现事件传播的两种机制。

### 事件捕获（Capture）

在事件捕获阶段，事件从文档根节点自上而下依次触发所有元素的捕获事件，直到达到目标元素。这意味着祖先元素的事件处理程序将在目标元素的处理程序之前被调用。但是，在实际开发中，事件捕获并不常用，因为大多数情况下我们更关心事件冒泡。

### 事件冒泡（Bubble）

在事件冒泡阶段，事件从目标元素开始，依次向上冒泡触发祖先元素的事件处理程序，直到达到文档根节点。这意味着目标元素的事件处理程序将在祖先元素的处理程序之前被调用。事件冒泡是最常用的事件传播机制。

## target 与 currentTarget

在事件处理程序中，可以通过事件对象来访问目标元素和当前正在处理事件的元素。

### event.target

`event.target`指向触发事件的实际元素，即事件最初发生的地方。在事件捕获和事件冒泡阶段，`event.target`始终保持不变。

`event.currentTarget`指向当前正在处理事件的元素，它是事件处理程序被绑定的元素。在事件捕获阶段，`event.currentTarget`始终是捕获阶段所在的元素。在事件冒泡阶段，`event.currentTarget`是冒泡阶段所在的元素。

理解`target`和`currentTarget`的区别对于事件委托至关重要。

## stopPropagation 与 stopImmediatePropagation

`stopPropagation` 和 `stopImmediatePropagation` 都是用于阻止事件传播的方法。区别在于:

- 当事件处理程序中调用 `event.stopPropagation()` 后，事件将不再传播到其他祖先元素或子元素.
- 当事件处理程序中调用`event.stopImmediatePropagation()`后，事件不仅会停止传播，还会阻止调用当前元素上后续的事件处理程序,换句话说，即使当前元素有其他绑定的事件处理程序，它们也不会执行。

在下面的 demo 中，如果调用`e.stopPropagation()`，那么打印为：

```
parent 捕获事件
child 捕获事件
child 冒泡事件 1
child 冒泡事件 2
child 冒泡事件 3
```

如果调用`e.stopImmediatePropagation()`，那么打印为：

```
 parent 捕获事件
 child 捕获事件
 child 冒泡事件 1
 child 冒泡事件 2
```

```html
<!DOCTYPE html>
<html>
  <head>
    <title>stopPropagation与stopImmediatePropagation</title>
  </head>
  <body>
    <div id="root">
      <div id="parent">
        <button id="child">事件执行</button>
      </div>
    </div>

    <script>
      const root = document.querySelector("#root");
      const parent = document.querySelector("#parent");
      const child = document.querySelector("#child");

      parent.addEventListener("click", (e) => {
        console.log("parent 冒泡事件");
      });
      parent.addEventListener(
        "click",
        (e) => {
          console.log("parent 捕获事件");
        },
        true
      );

      child.addEventListener("click", (e) => {
        console.log("child 冒泡事件 1");
      });
      child.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log("child 冒泡事件 2");
      });
      child.addEventListener("click", (e) => {
        console.log("child 冒泡事件 3");
      });

      child.addEventListener(
        "click",
        (e) => {
          console.log("child 捕获事件");
        },
        true
      );
    </script>
  </body>
</html>
```

stopPropagation 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/event-bubble-capture/stopPropagation.html)

stopImmediatePropagation 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/event-bubble-capture/stopImmediatePropagation.html)

## 事件代理（事件委托）

事件代理是一种利用事件冒泡的特性，将事件处理程序绑定在祖先元素上以处理子元素的技术。这种方法有很多优点：

- 减少内存消耗：只需一个事件处理程序，而不是为每个子元素都绑定处理程序。
- 动态元素支持：对于后来添加到 DOM 中的子元素，无需重新绑定事件处理程序。
- 更少的事件处理程序：特别适用于列表、表格等包含大量子元素的情况。

举个 🌰:

```js
// HTML
<ul id="myList">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>;

// JavaScript
const list = document.getElementById("myList");
list.addEventListener("click", function (event) {
  if (event.target.tagName.toLocaleLowerCase() === "li") {
    document.querySelector(
      ".container"
    ).innerHTML = `点击了: ${event.target.textContent}`;
  }
});
```

👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/event-bubble-capture/delegate.html)

在上述代码中, target 元素则是在 #list 元素之下具体被点击的元素,然后通过判断 target 的一些属性(比如:nodeName,id 等等)可以更精确地匹配到某一类 #list li 元素之上;

但是该 API 可能有兼容性问题，使用的时候记得加 pollyfill

### 实现通用的 eventDelegate

下面我们来实现一个通用的 eventDelegate

```js
function eventDelegate(parentSelector, targetSelector, events, foo) {
  const parent = document.querySelector(parentSelector);

  if (!parent) {
    console.error(
      `Parent element with selector '${parentSelector}' not found.`
    );
    return;
  }

  parent.addEventListener(events, function (event) {
    const targetElement = event.target.closest(targetSelector);

    if (targetElement && this.contains(targetElement)) {
      foo.call(targetElement, event);
    }
  });
}

// 示例使用
eventDelegate("#myList", "li.li-2", "click", function (event) {
  // 处理事件的代码
  document.querySelector(
    ".container"
  ).innerHTML = `点击了: ${this.textContent}`;
});
```

### 事件委托的局限性

虽然事件委托在许多情况下是非常有用的，但也存在一些局限性：

- 只能处理冒泡阶段的事件：事件委托依赖于事件冒泡的机制。如果事件是在捕获阶段处理的，委托将无法捕获到这些事件。
- 不适用于所有类型的事件： 有些事件不能冒泡，例如 focus 和 blur 事件。对于这些事件，事件委托就无法使用。
- 涉及到 this 关键字的问题： 在事件处理程序中使用 this 关键字时，它通常指向触发事件的元素。但在事件委托中，this 可能会指向代理事件处理程序所附加的元素，而不是实际触发事件的元素。
