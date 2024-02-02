## 前言

汇总 CSS 中的高频面试题，以及一些常见的 CSS 知识点。

## 盒模型

所有 HTML 元素都可以视为一个盒子，该盒子包括：边距(margin)、边框(border)、填充(padding)和实际内容(content)

### 标准模型（W3C 模型）和 IE 模型

差异：宽高计算方式不同

- 标准模型：计算元素的宽高只算 content 的宽高

- IE 模型：计算元素的宽高包含 content 、padding、border

### 如何设置两种模型

```css
div {
  // 设置标准模型
  box-sizing: content-box;
  // 设置IE模型
  box-sizing: border-box;
}
```

box-sizing 的默认值是 content-box

### JS 如何设置盒模型的宽高

假设已经获取节点 dom

```javascript
// 只能获取内联样式设置的宽高
dom.style.width / height;

// 获取渲染后即使运行的宽高，只支持IE
dom.currentStyle.width / height;

// 获取渲染后即时运行的宽高，兼容性很好
dom.getComputedStyle.width / height;

// 获取渲染后即使运行的宽高，兼容性很好，一般用来获取元素的绝对位置
dom.getBoundingClientRect().width / height;
```

## BFC

## 选择器优先级

1.  `!important`
2.  内联样式（1000）
3.  ID 选择器（0100）
4.  类选择器 / 属性选择器 / 伪类选择器（0010）
5.  元素选择器 / 关系选择器 / 伪元素选择器（0001）
6.  通配选择器（0000）

## link 和@import

- link 是从 html 引入的，@import 是从 css 引入的
- link 会在浏览器加载页面是同步加载 css；页面加载完成后再加载 @import 的 css
- 优先级 link > @import
- @import 是 css2.1 加入的语法，只有 IE5+ 才可识别，link 无兼容问题

## 伪类和伪元素

### 伪类

伪类用于当已有元素处于某种状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的。

比如：

- hover
- visited
- link

等等。

### 伪元素

伪元素用于创建一些不在文档树中的元素，并为其添加样式。

比如：`:before ` 来为一个元素前增加一些文本，并为这些文本增加样式。用户虽然可以看到这些文本，但是这些文本实际并不在文档树中。

### 区别

伪类的操作对象时文档树中已有的元素，而伪元素则创建一个文档树以外的元素。因此他们之间的区别在于：**有没有创建一个文档树之外的元素**。

CSS3 规范中要求使用双冒号(::) 表示伪元素，单冒号(:) 表示伪类

## 浮动与清除浮动

## 两栏布局

左边定宽,右边自适应方案:

- float + margin
- float + calc

```css
/* 方案1 */
.left {
  width: 120px;
  float: left;
}
.right {
  margin-left: 120px;
} /* 方案2 */
.left {
  width: 120px;
  float: left;
}
.right {
  width: calc(100% - 120px);
  float: left;
}
```

## 三栏布局

左右两边定宽, 中间自适应:

- float
- float + calc
- 圣杯布局 (设置 BFC , margin 负值法)
- flex

```css
.wrap {
  width: 100%;
  height: 200px;
}
.wrap > div {
  height: 100%;
}
/* 方案1 */
.left {
  width: 120px;
  float: left;
}
.right {
  float: right;
  width: 120px;
}
.center {
  margin: 0 120px;
}
/* 方案2 */
.left {
  width: 120px;
  float: left;
}
.right {
  float: right;
  width: 120px;
}
.center {
  width: calc(100% - 240px);
  margin-left: 120px;
}
/* 方案3 */
.wrap {
  display: flex;
}
.left {
  width: 120px;
}
.right {
  width: 120px;
}
.center {
  flex: 1;
}
```

## 水平垂直居中

- 定高: margin , position + margin (负值)
- 不定高: position + transform , flex , IFC + vertical-align:middle

```css
/* 定高方案1 */
.center {
  height: 100px;
  margin: 50px 0;
}
/* 定高方案2 */
.center {
  height: 100px;
  position: absolute;
  top: 50%;
  margin-top: -25px;
}
/* 不定高方案1 */
.center {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
/* 不定高方案2 */
.wrap {
  display: flex;
  align-items: center;
}
.center {
  width: 100%;
}
/* 不定高方案3 */
/* 设置 inline-block 则会在外层产生 IFC, 高度设为 100% 撑开 wrap 的高度 */
.wrap::before {
  content: "";
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}
.wrap {
  text-align: center;
}
.center {
  display: inline-block;
  vertical-align: middle;
}
```
