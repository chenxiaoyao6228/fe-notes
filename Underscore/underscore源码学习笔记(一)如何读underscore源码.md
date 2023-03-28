---
title: "underscore源码学习笔记(一)如何读underscore源码"
date: 2019-06-28T16:23:57.000Z
categories:
  - tech
tags:
  - underscore
permalink: 2019-06-28-underscore-analysis-1
---

### 一.前言

&emsp; 抛开计算机基础而言,对于前端的 js 的基础学习,无非就是两个方面,一个是浏览器暴露的 DOM,BOM,CSSOM 相关的 api,二是 js 语言本身的学习,而在 MV\*框架大行其道的今天,DOM 的操作实际上已经弱化了,很多时候前端工程师要做的仅仅是操作其中的数据部分(Value),并且通过框架绑定到相应的 Model 上.对于 js 的学习,最应该先掌握的也就是 js 基本的数据结构(数组,对象,字符串...),.如果是新入门的同行的话,推荐看看<JS 高程>上的相关部分,结合 leetCode 或者 FreeCodeCamp 去刷刷相应的算法题目,同时看看 underscore 的相关 api 并实现之.掌握了这些就能够应付基本的工作内容了.
&emsp; 其实半年前就已经敲了一遍 underscore 的源码,总结在自己的笔记上,但是一直没有总结发布出来,主要是觉得自己还没有真正理解为什么要这么设计?最近在学习函数式编程,有了一点小小的感悟,特此总结一下,一来作为自己的笔记参考,二来若能帮助到有需要的同行,那也是乐事一桩.
&emsp; 如何学习 underscore 源码?我是这么操作的.首先了解自己常用的 api,比如 map, reduce 等,再慢慢过渡到自己不常用的.其次是在学习的时候,到[underscore.js](https://underscorejs.org/)找到对应的例子,先去想如果是自己会怎么实现这个功能,然后 F12 打开控制台,一步步断点调试. 代码不是一步写成的,学源码的时候要揣摩作者重构代码的方式,抽象有什么好处?最后当然还免不了自己手打一遍,有时间的话自己重新造个类似的轮子.![underscore断点调试](https://img-blog.csdnimg.cn/20181202233542158.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3podWFueWVtYW5vbmc=,size_16,color_FFFFFF,t_70)

### 二. 从常用的 map, reduce,sortedIndex 开始

本来一开始这部分应该是 underscore 的初始化,但是考虑到本人打算将 underscore 的 OOP 链式调用与该部分关联,直接上会比较难以理解,还是从简单的场景入手,选取喜闻乐见的几个函数进行介绍

##### 1. map 函数 \_.map(list, iteratee, [context])

源码:

```js
_.map = _.collect = function (obj, iteratee, context) {
  iteratee = cb(iteratee, context); //这里返回的就是我们传入的 function(num){ return num * 3;}
  var keys = !isArrayLike(obj) && _.keys(obj), //工具方法,区分varray和object
    length = (keys || obj).length,
    results = Array(length);
  for (var index = 0; index < length; index++) {
    var currentKey = keys ? keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
};
```

map 有两种调用的方式,一种是传入 context(上下文),一种是不传上下文,对于前者我们拿官网的例子测试一下

```js
_.map([1, 2, 3], function (num) {
  v;
  return num * 3;
});
```

![map1](https://img-blog.csdnimg.cn/20181203001437834.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3podWFueWVtYW5vbmc=,size_16,color_FFFFFF,t_70)
可以看到当不传上下文的时候,,我们传入的迭代器函数是被 optimizeCb 直接返回的,根本没有进入下面的 switch 语句,那么什么时候我们会需要上下文呢?查了下[stackoverflow](https://stackoverflow.com/questions/4946456/what-is-context-in-eachlist-iterator-context),[pavel](https://stackoverflow.com/users/468725/pavel)这位答者给的答案很详细,这里借用他的例子:假设你有一个 basket 构造函数,里面有一个 addItem 方法,该方法每次只能接受一个参数并且 push 到内部的 items 列表中

```js
function basket() {
  this.items = [];
  this.addItem = function (item) {
    this.items.push(item);
  };
  this.show = function () {
    console.log("items: ", this.items);
  };
}

var x = new basket();
x.addItem("banana");
x.addItem("apple");
x.addItem("kiwi");
x.show();
```

现在问题来了: 如果你将一个列表的元素 push 到内部的 items 列表中该怎么办呢?你会想到 underscore 的 each 方法

```js
_.each(["banana", "apple", "kiwi"], x.addItem);
```

但是这样是行不通的,原因是 addItem 是 basket 的一个方法,而其作为一种方法被调用而不是纯函数调用的时候,就涉及到一个 this 的指向问题, 传入 each 的 addItems 调用的时候已经丢失了 this,变成了默认的 window,因此 this.items 的值是找不到的,这种情况下需要我们传递上下文对象

```js
_.each(["banana", "apple", "kiwi"], x.addItem, x);
```

下面我们可以来看下 optimizeCb 和 cb 函数

##### \* optimizeCb:该函数主要用来改变函数的上下文,返回特定的回调函数,添加 argCount 便于对不同参数的情况进行处理

case1: 适用与只有一个参数的情况, 如 sortedIndex
case2: 暂时没有用到,在 1.9.1 的版本中已经移除了
case3: 适用于 map,each 等迭代器函数
case4: 适用于 reduce,reduceRight 等函数

```js
var optimizeCb = function (func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1:
      return function (value) {
        return func.call(context, value);
      };
    case 2:
      return function (value, other) {
        return func.call(context, value, other);
      };
    case 3:
      return function (value, index, collection) {
        return func.call(context, value, index, collection);
      };
    case 4:
      return function (accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
  }
  return function () {
    return func.apply(context, arguments);
  };
};
```

##### \* cb

```js
var cb = function (value, context, argCount) {
  if (value == null) return _.identity;
  if (_.isFunction(value)) return optimizeCb(value, context, argCount);
  if (_.isObject(value)) return _.matcher(value);
  return _.property(value);
};
```

但是为什么要分这么多种情况呢?主要是为了旧浏览器的性能,[这个帖子](https://stackoverflow.com/questions/36162941/how-optimizecb-in-underscorejs-work)有提到

上述还有一点需要注意的是 void 0, stackoverflow 上刚好[有人提了这个问题](https://stackoverflow.com/questions/11409412/how-to-understand-return-obj-void-0-in-the-source-of-underscore)

> undefined is just a property of window object and is mutable. Hence void 0 is a trusted way to generate undefined across browsers

除了节省字节之外,最重要的是 underfined 是 window 的一个属性,并且是可变的,因此 underscore 的作者使用了 void 0 作为可靠的鉴别 underfined 的方式,有了这些,下面的实现其实很容易理解,就是遍历数组或者对象,将 callback 对这些逐一求值,返回需要的结果.

从中可以看出 underscore 的一些套路:

- 根据参数生成相应的回调
- 判断参数的类型
- 将回调用于参数求值

注:类型判断看起来不那么 functional, ramda 库的一位作者曾做了这样一个演讲[hey,underscore, you are doing wrong](https://www.youtube.com/watch?v=m3svKOdZijA&app=desktop) 有兴趣可以去看看

##### 2.sortedIndex: 改函数返回参数在排序数组中的索引位置

还是官网的例子:

```js
_.sortedIndex([10, 20, 30, 40, 50], 35);
```

![sortedIndex](https://img-blog.csdnimg.cn/20181203003453240.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3podWFueWVtYW5vbmc=,size_16,color_FFFFFF,t_70)
没有太难的地方,该函数使用二分查找的方法,从首尾的平均数求中值,然后再进行判断

#### 3.reduce

```js
var createReduce = function (dir) {
  // Wrap code that reassigns argument variables in a separate function than
  // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
  var reducer = function (obj, iteratee, memo, initial) {
    var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys || obj).length,
      index = dir > 0 ? 0 : length - 1;
    if (!initial) {
      memo = obj[keys ? keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  return function (obj, iteratee, memo, context) {
    //真正传值的函数
    var initial = arguments.length >= 3;
    return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
  };
};

// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
_.reduce = _.foldl = _.inject = createReduce(1);
```

由于 reduce 和 reduceRight 有公用的逻辑,因此作者抽象出来一个 createReducer 函数处理公共的逻辑,通过传入 dir 参数返回真正接受用户参数的函数,reducer 函数也是按照之前的套路: 生成回调,参数判断,求值.

**本部分完, 感谢阅读!**

参考:

- [what-is-context-in-eachlist-iterator-context](%28https://stackoverflow.com/questions/4946456/what-is-context-in-eachlist-iterator-context%29)
- [how-optimizecb-in-underscorejs-work](https://stackoverflow.com/questions/36162941/)
- [how-to-understand-return-obj-void-0-in-the-source-of-underscore](https://stackoverflow.com/questions/11409412/how-to-understand-return-obj-void-0-in-the-source-of-underscore)

本文最早发布于[CSDN](https://blog.csdn.net/zhuanyemanong/article/details/84724488)
