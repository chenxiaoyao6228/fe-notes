## 问题背景

在做白板 SDK 的时候, 元素的工具栏使用了`position: fixed`进行定位, 并且在计算位置的时候根据 canvas 的 offsetTop 做了抵消，本来没啥问题的， 但是后面为了做性能优化，使用了`will-change` + `transform`进行 GPU 加速, 导致工具栏的位置出现了偏移。

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .header {
        background-color: orange;
        height: 60px;
      }

      .board {
        height: 500px;
        overflow: hidden;
        background-color: yellow;
        /* 关键行 */
        /* transform: translateX(0); */
      }

      .menu {
        position: fixed;
        top: 60px;
        left: 0;
        width: 100px;
        height: 30px;
        background-color: red;
      }
    </style>
  </head>

  <body>
    <div class="page">
      <div class="header">header</div>
      <div class="board">
        board
        <div class="menu">menu</div>
      </div>
    </div>
  </body>
</html>
```

board没有开启transform的时候
![](../../cloudimg/2023/position-fixed-1.png)

board开启transform之后, 此时`menu`相对`board`元素进行定位，可以看到menu的位置已经发生了变化
![](../../cloudimg/2023/position-fixed-2.png)

经查询 MDN [文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)得知

> 元素会被移出正常文档流，并不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变。打印时，元素会出现在的每页的固定位置。fixed 属性会创建新的层叠上下文。当元素祖先的 transform、perspective、filter 或 backdrop-filter 属性非 none 时，容器由视口改为该祖先。