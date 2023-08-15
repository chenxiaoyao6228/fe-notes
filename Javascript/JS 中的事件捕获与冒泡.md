## 前言

本文主要理清 JS 中事件机制，内容包括:

- 如何查看事件的绑定
- 事件捕获与事件冒泡
- target 与 currentTarget
- 事件代理(事件委托)
- 阻止事件传播: stopPropagation与stopImmediatePropagation

这些属于比较基础的内容，但是对于理解一些高级概念如（React的事件合成机制）比较有用。

## 如何查看事件的绑定

### chrome开发者工具
现代浏览器的开发者工具提供了方便的功能来查看 DOM 元素上绑定的事件。在 Elements（元素）选项卡中，找到目标元素，然后查看右侧的事件监听器列表。你可以看到所有绑定在该元素上的事件及其处理函数。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/js-events-inspect-with-devtools.png)

### JS getEventListeners

通过JavaScript代码，我们可以直接检查元素上的事件监听器。对于DOM元素，可以使用以下方法:

```js
const element = document.getElementById('myElement');
const listeners = getEventListeners(element);
console.log(listeners);
```
其中，我们可以使用$0来获取通过开发者工具选中的元素。

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

## target与currentTarget
在事件处理程序中，可以通过事件对象来访问目标元素和当前正在处理事件的元素。

### event.target
`event.target`指向触发事件的实际元素，即事件最初发生的地方。在事件捕获和事件冒泡阶段，`event.target`始终保持不变。

`event.currentTarget`指向当前正在处理事件的元素，它是事件处理程序被绑定的元素。在事件捕获阶段，`event.currentTarget`始终是捕获阶段所在的元素。在事件冒泡阶段，`event.currentTarget`是冒泡阶段所在的元素。

理解`target`和`currentTarget`的区别对于事件委托至关重要。

## 事件代理（事件委托）
事件代理是一种利用事件冒泡的特性，将事件处理程序绑定在祖先元素上以处理子元素的技术。这种方法有很多优点：

- 减少内存消耗：只需一个事件处理程序，而不是为每个子元素都绑定处理程序。
- 动态元素支持：对于后来添加到DOM中的子元素，无需重新绑定事件处理程序。
- 更少的事件处理程序：特别适用于列表、表格等包含大量子元素的情况。

举个🌰: 
```js
// HTML
<ul id="myList">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

// JavaScript
const list = document.getElementById('myList');
list.addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    document.querySelector('.container').innerHTML = `点击了: ${event.target.textContent}`
  }
});
```
👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/event-bubble-capture/delegate.html)

## stopPropagation与stopImmediatePropagation
`stopPropagation` 和 `stopImmediatePropagation` 都是用于阻止事件传播的方法。区别在于:
- 当事件处理程序中调用 `event.stopPropagation()` 后，事件将不再传播到其他祖先元素或子元素.
- 当事件处理程序中调用`event.stopImmediatePropagation()`后，事件不仅会停止传播，还会阻止调用当前元素上后续的事件处理程序,换句话说，即使当前元素有其他绑定的事件处理程序，它们也不会执行。

在下面的demo中，如果调用`e.stopPropagation()`，那么打印为：        
>parent 捕获事件       
child 捕获事件       
child 冒泡事件 1       
child 冒泡事件 2       
child 冒泡事件 3       


如果调用`e.stopImmediatePropagation()`，那么打印为：       
>parent 捕获事件       
child 捕获事件      
child 冒泡事件 1       
child 冒泡事件 2       

```html
<!DOCTYPE html>
<html>
<head>
  <title>stopPropagation与stopImmediatePropagation</title>
</head>
<body>
   <div id="root">
    <div id="parent" >
      <button id="child">事件执行</button>
    </div>
  </div>

  <script>
     const root = document.querySelector('#root')
    const parent = document.querySelector('#parent')
    const child = document.querySelector('#child')

    parent.addEventListener('click', e => {
      console.log('parent 冒泡事件')
    })
    parent.addEventListener('click', e => {
      console.log('parent 捕获事件')
    }, true)

    child.addEventListener('click', e => {
      console.log('child 冒泡事件 1')
    })
    child.addEventListener('click', e => {
      e.stopPropagation()
      console.log('child 冒泡事件 2')
    })
    child.addEventListener('click', e => {
      console.log('child 冒泡事件 3')
    })

    child.addEventListener('click', e => {
      console.log('child 捕获事件')
    }, true)
  </script>
</body>
</html>
```

stopPropagation 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/event-bubble-capture/stopPropagation.html)

stopImmediatePropagation 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/event-bubble-capture/stopImmediatePropagation.html)
