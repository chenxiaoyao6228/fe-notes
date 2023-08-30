## 前言

本节我们来理解下Vue的编译器的工作原理。

## 状态转换图

## 当状态机停止时

当解析器遇到开始标签时，它将标签推入父堆栈并启动新的状态机。当解析器遇到结束标签并且父堆栈中有与之相同名称的开始标签节点时，会停止当前正在运行的状态机。

```js
function isEnd(context, ancestors) {
  // 💥：终止条件：1. 输入源为空 2. 遇到父级结束标签
  if (!context.source.length) {
    return true;
  }
  const parent = ancestors[ancestors.length - 1];
  if (parent && context.source.startsWith(`</\${parent.tag}`)) {
    return true;
  }

  return false;
}
```

## 运行时编译器

### 问题1：运行时编译器的工作原理

```js
// 从 runtime-dom 导入所有函数（例如：toDisplayString、createElementVNode 等）
import * as runtimeDom from './runtime-dom';

function compileToFunction(template) {
  const { code } = baseCompile(template);
  const render = new Function('Vue', code)(runtimeDom);
  return render;
}
// 将其注册到全局编译器变量中
registerRuntimeCompiler(compileToFunction);
```

我们的模板

```js
const ast = baseParse('{{message}}');
```

将被编译为

```js
`"const { toDisplayString:_toDisplayString } = Vue
return function render(_ctx,_cache){return _toDisplayString(_ctx.message)}"`;
```

`Vue` 变量是通过以下方式注入的

```js
const render = new Function('Vue', code)(runtimeDom); // 所有导出的值都将分配给 `Vue`
```

`new Function` 的示例来自 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function)

```js
const sum = new Function('a', 'b', 'return a + b');
console.log(sum(2, 6)); // a = 2, b = 6
```

### 问题2：何时编译模板

问：何时注册运行时编译器？

答：在初始化设置之后（所有数据准备完毕后）

```js
function finishComponentSetup(instance: any) {
  const Component = instance.type;

  if (compiler && !Component.render) {
    if (Component.template) {
      Component.render = compiler(Component.template);
    }
  }
  instance.render = Component.render;
}
```

调用堆栈如下：

```js
(anonymous) (VM296:3)
compileToFunction (vue-tiny.esm.js:1243)
finishComponentSetup (vue-tiny.esm.js:322)
handleSetupResult (vue-tiny.esm.js:316)
setupStatefulComponent (vue-tiny.esm.js:309)
setupComponent (vue-tiny.esm.js:297)
mountComponent (vue-tiny.esm.js:674)
processComponent (vue-tiny.esm.js:655)
patch (vue-tiny.esm.js:433)
render (vue-tiny.esm.js:417)
mount (vue-tiny.esm.js:382)
(anonymous) (main.js:6)
```
