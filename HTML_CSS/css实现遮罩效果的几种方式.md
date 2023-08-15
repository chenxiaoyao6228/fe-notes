## 前言

实现遮罩有两种思路, 一种是借助额外的标签, 另外一种是在弹窗本身上做手脚，本文将尝试使用不同的方式实现。

👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/HTML_CSS/_demo/css-overlay-effect/index.html)


## 绝对或定位

先来看第一种, 额外的 div 相对 body 绝对定位或者是 fixed 定位

hmtl 如下

```html
<html>
    <body>
        <div class="overlay overlay-absolute"></div>
        <div class="modal">
            <h2>我是弹窗</h2>
        <i class="closeBtn">&#x2716</i>
    </div>
    </body>
</html>
```

### 相对定位

```css
html,
body {
  height: 100%;
}
body {
  position: relative;
}
.overlay-absolute {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; //撑满页面
  height: 100%;
  z-index: 10; // 确保遮罩覆盖在其他元素上
  background-color: rgba(0, 0, 0, 0.5); //遮罩颜色
}
```

### 绝对定位

```css
.overlay-fixed {
  position: fixed;
}
```

使用 fixed 的好处是不用担心遮罩层在 html 的位置, 因为始终是相对于视窗的位置

## outline 或 boxshadow

第二种是使用 outline 或者 boxshadow 来对 modal 进行修饰

### 使用 outline

```css
.modal.outline {
  display: block;
  z-index: 10; /* 保持在其他元素上最上面 */
  outline: 9999px solid rgba(0, 0, 0, 0.5);
}
```

### 使用 box-shadow

```css
.modal.boxshadow {
  z-index: 10; /* 保持元素在页面其他元素之上*/
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}
```

## 参考资料

- [css-overlay-techniques](https://tympanus.net/codrops/2013/11/07/css-overlay-techniques/)
