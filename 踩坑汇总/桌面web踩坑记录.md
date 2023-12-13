## 前言

收集桌面web的踩坑

## antd tooltip的换行问题
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/antd-tooltip.png)

解决： 
```jsx
 overlayStyle={{ whiteSpace: 'pre' }}
```


## placeholder不居中的问题

一行css可以解决
```css
input:placeholder {
line-height: normal; 
}
```

## chrome下input自动填充背景色问题

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/chrome-auto-fill-background-color.png)

```css
// 移除输入框自动填充后的背景色
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  box-shadow: 0 0 0 30px white inset !important;
}
```


## pointerDown事件ipad端不触发fileInput

[Demo](./_demo/pointer-down-input-file/index.html)