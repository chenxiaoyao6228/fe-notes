---
permalink: 2019-07-21-build-your-own-angular-cp9-expressions-and-watches
title: "实现 angluar 手记[九]表达式与 watcher 结合"
date: 2019-07-21
categories:
  - tech
tags:
  - angular
---

## 表达式与 watcher 结合

在前面的章节中, `Scope.$watch`函数接受的`watchFn`仅仅是一个返回值的普通函数, 而本章节中表达式与 watcher 连接的关键点是将 watcher 中的`watchFn`替换成`parse(watchFn)`, 将 parse 生成的新函数作为 watchFn, 当然,我们也需要对应的对`$watchCollection`,`$eval`,`$apply`, `evalAsync`等方法做处理

```js
Scope.prototype.$watch = function (watchFn, listenerFn, valueEq) {
  var self = this;
  var watcher = {
    watchFn: parse(watchFn), // wathcCollection等方法也需要做一并处理
    listenerFn: listenerFn || function () {},
    last: initWatchVal,
    valueEq: !!valueEq,
  };
};
```

当然，parse 需要对传入的参数做处理， 如果已经是一个函数的话就直接返回

```js
function parse(expr) {
  switch (typeof expr) {
    case "string":
      var lexer = new Lexer();
      var parser = new Parser(lexer);
      return parser.parse(expr);
    case "function":
      return expr;
    default:
      return _.noop;
  }
}
```

## 字面量与常量表达式

优化： 标记 watcher 检测的表达式为常量还是变量(比如渲染一个列表)， 在第一次被触发的时候， 如果是常量就可以直接将 watcher 移除，这样在 digest 的过程中就不会遍历该 watcher(Vue 在编译的过程中也有相应的静态节点标记)

为此,我们明确两个概念:

- 字面量, 如 42, [42, 'abc'], [42, 'abc', aVariable]
- 常量,42, [42, 'abc']是常量,而[42, 'abc', aVariable]不是, 因为 aVariable 的存在

实现的方式是为 parse 生成的函数添加额外的参数, `literal`, `constant`,

### literal

先来看 literal

```js
// parse.js
ASTCompiler.prototype.compile = function(text) {
  ....
  fn.literal = isLiteral(ast);
}
```

这里, isLiteral 函数进行以下检测

- 一个空的 program(函数的 body 为空)是字面量
- 非空的 program, 其 body 只有一个表达式, 且表达式的类型为`array`或者`object`

### constant

常量的判断比较复杂, 需要递归地对每一个节点做判断, 只有当所有的节点都为常量的时候才是常量

```js
ASTCompiler.prototype.compile = function(text) {
  markConstantExpressions(ast);
  ....
  fn.constant = ast.constant; //
}
```

markConstantExpression 函数针对每类节点进行标记

```js
function markConstantAndWatchExpressions(ast) {
  var allConstants;
  var argsToWatch;
  switch (ast.type) {
  case AST.Program:
    allConstants = true;
    _.forEach(ast.body, function(expr) {
      markConstantAndWatchExpressions(expr);
      allConstants = allConstants && expr.constant;
    });
    ast.constant = allConstants; // 每一个节点都有constant属性
    break;
  case AST.Literal:
    ast.constant = true;
    ast.toWatch = [];
    break;
    ....
}
```

## 优化常量表达式的监测

常量表达式永远返回相同的值, 这也意味着常量表达式第一次被触发之后再也不会变"脏",因此我们可以移除相应的 watcher

`watch delegate`, 当 Scope.\$watch 中出现 watcher delegate 中的表达式的时候， 该代理会绕过正常的 watcher 创建的过程。

```javascript
function constantWatchDelegate(scope, listenerFn, valueEq, watchFn) {
  var unwatch = scope.$watch(
    function () {
      return watchFn(scope);
    },
    function (newValue, oldValue, scope) {
      if (_.isFunction(listenerFn)) {
        listenerFn.apply(this, arguments);
      }
      unwatch();
    },
    valueEq
  );
  return unwatch;
}
```

## One-Time Expressions

只执行一次的表达式: 比如列表项, 里面的内容一旦渲染之后就不会发生变化

```javascript
<li ng-repeat="user in users">
{{::user.firstName}} {{::user.lastName}}
</li>
```

## input-tracking

计算属性：a + b 当中的至少一个发生变化的时候，才触发更新

基本思路： 为数组，对象中的所有非常量建立一个 watchDelegate, 只有当其中的某个发生变化的时候，会触发更新

```js

```

## stateful Filters

带状态的过滤器

- 一般的过滤器我们默认为纯函数
- 特殊情况下过滤器可能是不纯的，比如一个过滤器以当前时间作为输出

```js

```

## External Assignment

```js

```
