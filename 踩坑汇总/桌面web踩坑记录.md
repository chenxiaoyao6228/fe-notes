## 前言

收集桌面web的踩坑

## ant design tooltip的换行问题
![](../../cloudimg/2023/antd-tooltip.png)

解决： 
```jsx
 overlayStyle={{ whiteSpace: 'pre' }}
```