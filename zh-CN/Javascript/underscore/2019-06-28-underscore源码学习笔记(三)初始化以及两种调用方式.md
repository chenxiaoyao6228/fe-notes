---

title: "underscore源码学习笔记(三)初始化以及两种调用方式"
date: 2019-06-28T16:25:49.000Z
tags: null
permalink: 2019-06-28-underscore-analysis-3-initialization
---

### 三.初始化以及两种调用方式

#### 1.IFEE 与全局作用域

众所周知,js 在早期是没有模块的,为了实现模块化,机智的前端程序员发明了使用立即执行函数(IIFE)来创建模块的方案,利用函数作用域创建一个类似沙箱的效果,达到仅仅暴露少量的对外接口,避免全局空间被污染的效果,因此你可以这么写

```js
(function() {
  var _ = "myUnderscore";
  var v = "innerVariable";
  window._ = _;
})();
console.log(_); //'myUnderscore'
console.log(v); //v is not defined ->内部变量不暴露
```

underscore 稍微复杂一点,通过传入 this 来改变函数的作用域,并将\_构造函数挂载传入的 this 上,

```
(function(){
  if(typeof exports !== 'undefined'){
        if(typeof module !== 'undefined' && module.exports){
            exports = module.exports = _;
        }
        exports._=_;
    }else{
        root._ = _;
    }
}.call(this));

//注:本文不考虑underscore在node端的使用,直接在浏览器中使用并调试
console.log(this === window) //true
```

#### 2.两种调用的方式

在浏览器载入 underscore.js 文件的时候,将\_这个变量挂载到 window 或者是 exports 上, 很多时候我们在调用 underscore 的都是使用其静态方法,如

```js
 _.each([1,2,3],function(item) {
  console.log(item)
 }
```

但我们也可以使用 oop 的调用方式,这样的好处之一是方便使用 chain 方法进行链式调用,写法上更加简洁.具体的使用下文会讲

```
 var _ = function(obj){
       if(obj instanceof _) return obj;
       if(!(this instanceof _)) return new _(obj);
       this._wrapped = obj;
 };
```

#### 3.变量保存

使用简短的命名保存原生的方法和属性,可减少在原型链中的查找次数(ps:后续也可少打不少字符)

```js
var ArrayProto = Array.prototype,
  ObjProto = Object.prototype;
var SymbolProto = typeof Symbol !== "undefined" ? Symbol.prototype : null;
var push = ArrayProto.push,
  slice = ArrayProto.slice,
  toString = ObjProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty;
var nativeIsArray = Array.isArray,
  nativeKeys = Object.keys,
  nativeCreate = Object.create;
```

#### 4.防止命名冲突

```js
var previousUnderscore = root._;

// 使用noConflict方法返回自身
_.noConflict = function() {
  root._ = previousUnderscore;
  return this;
};
```

### 四.OOP 与链式调用

前面提到,underscore 允许用户使用 oop 的方式进行调用,并且提供了 chain, value 来方便链式调用,还是拿官网的例子来说明问题;
\_.chain([1, 2, 3]).reverse().value();
调用的前两步是这样的:

```js
_.chain = function(obj) {
  var instance = _(obj);
  instance._chain = true;
  return instance;
};

var _ = function(obj) {
  if (obj instanceof _) return obj;
  if (!(this instanceof _)) return new _(obj); //这里的new方法做了什么?
  this._wrapped = obj;
};
```

当某个函数调用 chain 方法的时候,调用了一次构造函数,我们来看下当一个函数通过 new 关键字调用的时候究竟发生了什么?

- 创建一个新对象
- 将 this 指向这个对象,
- 将对象的隐秘的**proto**指向构造函数的 prototype 对象
- 返回这个对象

#### 但是要注意的是构造函数中可以显式地改变函数的返回值.

```js
var F = function(name) {
  this.name = name;
  return { age: 18 };
};
var f = new F("allen");
console.log(f); // { 'age' : 18}
```

返回的 instance 对象是这样的(过程的调用有点绕说实话...).
![underscore oop](https://img-blog.csdnimg.cn/20181203235045122.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3podWFueWVtYW5vbmc=,size_16,color_FFFFFF,t_70)
只有当通过创建对象的形式传入参数的时候才会初始化一系列的方法, 在进行 reverse 求值的时候,先把保存 wrapped 的数组拿出来求值,接着使用 chainResult 返回一个新的带有 chain 方法的对象

```js
// Add all mutator Array functions to the wrapper.
_.each(
  ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"],
  function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped; //上述列表中的操作都会改变原来的数组
      method.apply(obj, arguments); //注意求值后的obj已经变成了[3,2,1],并且是个普通的数组
      if ((name === "shift" || name === "splice") && obj.length === 0)
        delete obj[0];
      return chainResult(this, obj); //this是之前生成的instance,obj是变更后的数组
    };
  }
);

var chainResult = function(instance, obj) {
  return instance._chain ? _(obj).chain() : obj; //将[3,2,1]重新生成对象
};
```

value 方法取出结果

```js
_.prototype.value = function() {
  return this._wrapped;
};
```

本文最早发布于[CSDN](https://blog.csdn.net/zhuanyemanong/article/details/84788734)
