# 实现 angluar 手记[六]属性查找和函数调用

## 前言

从上一章中我们知道编译的结果最终返回一个 Javascript 函数, 但是显然目前我们的函数只能够返回简单的值, 并不包含逻辑语句, 也不能接受参数, 本章我们来实现函数的属性查找和调用

属性查找分为非计算查找(`non-computed lookup`), 如`a.b` b 是已预知的 key, 与之相反的是计算查找(`computed-lookup`), 如`a[b]`, b 需要动态计算出来

## 非计算查找

最简单的 test case 如下

```js
let fn = parse("aKey");
expect(fn({ aKey: 42 })).toEqual(42);
```

如何能让函数接受参数?

```js
new Function("s", this.state.body.join(""));
```

ast-builder 添加处理

```js
else if (this.peek().identifier) {
  return this.identifier()
}
```

ast-compiler 添加处理

```js
case AST.Identifier:
  return this.nonComputedMember('s', ast.name)

ASTCompiler.prototype.nonComputedMember = function(left, right) {
  return '(' + left + ').' + right
}
```

最终编译出的函数是这个样子

```js
function(s){
  return s.aKey
}
```

- 自定义的 if\_语句

```javascript
ASTCompiler.prototype.if_ = function (test, consequent) {
  this.state.body.push("if(", test, "){", consequent, "}");
};
```

- 使用 uuid 来生成变量名 'v' + uuid

```javascript
this.state = { body: [], nextId: 0 };

ASTCompiler.prototype.nextId = function () {
  var id = "v" + this.state.nextId++;
  return id;
};
```

## vars 提升

## this 查找

直接返回 s 即可

```
case AST.ThisExpresssion:
    return 's';
```

## 非计算属性值查找

## 层叠属性

先看 test

```js
var fn = parse("aKey.anotherKey");
expect(fn({ aKey: { anotherKey: 42 } })).toBe(42);
```

```js
{
  type: AST.Program,
  body: {
    type: AST.MemberExpression,
    property: { type: AST.Identifier, name: 'fourthKey' },
    object: {
      type: AST.MemberExpresion,
      property: { type: AST.Identifier, name: 'thirdKey' },
      object: {
        type: AST.MemberExpression,
        property: { type: AST.Identifier, name: 'secondKey' },
        object: { type: AST.Identifier, name: 'aKey' }
      }
    }
  }
}
```

s 代表 scope, l 代表 locals

生成的 JS 是这样的

```js
function(s) {
  var v0, v1, v2, v3; if (s) {
  v3 = s.aKey; }
  if (v3) {
    v2 = v3.secondKey; }
  if (v2) {
    v1 = v2.thirdKey; }
  if (v1) {
    v0 = v1.fourthKey; }
  return v0;
}
```

## local

返回的函数接受第二个参数, locals, 参数查找的时候优先查找 locals, 找不到再去 scope 中查找, 最后编译出来的函数是这样

```js
function anonymous(s, l) {
  let v0, v1;

  if (l && "aKey" in l) {
    v1 = l.aKey;
  }
  if (!(l && "aKey" in l) && s) {
    v1 = s.aKey;
  }
  if (v1) {
    v0 = v1.anotherKey;
  }
  return v0;
}
```

## computed attribute lookup

## function call

最简单的 test case

```js
let fn = parse("aFunction(37, n, argFn())");
expect(
  fn({
    n: 3,
    argFn: () => 2,
    aFunction: function (a1, a2, a3) {
      return a1 + a2 + a3;
    },
  })
).toBe(42);
```

tokens

```js
[
  { text: "aFunction", identifier: true },
  { text: "(" },
  { text: "37", value: 37 },
  { text: "," },
  { text: "n", identifier: true },
  { text: "," },
  { text: "argFn", identifier: true },
  { text: "(" },
  { text: ")" },
  { text: ")" },
];
```

ast-builder

```js
// 新节点类型
primary = {
  type: AST.CallExpression,
  callee: primary,
  arguments: this.parseArguments(),
};
// parseArguments
parseArguments() {
    let args = []
    if (!this.peek(')')) {
      do {
        args.push(this.primary())
      } while (this.expect(','))
    }
    return args
  }
```

AST

```js
 {
  type: 'Program',
  body: {
    type: 'CallExpression',
    callee: { type: 'Identifier', name: 'aFunction' },
    arguments: [
      { type: 'Literal', value: 37 },
      { type: 'Identifier', name: 'n' },
      {
        type: 'CallExpression',
        callee: { type: 'Identifier', name: 'argFn' },
        arguments: []
      }
    ]
  }
}

```

ast-compiler

```js
case AST.CallExpression: {
        let callee = this.traverse(ast.callee)
        let args = ast.arguments.map(arg => {
          return this.traverse(arg)
        })
        return callee + '&&' + callee + '(' + args.join(',') + ')'
      }
```

最后生成的函数

```js
function anonymous(s, l) {
  var v0, v1, v2;

  if (l && "aFunction" in l) {
    v0 = l.aFunction;
  }
  if (!(l && "aFunction" in l) && s) {
    v0 = s.aFunction;
  }
  if (l && "n" in l) {
    v1 = l.n;
  }
  if (!(l && "n" in l) && s) {
    v1 = s.n;
  }
  if (l && "argFn" in l) {
    v2 = l.argFn;
  }
  if (!(l && "argFn" in l) && s) {
    v2 = s.argFn;
  }
  return v0 && v0(37, v1, v2 && v2());
}
```

## method calls

## 赋值

```js
it("can assign a nested object property", () => {
  let fn = parse("anArray[0].anAttribute = 42");
  let scope = { anArray: [{}] };
  fn(scope);
  expect(scope.anArray[0].anAttribute).toBe(42);
});
```

```js
[
  { text: "anArray", identifier: true },
  { text: "[" },
  { text: "0", value: 0 },
  { text: "]" },
  { text: "." },
  { text: "anAttribute", identifier: true },
  { text: "=" },
  { text: "42", value: 42 },
];
```

```js
{
  body: {
    type: 'AssignmentExpression',
    left: {
      type: 'MemberExpression',
      object: {
        type: 'MemberExpression',
        object: { type: 'Identifier', name: 'anArray' },
        property: { type: 'Literal', value: 0 },
        computed: true
      },
      property: { type: 'Identifier', name: 'anAttribute' },
      computed: false
    },
    right: { type: 'Literal', value: 42 }
  }
}
```

```js
function anonymous(s, l) {
  var v0, v1, v2;

  if (l && "anArray" in l) {
    v2 = l.anArray;
  }
  if (!(l && "anArray" in l) && s) {
    v2 = s.anArray;
  }
  if (v2) {
    v1 = v2[0];
  }
  if (v1) {
    v0 = v1.anAttribute;
  }
  return (v1.anAttribute = 42);
}
```

## Ensuring Safety In Member Access
