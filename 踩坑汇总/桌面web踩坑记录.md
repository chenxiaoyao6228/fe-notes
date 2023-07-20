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

## pointerDown事件ipad端不触发fileInput

[Demo](./_demo/pointer-down-input-file/index.html)