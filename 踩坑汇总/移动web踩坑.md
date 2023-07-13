## 前言

收集移动端web的踩坑

## ios的点击阴影问题

```css
* {
    -webkit-tap-highlight-color: transparent;
}
```

## ios端css设置的:hover样式失效，但是安卓端不会
需要把 :hover 更改为 :active，并在body标签上增加 ontouchstart  属性：

```html
<body ontouchstart>
  //...
</body>
```