## 前言

实现 call, apply, bind

## call

```js
/**
 * 实现call方法
 *
 * @param {*} context
 * @return {*}
 */
function myCall(context) {
  context[this.name] = this; //通过函数的name属性可以拿到函数名
  var args = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push("arguments[" + i + "]");
  }****
  var result = eval("context[this.name](" + args + ")");
  delete context[this.name];
  return result;
}
```

## apply

```js
/**
 * 实现apply方法
 *
 * @param {*} context
 * @param {*} arr
 * @return {*}
 */
function myApply(context, arr) {
  context[this.name] = this; //通过函数的name属性可以拿到函数名
  var args = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    args.push("arr[" + i + "]");
  }
  var result = eval("context[this.name](" + args + ")");
  delete context[this.name];
  return result;
}
```

## bind

```js
/**
 * 实现一个bind方法
 *
 * @export
 * @param {*} fn
 * @param {*} context
 * @return {*}
 */
function myBind(fn, context) {
  return function () {
    return fn.apply(context, arguments);
  };
}
```
