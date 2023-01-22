---

title: "underscore源码学习笔记(六)实现bind,call, apply"
date: 2019-06-28T16:27:31.000Z
categories:
  - tech
tags:
  - underscore
permalink: 2019-06-28-underscore-analysis-6-implement-bind
---

#### 一. bind 的实现

首先来看看 MDN 上对 bind 的定义
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181208031825830.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3podWFueWVtYW5vbmc=,size_16,color_FFFFFF,t_70)
bind 做了什么? 创建并返回一个函数,该函数被调用的时候 this 指向为 bind 中传入的参数

因此我们很容易想到用 apply 来模拟实现之

```js
Function.prototype.myBind = function(context) {
  var self = this;
  return function() {
    self.apply(context, arguments);
  };
};
//测试
var person = { name: "allen" };
var logName = function() {
  console.log(this.name);
};
var newLogName = logName.bind(person);
newLogName(); //'allen'
```

一切看起来都还不错,但是还要注意下面一句

> arg1, arg2, ...

当绑定函数被调用时，这些参数将置于实参之前传递给被绑定的方法。

因此我们要对我们的代码进行修改

```js
Function.prototype.myBind = function(context) {
  var self = this;
  var preArgs = Array.prototype.slice.call(arguments, 1); //也可以用for循环
  return function() {
    var args = Array.prototype.slice.call(arguments);
    self.apply(context, preArgs.concat(args));
  };
};
//测试
var person = {
  breakfast: "banner",
  lunch: "fish"
};

var meal = function(dinner) {
  return "daily meal: " + this.breakfast + ", " + this.lunch + ", " + dinner;
};

var threeMeals = meal.myBind(person);

console.log(threeMeals("beef")); //daily meal: banner, fish, beef
```

处理完上面两个问题,我们的 bind 方法就已经完成 80%了,但是还有一句

> 如果使用 new 运算符构造绑定函数，则忽略该值

用上面的代码来解释就是

```js
console.log(new threeMeals("beef")); //daily meal: undefined, undefined, beef
```

对于 new 操作符的处理,我们可以看看 MDN 上提出的针对旧浏览器的 pollyfill 方案,

```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError(
        "Function.prototype.bind - what is trying to be bound is not callable"
      );
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP = function() {},
      fBound = function() {
        // this instanceof fNOP === true时,说明返回的fBound被当做new的构造函数调用
        return fToBind.apply(
          this instanceof fNOP ? this : oThis,
          // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
          aArgs.concat(Array.prototype.slice.call(arguments))
        );
      };

    // 维护原型关系
    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype;
    }
    // 下行的代码使fBound.prototype是fNOP的实例,因此
    // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
    fBound.prototype = new fNOP();

    return fBound;
  };
}
```

#### 二. apply 的实现

如果时候再倒退一点,我们回到 ES3 以前,我们该如何模拟实现 apply 方法呢?首先还得看看 apply 做了些什么

```
*  改变函数this的指向为context
*  调用函数,调用时将参数传入函数本身并返回结果
```

我们再思考一下,出现 call,apply,bind 完全是因为函数的两种调用方式:普通函数调用和作为对象属性调用,
因此我们能想到的是在调用 call 的时候,将函数 fn 作为属性挂载到 context 对象上,并且以 contex.fn 的方式进行调用,
以确保 this 的正确性,同时在调用结束之后立马销毁刚刚新建的属性

```js
Function.prototype.myApply = function(context) {
     context.[fn.name] = this; //通过函数的name属性可以拿到函数名
     context.fn(arguments);
     delete context.fn;
}
```

但是我们仔细观察一下会发现: context.fn(arr)这种调用方式是不行的,原因是 arguments 是一个对象,而 fn 的参数是一个个单一的值,那有没有一种特殊的求值方式呢?有的!那就是 JS 中 eval 方法

> eval() 函数会将传入的字符串当做 JavaScript 代码进行执行。

举两个简单的栗子

```js
eval(new String("2 + 2")); // 返回了包含"2 + 2"的字符串对象
eval("2 + 2"); // returns 4
```

有了上面的思路,我们可以来改进我们的代码

```js
Function.prototype.myCall = function(context) {
  context[this.name] = this; //通过函数的name属性可以拿到函数名
  var args = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push("arguments[" + i + "]");
  }
  var result = eval("context[this.name](" + args + ")");
  delete context[this.name];
  return result;
};

//测试
var person = { firstName: "Allen", lastName: "Iverson" };
var logName = function() {
  console.log(this.firstName + " " + this.lastName);
};
logName.myCall(person); // 'Allen Iverson'
```

#### 三.apply 函数的实现

> call 方法的作用和 apply() 方法类似，只有一个区别，就是 call()方法接受的是若干个参数的列表，而 apply()方法接受的是一个包含多个参数的数组。

```js
Function.prototype.myApply = function(context, arr) {
  context[this.name] = this; //通过函数的name属性可以拿到函数名
  var args = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    args.push("arr[" + i + "]");
  }
  var result = eval("context[this.name](" + args + ")");
  delete context[this.name];
  return result;
};
```

本文最早发布于[CSDN](https://blog.csdn.net/zhuanyemanong/article/details/84889344)
