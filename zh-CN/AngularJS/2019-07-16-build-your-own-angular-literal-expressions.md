---
title: '实现angular[手记五]编译字面量表达式'
date: 2019-07-16T07:28:20.000Z
categories:
  - tech
tags:
  - angular
permalink: 2019-07-16-build-your-own-angular-literal-expressions
---

## 前言

目前的 MVVM 框架, 无论是 vue, react,还是 angular, 都拥有自己的模版, 如 vue-template, react 的 JSX, 这些模版肯定是无法被浏览器所识别的, 要将模版解析为 html, 需要用到的就是编译原理. 本书的第二部分, 我们一步步开始实现一个 parser. 内容循序渐进, 主要包括:

> - 字面量表达式
> - 属性查找和函数调用
> - 操作符表达式
> - 过滤器

在这一小节中, 我们需要实现的最为简单的功能, 也就是对**字面量表达式**的解析

想要实现一个完整的 parser, 我们需要了解模板解析的几个步骤: **词法分析-生成 ast 树-生成可执行代码**, 对应的三个工具为`Lexer`, `AST Builder`以及`AST Compiler`. 我们以`a + b`为例, 大致了解一下这三个部分分别是怎样的.

![](http://blog.chenxiaoyao.cn/image/build-your-own-angular/expression-parsing-pipeline.png)

## 语法图

参考 Javascript 语言精粹

## Lexer

Lexer 将输入字符串的逐个解析, 将字符串拆分成正确的部分, 生成 token 列表, 如`a + b`生成的是一个包含`a`, `+`, `b`的一个 tokens 列表, `42 - .8`应该生成的是`42`, `-`, `.8`而不是`4`,`2`,`-`,`.`,`8`, 为了正确地解析,需要根据不同数据类型进行区分,并交给特定的函数, 主要包括:

> - number, 整数, 小数(有无零开头), 科学计数, readNum
> - sting 字符串, 考虑转义的情况, readString
> - array,object,对象和数组, readIndent
> - identifier 标识符, 如对象属性值, this, true, false, null 等关键字,
> - 空白符: 直接去除

各数据的结构如下

```javascript
// number
{text: "1", value: 1}

// 字符串
{text: "="}
{text: ";"}

// 标识符
{text: "a", identifier: true}

```

具体的 lex 方法

```javascript
Lexer.prototype.lex = function (text) {
  this.text = text;
  this.index = 0;
  this.ch = undefined;
  this.tokens = [];

  while (this.index < this.text.length) {
    this.ch = this.text.charAt(this.index);
    // 数字
    if (
      this.isNumber(this.ch) ||
      (this.is('.') && this.isNumber(this.peek()))
    ) {
      this.readNumber();
      // 引号
    } else if (this.is('\'"')) {
      this.readString(this.ch);
      // 对象, 数组, 函数调用
    } else if (this.is('[],{}:.()=')) {
      this.tokens.push({
        text: this.ch,
      });
      this.index++;
      // 标识符
    } else if (this.isIdent(this.ch)) {
      this.readIdent();
      // 空白符
    } else if (this.isWhitespace(this.ch)) {
      this.index++;
    } else {
      throw 'Unexpected next character: ' + this.ch;
    }
  }

  return this.tokens;
};
```

我们以数字(单符号)和数组(多符号)两个典型来说明过程
先来看数字, 在 lex 中的使用了一个 index 来记录目前字符串被解析的进度, 并根据各类数值的特征进入相应的分支进行处理, 此时控制权交给 readNum 函数, 该函数负责将符合数字特征的块切出来, 具体做法是, 使用一个内部变量保存本次切割的数字, 通过控制 index 指针的移动, 将块切出来, 最后将切出来的块 push 到 tokens 数组中, 跳出循环, 将控制权交回给 lex 函数, 进行下一轮的类型判断

```javascript
Lexer.prototype.readNumber = function () {
  var number = '';
  while (this.index < this.text.length) {
    // 普通整数和小数
    var ch = this.text.charAt(this.index).toLowerCase();
    if (ch === '.' || this.isNumber(ch)) {
      number += ch;
    } else {
      // 科学计数法法
      var nextCh = this.peek();
      var prevCh = number.charAt(number.length - 1);
      if (ch === 'e' && this.isExpOperator(nextCh)) {
        number += ch;
      } else if (
        this.isExpOperator(ch) &&
        prevCh === 'e' &&
        nextCh &&
        this.isNumber(nextCh)
      ) {
        number += ch;
      } else if (
        this.isExpOperator(ch) &&
        prevCh === 'e' &&
        (!nextCh || !this.isNumber(nextCh))
      ) {
        throw 'Invalid exponent';
      } else {
        break;
      }
    }
    this.index++;
  }
  this.tokens.push({
    text: number,
    value: Number(number),
  });
};
```

对于数组和对象, 需要在后面生成 ast 的时候进行处理, 把`[`与`]`之间的内容拼接起来

```javascript
 else if (this.is('{},[]:')) {
    this.tokens.push({
        text: this.ch
    });
    this.index++;
}
```

## AST builder

生成抽象语法树

第一阶段生成的 tokens 列表会交给 AST Builder 进行进一步的处理, 返回 ast 树, 其主要的方法为 primary,

```javascript
AST.prototype.ast = function (text) {
  this.tokens = this.lexer.lex(text);
  // 返回ast
  return this.program();
};
// 每个代码片段都需要由{ type: AST.Program, body: xxx}的格式包裹
AST.prototype.program = function () {
  return { type: AST.Program, body: this.primary() };
};
```

primary 方法内部采用 array.shift 逐个对 token 队列进行处理,主要有五个分支

> - 数组, arrayDeclaration 方法, 生成数组
> - 对象, object 方法, 还原对象
> - 关键字, constants
> - 标识符(对象的 key)
> - 普通字面量(数字, 字符串): constants

每个分支生成对应的数据结构, 如 arrayDeclaration, 返回一个具有`type`和`elments`属性的对象, 前者标明数据的类型, 方便 compile 阶段的处理, 后者携带了数组的内容

```javascript
AST.prototype.arrayDeclaration = function () {
  var elements = [];
  if (!this.peek(']')) {
    do {
      if (this.peek(']')) {
        break;
      }
      elements.push(this.primary());
    } while (this.expect(','));
  }
  this.consume(']');
  return { type: AST.ArrayExpression, elements: elements };
};
```

再如`object`, 同样返回的是`type`和`properties`, `properties`是个数组, 元素的形式是`key:value`, 方便后续的处理

```javascript
AST.prototype.object = function () {
  var properties = [];
  if (!this.peek('}')) {
    do {
      var property = { type: AST.Property };
      // constant和primary都会去token列表中进行处理
      if (this.peek().identifier) {
        property.key = this.identifier();
      } else {
        property.key = this.constant();
      }
      this.consume(':');
      property.value = this.primary();
      properties.push(property);
    } while (this.expect(','));
  }
  this.consume('}');
  return { type: AST.ObjectExpression, properties: properties };
};
```

`expect`, `consume`, `peek`三个功能相似的辅助函数

```javascript
// 适用于多标记表达式, 看下一个标记是否是符合要求的, 符合的话从token列表中移除并返回该标记
AST.prototype.expect = function (e) {
  // e也可以不传
  var token = this.peek(e);
  if (token) {
    return this.tokens.shift();
  }
};
// 和expect一样, 只是标记未找到的时候会抛出异常
AST.prototype.consume = function (e) {
  var token = this.expect(e);
  if (!token) {
    throw 'Unexpected.  Expecting ' + e;
  }
  return token;
};
// 和expect一样, 区别在于只是简单返回, 并不对tokens数组进行处理
AST.prototype.peek = function (e) {
  if (this.tokens.length > 0) {
    var text = this.tokens[0].text;
    if (text === e || !e) {
      return this.tokens[0];
    }
  }
};
```

再回到主体的`primary`函数, 请留意其中的`while`语句

```javascript
// AST的主体处理
AST.prototype.primary = function () {
  var primary;
  if (this.expect('[')) {
    primary = this.arrayDeclaration();
  } else if (this.expect('{')) {
    primary = this.object();
  } else if (this.constants.hasOwnProperty(this.tokens[0].text)) {
    primary = this.constants[this.consume().text];
  } else if (this.peek().identifier) {
    primary = this.identifier();
  } else {
    primary = this.constant();
  }
  while (this.expect('.')) {
    primary = {
      type: AST.MemberExpression,
      object: primary,
      property: this.identifier(),
    };
  }
  return primary;
};
```

我们希望不仅能读取 scope 的属性, 还可以读取属性的属性, 如`parse('aKey.anotherKey');`, 经过上面的`while`循环, 生成的`ast`是这样的

```javascript
{
    type: 'Program',
    body:{
            type: 'MemberExpression',
            object: { type: 'Identifier', name: 'aKey' },
            property: { type: 'Identifier', name: 'anotherKey' }
        }
}
```

生成`ast`之后就到了`compile`阶段

## AST compiler

ASTCompile 类的主要职责是将 AST 生成函数字符串, 再通过 new Function 生成函数
主要方法为 compile 以及 recurse. 这里先介绍通过`new Function`生成函数的语法, 毕竟开发中很少以这样的方式定义函数.

> new Function ([arg1[, arg2[, ...argN]],] functionBody)

```javascript
var sum = new Function('a', 'b', 'return a + b');

console.log(sum(2, 6));
// expected output: 8
```

回到我们的`compile`以及`recurse`函数

```javascript
ASTCompiler.prototype.compile = function (text) {
  var ast = this.astBuilder.ast(text);
  this.state = { body: [] };
  this.recurse(ast);
  return new Function('s', this.state.body.join(''));
};
```

`recurse`函数按数据分类来处理我们的 ast 树

```javascript
ASTCompiler.prototype.recurse = function (ast) {
  var intoId;
  var self = this;
  switch (ast.type) {
    case AST.Program:
      // 递归调用
      this.state.body.push('return ', this.recurse(ast.body), ';');
      break;
    case AST.Literal:
      return this.escape(ast.value);
    case AST.ArrayExpression:
      var elements = _.map(ast.elements, function (element) {
        return self.recurse(element);
      });
      return '[' + elements.join(',') + ']';
    case AST.ObjectExpression:
      var properties = _.map(ast.properties, function (property) {
        var key =
          property.key.type === AST.Identifier
            ? property.key.name
            : self.escape(property.key.value);
        var value = self.recurse(property.value);
        return key + ':' + value;
      });
      return '{' + properties.join(',') + '}';
    case AST.Identifier:
      intoId = this.nextId();
      this.if_('s', this.assign(intoId, this.nonComputedMember('s', ast.name)));
      return intoId;
    case AST.ThisExpresssion:
      return 's';
    case AST.MemberExpression:
      intoId = this.nextId();
      var left = this.recurse(ast.object);
      this.if_(
        left,
        this.assign(intoId, this.nonComputedMember(left, ast.property.name))
      );
      return intoId;
  }
};
```

`parse('aKey.anotherKey')`最终生成的是这样的一个函数

```javascript
ƒ(s) {
    var v0, v1;
    if (s) {
        v1 = (s).aKey;
    }
    if (v1) {
        v0 = (v1).anotherKey;
    }
    return v0;
}
```

## Parser

串联三者, 主要是一个 parse 方法

parse 方法中先构造了一个 lexer 实例, 再将 lexer 传入 Parser 类生成 parser 实例, parser 实例化的过程中, 将传入的 lexer 传入 AST 类生成 ast 实例

```javascript
function Parser(lexer) {
  this.lexer = lexer;
  this.ast = new AST(this.lexer);
  this.astCompiler = new ASTCompiler(this.ast);
}

Parser.prototype.parse = function (text) {
  return this.astCompiler.compile(text);
};

// 主要的parse方法
function parse(expr) {
  var lexer = new Lexer();
  var parser = new Parser(lexer);
  return parser.parse(expr);
}
```

## 总结

- 表达式解析器内部分为三个步骤: 分词(Lexing), 抽象语法树构建(AST Building), 抽象语法树编译(AST compilation)
- 解析的结果是生成一个 Javascript 函数
- lexer 和 astBuilder 都是沿着线性结构(string 和数组)进行处理, ast-compiler 处理的树这种非线性结构, lexer 内部用 this.index 来标记当前处理, astBuilder 直接改变 token 数组,astCompiler 用的是树的深度优先遍历

- 分类处理, 简单的类型如 数字, 字符, 空白符, 布尔值和 null, 一个函数搞定, 复杂的类型如数组和对象, 需要递归构建

## 后序

### 说明

1. 接下来几个章节的实现仅仅实现了基本功能, 并没有实现错误处理逻辑, 这部分也是大头

2. 跟 Vue 一样, AngularJS 也有 JIT(动态编译, 直接在 head 引入 vue.js 文件)和 AOT(运行前编译, Vue-cli 单文件模式), 这里只实现了 JIT.

### 附录: AngularJS 表达式

![AngularJS Expressions](http://web-profile.net/wp-content/uploads/angular_expressions_cheatsheet.png)

(全文完, 感谢阅读)
