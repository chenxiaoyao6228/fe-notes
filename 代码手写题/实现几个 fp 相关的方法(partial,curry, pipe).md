## 实现几个 fp 相关的方法

### partial

```js
/**
 * partial
 *
 * @param {*} fn
 * @return {*}
 */
function partial(fn) {
  let partialArgs = arguments.length > 1 ? [].slice.call(arguments, 1) : [];
  return function () {
    let args = partialArgs.concat([].slice.call(arguments));
    return fn.apply(fn, args);
  };
}
```

### partialRight

```js
/**
 * partialRight
 *
 * @param {*} fn
 * @return {*}
 */
function partialRight(fn) {
  let partialArgs = arguments.length > 1 ? [].slice.call(arguments, 1) : [];
  return function () {
    let args = [].slice.call(arguments).concat(partialArgs);
    return fn.apply(fn, args);
  };
}
```

### pipe

```js
/**
 * pipe函数
 *
 * @export
 * @param {*} fns
 * @return {*}
 */
function pipe(...fns) {
  return (arg) => {
    return fns.reduce((acc, fn) => fn(acc), arg);
  };
}
```

### currying

```js
function currying(fn, args = []) {
  return function temp(...innerArgs) {
    if (innerArgs.length > 0) {
      // 收集后面传入的参数
      args = [...args, ...innerArgs];
      // 返回函数供后面可以继续调用
      return temp;
    } else {
      const val = fn.apply(this, args);
      // 清空参数数组，为了保证下次执行函数可以继续迭代
      args = [];
      return val;
    }
  };
}
```

使用

```js
function add(...args) {
  //求和
  return args.reduce((a, b) => a + b);
}
const curriedAdd = currying(add);
```
