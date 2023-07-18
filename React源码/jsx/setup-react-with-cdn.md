# 通过 CDN 使用 React

在 Vue 中，自带了 rumtime compiler, 这使得我们可以很容易的通过新建 html 文件验证我们的想法

React 之中使用的 jsx, 且不自带运行时的编译器， 浏览器并不能直接识别， 在进行本地 demo 演示的时候会比较麻烦。

但是实际上也是可以通过 CDN 的方式来使用的，具体方式如下:

## 示例代码

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>ReactJS Example</title>
    <script
      crossorigin
      src="https://unpkg.com/react@16.8.0/umd/react.development.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom@16.8.0/umd/react-dom.development.js"
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
    <!-- antd依赖了day.js -->
    <script src="https://cdn.jsdelivr.net/npm/dayjs/dayjs.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/antd/dist/antd.min.js"></script>
    <script src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
  </head>

  <body>
    <div id="root"></div>
    <script crossorigin type="text/babel">
      // createElement要保留，因为JSX最终会被转换成React.createElement()函数调用形式
      const { useState, createElement } = React;
      function MyComponent() {
        const [count, setCount] = useState(0);
        return (
          <div>
            <button onClick={() => setCount(count + 1)}>
              click times: {count}
            </button>
          </div>
        );
      }
      ReactDOM.render(<MyComponent />, document.getElementById("root"));
    </script>
  </body>
</html>
```

[具体见这里](../_demos/react-with-cdn/jsx-in-browser/)

## 常见 CDN 地址

### React

```html
// development
<script
  crossorigin
  src="https://unpkg.com/react@16.8.0/umd/react.development.js"
></script>
<script
  crossorigin
  src="https://unpkg.com/react-dom@16.8.0/umd/react-dom.development.js"
></script>

// production$$
<script
  crossorigin
  src="https://unpkg.com/react@17/umd/react.production.min.js"
></script>
<script
  crossorigin
  src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"
></script>
```

### Babel

```html
<script src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
```

### Lodash

```html
<script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
```

### Antd

```html
<!-- antd依赖了day.js -->
<script src="https://cdn.jsdelivr.net/npm/dayjs/dayjs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/antd/dist/antd.min.js"></script>
```

## Typesript 支持

```tsx
<!DOCTYPE html>
<html>

<head>
    <title>TSX Demo template</title>
</head>

<body>
    <div id="root"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.development.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.development.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/typescript/4.4.3/typescript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js"></script>

    <script type="text/typescript">
        const {useEffect} = React;

        //  CompA
         function CompA(props: { name: string }) {
            useEffect(()=>{
                console.log('11111')
            },[])
          return <h1>Hello, {props.name}!</h1>;
      }

       //  App
        function App(props: { name: string }) {
          return (<div>
                  <h1>Hello, {props.name}!</h1>
                  <CompA name="CompA" />
              </div>)
        }

        ReactDOM.render(<App name="App" />, document.getElementById('root'));
    </script>

    <script>
        // -------------编译执行TSX文件------------
        const scriptElement = document.querySelector(
            "script[type='text/typescript']"
        );
        const code = scriptElement.textContent || scriptElement.innerText;
        const transformedCode = Babel.transform(code, {
            presets: ["es2015", "react"],
        }).code;
        eval(transformedCode);
    </script>
</body>

</html>
```

[具体见这里](../_demos/react-with-cdn/tsx-in-browser/)
