## 前言

给定下列 html 结构， 实现图示的分隔符效果

```html
<div class="list">
  <!-- itemA item个数可能为 0 或者多个, 且数量是动态的 -->
  <div class="item itemA"></div>
  <div class="item itemA"></div>
  <div class="separator separatorA"></div>
  <!-- item个数可能为 0 或者多个，  且数量是动态的 -->
  <div class="item itemB"></div>
  <div class="item itemB"></div>
  <div class="separator separatorB"></div>
  <!-- item个数可能为 0 或者多个， 且数量是动态的  -->
  <div class="item itemC"></div>
  <div class="item itemC"></div>
</div>
```

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/css-pre-sibling.png)

天真的处理方式使用兄弟选择器

```css
.separator {
  display: none;
}

.item + .separator {
  display: block;
}
```

麻烦的点在于 itemC 的如果为空话, 也会出现一条分隔线

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/css-pre-sibling-2.png)

如何让item感知到前面的seperator呢？要是有一个类似**前一个兄弟元素的选择器就好了**， 只需要判断item前面是否有separator即可。

```css
.item - .separator {
  display: block;
}
```
