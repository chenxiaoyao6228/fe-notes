## 前言

本文主要总结了 JS 中的执行原理，包括变量提升、调用栈、作用域以及闭包等。

## JavaScript 代码的执行流程

JavaScript 代码的执行流程分为两个阶段：**编译阶段**和**执行阶段**。

输入一段代码,经过编译后,会生成两部分内容: **执行上下文(Execution context)和可执行代码(字节码)**

其中执行上下文中会包含三个重要的属性: **变量对象(Variable object)、作用域链(Scope chain)和 this**

## 声明赋值、 变量对象 与 变量提升

先来看一段代码:

```js
var name = "york";
```

上面一段代码实际分为两个部分: **变量声明**和**变量赋值**

```js
var name = undefined;
name = "york";
```

对于函数声明,也是一样的,

```js
function showName() {
  console.log(name);
}
```

在 Javascript 的编译阶段,**变量**和**函数**会被存放到**变量对象**中, 变量的默认值会被设置为 **undefined**;

而变量对象，可以理解为一个存储变量的容器

```js
 {
    name: undefined,
    showName: <reference to function>
 }

```

在代码执行阶段,JavaScript 引擎会从变量环境中去查找自定义的变量和函数

### **变量提升**

在 JavaScript 代码执行阶段，JavaScript 引擎会将变量声明和函数声明提升到当前作用域的最前面。

```js
showName();
var name = undefined;
name = "york";
function showName() {
  console.log(name);
}
```

输出结果为

> 函数 showName 被执行
> undefined

我们可以下模拟变量提升后的代码

```js
var name = undefined;
function showName() {
  console.log(name);
}
name = "york";
showName();
```

## 调用栈与执行上下文

**调用栈**是一个用于存储函数调用的数据结构，它遵循"后进先出"（Last In, First Out，LIFO）的原则。每次函数调用都会将其调用记录（包括参数和局部变量）推入调用栈，函数执行完毕后将其弹出。

**执行上下文**是 JavaScript 代码执行时的运行环境，它会形成一个作用域，保存着当前代码执行时所需的所有变量对象、函数声明、参数等信息。

- 当 JavaScript 执行全局代码的时候,会编译全局代码并创建全局执行上下文,而且在整个⻚面的生存周期内,全局执行上下文只有一份
- 当调用一个函数的时候,函数体内的代码会被编译,并创建函数执行上下文,一般情况下,函数执行结束之后,创建的函数执行上下文会被销毁

以下面一段代码为例

```js
var a = 2;
function add(b, c) {
  return b + c;
}
function addAll(b, c) {
  var d = 10;
  result = add(b, c);
  return a + result + d;
}
addAll(3, 6);
```

当执行到 add 函数时，对应的调用栈如下图所示：

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/js-call-stack.png)

我们可以在浏览器中通过断点查看

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/js-call-stack-2.png)

## 作用域

**作用域**是指程序源代码中定义变量的区域。该位置决定了变量的生命周期。通俗地理解,作用域就是变量与函数的可访问范围,即作用域控制着变量和函数的可⻅性和生命周期。

在 ES6 之前,JavaScript 只有两种作用域: **全局作用域**和**函数作用域**，没有**块级作用域**。所以会出现以下的问题：

1. 变量提升导致的不确定性

在 ES5 及之前版本中，变量的声明会被提升到函数或全局作用域的顶部，这可能导致在变量声明之前引用变量时得到 undefined 的值。

```js
console.log(x); // undefined
var x = 5;
console.log(x); // 5
```

2. 污染全局命名空间

由于缺乏块级作用域，变量在整个函数内部可见，容易导致变量名的冲突和全局命名空间的污染。

```js
function example() {
  if (true) {
    var localVar = "I am local"; // 变量在整个函数内可见
  }
  console.log(localVar); // 可以访问 localVar，可能引发错误或不符合预期的结果
}
```

3. 无法正确封装变量

```js
for (var i = 0; i < 5; i++) {
  // i 在循环结束后仍然可见
}
console.log(i); // 5，i 被泄漏到全局作用域
```

### JS 是如何支持块级作用域的

ES6 引入了块级作用域，使用 let 和 const 声明变量

ES6 中添加了**词法作用域**, 它由代码中函数声明的位置来决定的,所以词法作用域是静态的作用域,通过它就能够预测代码在执行过程中如何查找标识符

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/js-call-stack-4.png)

**词法作用域**对应的环境成为**词法环境**。在变量查找的时候，优先从当前词法环境中查找，再从**变量环境**中去查找

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/js-call-stack-3.png)

而**作用域链**是由当前词法环境和上层词法环境的引用组成的，它的作用是保证变量和函数的有序访问。

- 所有的函数外层调用函数都指向一个全局的执行上下文
- 函数内部的作用域链指向函数外部的词法环境

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/js-call-stack-5.png)

## 闭包

**在 JavaScript 中,根据词法作用域的规则,内部函数总是可以访问其外部函数中声明的变量,当通过调用一个外部函数返回一个内部函数后,即使该外部函数已经执行结束了,但是内部函数引用外部函数的变量依然保存在内存中,我们就把这些变量的集合称为闭包。**

请看下面一段代码的例子：

```js
// 定义外部函数 outer
function outer() {
  var outerVar = "我是外部变量";

  // 定义内部函数 inner
  function inner() {
    console.log(outerVar); // 在内部函数中访问外部变量 outerVar
  }
  // 返回内部函数，形成闭包
  return inner;
}

// 调用外部函数，将返回的内部函数赋值给变量 closureFunction
var closureFunction = outer();

// 即使外部函数 outer 已经执行完成，closureFunction 仍然可以访问 outerVar
closureFunction(); // 输出： "我是外部变量"
```

在这个例子中，inner 函数形成了一个闭包，因为它引用了外部函数 outer 中的变量 outerVar。当 outer 函数被调用时，它返回了 inner 函数，这个返回的函数被赋值给变量 closureFunction。即使 outer 函数已经执行完成，closureFunction 依然可以访问并输出 outerVar，因为它形成了闭包。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/js-call-stack-6.png)

## this

JavaScript 的作用域机制并不支持**在对象内部的方法中使用对象内部的属性这一个普遍的需求**，为了解决这个问题，JavaScript 提供了 **this 关键字**。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/js-call-stack-7.png)

**this 是和执行上下文绑定的, 每个执行上下文中都有一个 this(分三种: 全局执行上下文中的 this(window)、函数中的 this 和 eval 中的 this)。**

1. 全局上下文中：

- 在全局上下文中，this 指向全局对象，通常是 window 对象（在浏览器环境中）。

2. 函数上下文中：
在函数内部，this 的值取决于函数是如何被调用的。

- 如果是作为普通函数调用，this 指向全局对象。
- 如果是作为对象的方法调用，this 指向调用该方法的对象。
- 如果使用构造函数（使用 new 关键字），this 指向新创建的实例对象。
- 如果使用 apply、call 或 bind 等方法来设置 this，this 将根据这些方法的参数进行设置。

## 参考

- [网络与浏览器: Chapter7- Chapter11]()
