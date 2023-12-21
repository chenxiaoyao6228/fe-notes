## 前言

本节总结 CSS 相关的性能优化策略

## 内联首屏关键 CSS

将首屏关键 CSS 直接内联在 HTML 文档中，减少首次渲染时的请求延迟。

```html
<head>
  <style>
    /* 关键CSS规则 */
    body {
      margin: 0;
      padding: 0;
      font-family: "Arial", sans-serif;
      /* 其他关键样式 */
    }
  </style>
</head>
```

## 异步加载 CSS

使用 rel="preload"异步加载 CSS 文件，以减少首屏渲染的阻塞。

```html
<head>
  <link
    rel="preload"
    href="styles.css"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'"
  />
  <noscript><link rel="stylesheet" href="styles.css" /></noscript>
</head>
```

## css 文件压缩

用工具对 CSS 文件进行压缩，去除不必要的空格、注释，减小文件体积。

```bash
# 使用工具（例如UglifyCSS）压缩CSS文件
uglifycss input.css > output.min.css

```

## 合理使用选择器

避免使用过于复杂或冗长的选择器，选择器的匹配速度会影响页面性能。

```css
/* 不推荐：过于复杂的选择器 */
ul li:first-child a.active {
  color: #ff0000;
}

/* 推荐：简化选择器 */
.active-link {
  color: #ff0000;
}
```

## 减少使用昂贵的属性

尽量减少使用计算量大、触发回流和重绘的属性，如`position: absolute`, 而使用其他的方式替代

```css
/* 不推荐：频繁使用position: absolute */
.element {
  position: absolute;
  top: 10px;
  left: 20px;
}

/* 推荐：使用其他布局方式，避免频繁的重排和重绘 */
.element {
  margin-top: 10px;
  margin-left: 20px;
}
```

## 避免使用@import

避免使用@import 方式引入 CSS 文件，因为它会导致额外的请求，降低页面加载速度。

```html
<!-- 不推荐：使用@import引入CSS文件 -->
<style>
  @import url("styles.css");
</style>

<!-- 推荐：直接使用link标签引入CSS文件 -->
<link rel="stylesheet" href="styles.css" />
```
