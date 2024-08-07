## 前言

本节总结了入门 canvas 绘图中的必须要理解的一些基础概念.

## GUI 绘图基础

初次尝试 canvas 的朋友可能会发现一些 Canvas 的 API 和其他的 web 开发的 API 有所不同，比如在 canvas 中绘制一个矩形，需要先调用`ctx.beginPath()`，然后调用`ctx.rect()`，最后调用`ctx.fill()`或者`ctx.stroke()`。而在其他的 web 开发中，比如使用 svg 绘制矩形，只需要调用`<rect>`标签即可。

这种差异是由于 Canvas 开发和传统的 web 开发存在思维范式上的区别，这样的区别是由于两者的 API 范式导致的。图形 API 可以分为 **保留模式(Retained mode) API** 和 **即时模式 API(Immediate Mode)**。

### 保留模式

![](https://learn.microsoft.com/zh-cn/windows/win32/learnwin32/images/graphics06.png)

**该模式几乎应用于所有的 GUI 系统中， 如 HTML DOM、Windows**。

保留模式 API 是声明性的(通过类似 HTML 的 DSL 进行描述)。 应用程序从图形基元（如形状和线条）构造场景。 图形库将场景的模型存储在内存中。 若要绘制框架，图形库会将场景转换为一组绘图命令。 在帧之间，图形库将场景保留在内存中。 若要更改呈现的内容，应用程序会发出命令来更新场景，例如添加或删除形状。 然后，该库负责重绘场景。

这种模式的 GUI 存在的问题是**性能**：创建和销毁 GUI 对象(通常它们是非常大的对象)导致内存占用高，UI 反应迟缓。因此需要通过额外的方式减少创建和销毁的对象数量(比如 React vdom)。同时必须编写大量代码来管理 GUI 对象的创建和销毁。(比如长列表需要做虚拟滚动)

### 立即模式

![](https://learn.microsoft.com/zh-cn/windows/win32/learnwin32/images/graphics07.png)

**绝大多数游戏是这类模式，我们的 Canvas API 也属于此类**

即时模式 API 是过程性的，每次绘制新框架时，应用程序都会直接发出绘图命令，图形库不会在帧之间存储场景模型。

其优点是： 不需要分配内存，不需要对必须管理的对象进行创建和销毁操作，没有状态，也不需要注册或响应的事件或回调， 即使使用非常复杂的 UI 并且只有单线程的情况下也能相对好的效果。

但这也就意味着一旦图形绘制到 canvas 之中，我们就无法对画布的图形进行修改了，**如果要实现对画布上元素的修改或者实现动效，唯一的方式就是重绘**。因此我们的 canvas 应用中都会有一个 draw 或者 paint 函数, 每次绘制的时候首先要通过 ctx.clearRect 清理画布，然后再进行绘制。

```js
draw(ctx){
    // 清理画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 执行绘制
}
```

还有就是某些东西在 canvas 中实现比较麻烦。比如说"事件系统"，我们不能像在 dom 元素上监听事件一样在 canvas 所渲染的图形内绑定各种事件。又比如说“绘制层级”，只能通过绘制时候的顺序和方式来处理层级。

立即模式的 API 更加底层，因此在基于实现复杂应用的时候必须构造一套类似 HTML DOM 面向对象系统 + 以及类似 CSS 的布局系统。看到这里大概就可以理解为什么绝大多数的 GUI 系统都是保留模式的了，框架已经帮你把脏活干完了。

## canvas 元素

可以通过 css 选择器获取 canvas 元素

## canvas 元素的 api

Canvas 本身提供了 API 不多，目前有以下几个

```
canvas.width: 获取元素的宽度
canvas.height: 获取元素的高度
canvas.getContext(): 获取元素的绘图环境，包括2d和3d
canvas.toDataURL: 返回一个base64格式的链接
canvas.toBlob: 创建一个用于表示此canvas元素图像文件的blob
```

## context 对象

## canvas 状态的保存与恢复

## 参考：

- https://en.wikipedia.org/wiki/Retained_mode
- https://en.wikipedia.org/wiki/Immediate_mode_GUI
- https://zhuanlan.zhihu.com/p/534695668
- 保留模式与即时模式：https://learn.microsoft.com/zh-cn/windows/win32/learnwin32/retained-mode-versus-immediate-mode
- SVG 与 Canvas: https://learn.microsoft.com/zh-cn/previous-versions/windows/internet-explorer/ie-developer/samples/gg193983(v=vs.85)?redirectedfrom=MSDN
- 前端 4 种渲染技术的计算机理论基础： https://cloud.tencent.com/developer/article/1920658
- GUI 架构的两种模式与四种更新页面的手法: https://www.jianshu.com/p/65189d9d7b89
- https://games.greggman.com/game/imgui-future/
- https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/save

> 本文首发于个人博客[前端开发笔记](https://github.com/chenxiaoyao6228/fe-notes)，由于笔者能力有限，文章难免有疏漏之处，欢迎指正
