---
permalink: 2019-07-20-build-your-own-angular-cp8-filters


title: '实现 angluar 手记[八]过滤器'
date: 2019-07-20T09:15:32.000Z
categories:

- tech
tags:
- angular

---

## 前言

除了基本的 JS 表达式之外， AngularJS 还增加了过滤器表达式，其使用的是 `|`管道语法, Vue 也借鉴了相同的语法

过滤器函数接受一个表达式, 并且返回一个处理后的最终值, 左边接受的是原始的表达式, 右边接受的是过滤器函数

```js
myExpression | uppercase;
```

过滤器也可以组合

```js
myNumbers | odd | increment;
```

也就是我们将上面的表达式编译成一个函数

```js
function(myNumbers){
return increment(odd(myNumbers))
}
```

increment 函数要从哪里拿呢？将函数声明硬编码进内部？显然编译的时候我们需要有一个地方将 filter 收集起来，在运行的时候通过一个 getter 函数将对应的函数拿到

照葫芦画瓢，上面的例子我们可以在动态生成的函数中传入一个 filter getter 函数来动态拿到对应的 myNumbers 函数

```js
function anonymous(filter) {
  var v0 = filter("myNumbers"); // 通过filter函数工厂来动态获取filter函数
  var fn = function (s, l) {
    var v1;
    if (l && "aString" in l) {
      v1 = l.aString;
    }
    if (!(l && "aString" in l) && s) {
      v1 = s.aString;
    }
    return v0(v1);
  };
  return fn;
}
```

有了基本思路之后就可以开始干活了

## 过滤器的注册

```js
// 收集池
let filters = {};

// 注册
const register = (name, factory) => {
  let filter = factory(); // 为什么要使用factory呢？
  filters[name] = filter;
  return filter;
};

// 提取
const filter = (name) => filters[name];
```

## 过滤器的基本解析

简单的 test case 如下

```js
it("can parse filter expressions", () => {
  register("upcase", () => (str) => str.toUpperCase());
  let fn = parse("aString | upcase");
  expect(fn({ aString: "Hello" })).toEqual("HELLO");
});
```

对应的 AST

```js

{
type: 'Program',
body: [
{
type: 'CallExpression',
callee: { type: 'Identifier', name: 'upcase' },
arguments: [{ type: 'Identifier', name: 'aString' }],
filter: true
}
]
}
```

最终生成的函数

```js
(function anonymous(
  ensureSafeMemberName,
  ensureSafeObject,
  ensureSafeFunction,
  ifDefined,
  filter
) {
  var v0 = filter("upcase");
  var fn = function (s, l) {
    var v1;
    if (l && "aString" in l) {
      v1 = l.aString;
    }
    if (!(l && "aString" in l) && s) {
      v1 = s.aString;
    }
    ensureSafeObject(v1);
    return v0(v1);
  };
  return fn;
});
```

AST 的构建就是将左边的值作为自己的参数

```js
AST.prototype.filter = function () {
  var left = this.assignment();
  if (this.expect("|")) {
    left = {
      type: AST.CallExpression,
      callee: this.identifier(),
      arguments: [left],
      filter: true, // 标记是否为filter， filter不需要callContext
    };
  }
  return left;
};
```

ASTCompiler 中,

```js
case AST.CallExpression:
var callContext, callee, args;
if (ast.filter) {
callee = this.filter(ast.callee.name);
args = _.map(ast.arguments, function(arg) {
return this.recurse(arg);
}, this);
return callee + '(' + args + ')';
} else {
// ...
} break;

```

filter 函数使用 ID 来替代函数名

```js
ASTCompiler.prototype.filter = function (name) {
  var filterId = this.nextId();
  this.state.filters[name] = filterId; // filter存到了state中
  return filterId;
};
```

## 链式调用

```js
it("can parse filter chain expressions", () => {
  register("upcase", () => (s) => s.toUpperCase());
  register("exclamate", () => (s) => s + "!");
  let fn = parse('"hello" | upcase | exclamate');
  expect(fn()).toEqual("HELLO!");
});
```

```js
tokens = [
  { value: "hello", text: '"hello"' },
  { text: "|" },
  { text: "upcase", identifier: true },
  { text: "|" },
  { text: "exclamate", identifier: true },
];

ast = {
  type: "Program",
  body: [
    {
      type: "CallExpression",
      callee: { type: "Identifier", name: "exclamate" },
      arguments: [
        {
          type: "CallExpression",
          callee: { type: "Identifier", name: "upcase" },
          arguments: [{ type: "Literal", value: "hello" }],
          filter: true,
        },
      ],
      filter: true,
    },
  ],
};

fnString = `var v0=filter('exclamate'),v1=filter('upcase');
var fn=function(s,l){

return v0(v1('hello'));
};return fn;`;

fn = `function(s,l){
return v0(v1('hello')); // 这里
}`;
```

## 额外的 filter 参数

```js
it.only('can pass several additional arguments to filters', () => {
register('surround', () => {
return function (s, left, right) {
return left + s + right;
};
});
let fn = parse('"hello" | surround:"*":"!"');
expect(fn()).toEqual('*hello!');
});

this.tokens[
({ value: 'hello', text: '"hello"' },
{ text: '|' },
{ text: 'surround', identifier: true },
{ text: ':' },
{ value: '*', text: '"*"' },
{ text: ':' },
{ value: '!', text: '"!"' })
];

ast = {
type: 'Program',
body: [
{
type: 'CallExpression',
callee: { type: 'Identifier', name: 'surround' },
arguments: [
{ type: 'Literal', value: 'hello' },
{ type: 'Literal', value: '*' },
{ type: 'Literal', value: '!' },
],
filter: true,
},
],
};

fnString = `
var v0=filter('surround');
var fn=function(s,l){

return v0('hello','*','!');
};
return fn;`;

'fn.toString()' = `function(s,l){

return v0('hello','*','!');
}
`;
```

## 内置的 Filter 过滤器

```js
it("can filter an array with a predicate function", () => {
  let fn = parse("[1, 2, 3, 4] | filter:isOdd");
  let scope = {
    isOdd: function (n) {
      return n % 2 !== 0;
    },
  };
  expect(fn(scope)).toEqual([1, 3]);
});

tokens = [
  { text: "[" },
  { text: "1", value: 1 },
  { text: "," },
  { text: "2", value: 2 },
  { text: "," },
  { text: "3", value: 3 },
  { text: "," },
  { text: "4", value: 4 },
  { text: "]" },
  { text: "|" },
  { text: "filter", identifier: true },
  { text: ":" },
  { text: "isOdd", identifier: true },
];

ast = {
  type: "Program",
  body: [
    {
      type: "CallExpression",
      callee: { type: "Identifier", name: "filter" },
      arguments: [
        {
          type: "ArrayExpression",
          elements: [
            { type: "Literal", value: 1 },
            { type: "Literal", value: 2 },
            { type: "Literal", value: 3 },
            { type: "Literal", value: 4 },
          ],
        },
        { type: "Identifier", name: "isOdd" },
      ],
      filter: true,
    },
  ],
};

fnString = `
var v0=filter('filter');
var fn=function(s,l){
var v1;

if(l&&('isOdd' in l)){
v1=l.isOdd;
}
if(!(l&&('isOdd' in l)) && s){
v1=s.isOdd;
}
ensureSafeObject(v1);
return v0([1,2,3,4],v1);
`;
fn.toString = function (s, l) {
  var v1;

  if (l && "isOdd" in l) {
    v1 = l.isOdd;
  }
  if (!(l && "isOdd" in l) && s) {
    v1 = s.isOdd;
  }
  ensureSafeObject(v1);
  return v0([1, 2, 3, 4], v1);
};
```

## Filtering With Strings

In this chapter you’ve learned:
That filters are applied to expressions using the pipe operator |.
That Angular expressions don’t support bitwise operators, and that the bitwise OR would conflict with the filter
operator.
That filters are registered and obtained using the filter service.
How you can register several filters in bulk by giving the filter service an object. How filter expressions are
processed as call expressions by the AST builder and compiler.
That filter expressions have the lowest precedence of all expressions.
How the AST compiler generates JavaScript code to look up all the filters used in an expression from the filter service
at runtime.
How several filter invocations can be chained.
How additional arguments can be passed to filters, and how they’re given to the filter function as the second, third,
etc. arguments.
How the built-in filter filter works: With predicate functions, primitives, or objects as the filter expression. With
nested objects and arrays. With wildcard \$ keys, and with custom comparators.
