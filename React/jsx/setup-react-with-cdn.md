# 通过 CDN 使用 React

在Vue中，自带了rumtime compiler, 这使得我们可以很容易的通过新建html文件验证我们的想法

React之中使用的jsx, 且不自带运行时的编译器， 浏览器并不能直接识别， 在进行本地demo演示的时候会比较麻烦。

但是实际上也是可以通过CDN的方式来使用的，具体方式如下

## 示例代码

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>ReactJS Example</title>
    <script crossorigin src="https://unpkg.com/react@16.8.0/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16.8.0/umd/react-dom.development.js"></script>
    <script src='https://unpkg.com/babel-standalone@6.26.0/babel.js'></script>
</head>

<body>
    <div id="root"></div>
    <script crossorigin type="text/babel">
        // createElement要保留，因为JSX最终会被转换成React.createElement()函数调用形式
        const { useState, createElement } = React;
        const { render } = ReactDOM;
        function MyComponent() {
            const [count, setCount] = useState(0);
            return (
                <div>
                    <button onClick={() => setCount(count + 1)}>click times:  {count}</button>
                </div>
            );
        }
        render(<MyComponent />, document.getElementById("root"));
    </script>
</body>

</html>
```

## 常见 CDN 地址

### React

```html
// development
<script crossorigin src="https://unpkg.com/react@16.8.0/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16.8.0/umd/react-dom.development.js"></script>

// production$$
   <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
   <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>

```

### Babel
```html
 <script src='https://unpkg.com/babel-standalone@6.26.0/babel.js'></script>
```


## Q: 
babel stand-alone 是如何工作的v