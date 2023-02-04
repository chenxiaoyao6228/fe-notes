---
title: "underscore源码学习笔记(二)几个helper函数"
date: 2019-06-28T16:24:59.000Z
categories:
  - tech
tags:
  - underscore
permalink: 2019-06-28-underscore-analysis-2-some-helper-functions
---

#### 上一结构我们使用到了几个 helper 函数,但是由于篇幅所致,我们集中精力在主要的函数上,这一节,我们来深入探讨一下这些函数

#### 一. isArrayLike()

我们都知道 js 中一切皆对象(array 当然也是),其中有一类特殊的对象,它们和数组一样带有 length 属性的并且可以通过索引值获取元素的对象.但是却不能用一些数组的方法，如 push,pop 等。比如我们常用的 arguments 就是 Array-Like Objects 的一种.

underscore 中提供了一种检测是否为类数组的方法

```js
var shallowProperty = function (key) {
  return function (obj) {
    return obj == null ? void 0 : obj[key];
  };
};

var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = shallowProperty("length");
var isArrayLike = function (collection) {
  var length = getLength(collection);
  return typeof length == "number" && length >= 0 && length <= MAX_ARRAY_INDEX;
};
```

源码简单明了,这里的 shallowProperty 使用了高阶函数和闭包的概念,接受一个 key 值,返回一个用户接受对象参数,获取对象 key 值的方法,比如

```js
var getAge = shallowProperty("age");
var Allen = { age: 18 };
var age = getAge(Allen); // 18
```

获取属性之后,检测 length 是否存在以及是否存在于某个合理的区间,这里的上界就是 MAX_ARRAY_INDEX, 关于这个值,我搜索后发现这样一段话:

> The maximum length until "it gets sluggish" is totally dependent on your target machine and your actual code, so you'll need to test on that (those) platform(s) to see what is acceptable.However, the maximum length of an array according to the ECMA-262 5th Edition specification is bound by an unsigned 32-bit integer due to the ToUint32 abstract operation, so the longest possible array could have 232-1 = 4,294,967,295 = 4.29 billion elements.

也就是根据 ES5 的规范,最大的数组长度应该是 2^32 ,至于作者为什么选择了, 2^53 - 1 这个值,本人暂时还没有探索出来,希望了解的同行批评指教

好了,了解什么是类数组之后,我们来看一下另外一个常见的问题: 如何将一个类数组转化为数组?网上大概有这几种思路

**1.Array.prototype.slice.call**

```js
function F(a, b) {
  var args = Array.prototype.slice.call(arguments);
  console.log(args);
}

F("allen", 18); //["allen", 18]
```

**2.也可以是使用[]代替 Array.prototype,但是由于新建了一个数组,性能肯定是差些的.**

```js
function F(a, b) {
  var args = [].slice.call(arguments);
  console.log(args);
}

F("allen", 18); //["allen", 18]
```

**3. ES6 的 Array.From 方法(Array.From 还有高级用法,有兴趣可以去 MDN 上查看)**

```js
function F(a, b) {
  var args = Array.from(arguments);
  console.log(args);
}

F("allen", 18); //["allen", 18]
```

4. **\_.toArray(list)作者使用了正则表达式进行匹配**

```js
var reStrSymbol =
  /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
// Safely create a real, live array from anything iterable.
_.toArray = function (obj) {
  if (!obj) return [];
  if (_.isArray(obj)) return slice.call(obj);
  if (_.isString(obj)) {
    // Keep surrogate pair characters together
    return obj.match(reStrSymbol);
  }
  if (isArrayLike(obj)) return _.map(obj, _.identity);
  return _.values(obj);
};
```

##### 二. \_.isObject: 判断参数是否为对象,返回布尔值,对象包含但不限于 Array, Function, Number, Date...

```js
_.isObject = function (obj) {
  var type = typeof obj;
  return type === "function" || (type === "object" && !!obj);
};

_.isObject(new Date()); //true
_.isObject([]); //true
```

#### 三. 判断具体的引用数据类型

判断具体引用数据类型最好的方法就是调用 Object.prototype.toString.call

```js
var ObjProto = Object.prototype;
(toString = ObjProto.toString),
  _.each(
    [
      "Arguments",
      "Function",
      "String",
      "Number",
      "Date",
      "RegExp",
      "Error",
      "Symbol",
      "Map",
      "WeakMap",
      "Set",
      "WeakSet",
    ],
    function (name) {
      _["is" + name] = function (obj) {
        return toString.call(obj) === "[object " + name + "]";
      };
    }
  );

_.isDate(new Date()); //"[object Date]"
_.isArray([]); //"[object Array]"
```

#### 四\_.keys:

```js
_.keys = function (obj) {
  if (!_.isObject(obj)) return [];
  if (nativeKeys) return nativeKeys(obj); //ES6中新增了Object.keys()
  var keys = [];
  for (var key in obj) if (has(obj, key)) keys.push(key); //循环遍历属性,逐个添加到返回的数组中
  // Ahem, IE < 9.
  if (hasEnumBug) collectNonEnumProps(obj, keys); //IE9以下有bug
  return keys;
};
```

对于 for...in 循环,MDN 上是这样解释的: for in 语句用于迭代对象的可枚举的,非 symbol 属性(ES6 新增)

> The for...in statement iterates over all non-Symbol, enumerable properties of an object.

对于各操作符的属性,[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)上有张图总结得很好
![emunerable](https://img-blog.csdnimg.cn/20181204115209755.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3podWFueWVtYW5vbmc=,size_16,color_FFFFFF,t_70)
IE9 以下使用 for..in 会导致某些 key 无法被正确拿到.因此 underscore 做了处理

```js
var ObjProto = Object.prototype;

//ie低版本得到的true
var hasEnumBug = !{ toString: null }.propertyIsEnumerable("toString");

//IE中无法被枚举的属性列表
var nonEnumerableProps = [
  "valueOf",
  "isPrototypeof",
  "toString",
  "propertyIsEnumerable",
  "hasOwnProperty",
  "toLocalString",
];

//给keys添加本该枚举的属性
function collectNonEnumProps(obj, keys) {
  //上述数组长度
  var nonEnumIdx = nonEnumerableProps.length;
  var constructor = obj.constructor;

  //obj的原型
  var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

  //单独处理constructor
  var prop = "constructor";

  //如果对象有constructor属性但keys数组中没有，就添加进来
  if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
  while (nonEnumIdx--) {
    prop = nonEnumerableProps[nonEnumIdx];
    if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
      keys.push(prop);
    }
  }
}
```

#### 五. _.property(path), _.propertyOf(obj),\_.matcher

\_.property 是接受一个具体的属性 path 或者代表查找层级的 path 的数组,返回一个接受对象的函数,当传入的可以为简单的字符串时,调用的是 shallowProperty 方法,去检测其是否具有这个 path,返回值为**布尔值**,当传入的 path 是一个数组的时候,会按照数组元素的顺序进行查找,找到则返回 value 值,找不到则返回 undefined

```js
var stooge = {name: 'moe'};
'moe' === _.property('name')(stooge);
=> true`

var stooges = {moe: {fears: {worst: 'Spiders'}}, curly: {fears: {worst: 'Moe'}}};
var curlysWorstFear = _.property(['curly', 'fears', 'worst']); //相当于stooges.curly.fears.worst
curlysWorstFear(stooges); //"Moe"
```

\_.propertyOf 刚好相反,接受一个对象,返回一个接受 key 的函数,返回 value 值

```js
var stooge = {name: 'moe'};
_.propertyOf(stooge)('name');
=> 'moe'
```

Returns a function that will return the specified property of any passed-in object
Inverse of \_.property. Takes an object and returns a function which will return the value of a provided property.

```js
var deepGet = function (obj, path) {
  var length = path.length;
  for (var i = 0; i < length; i++) {
    if (obj == null) return void 0;
    obj = obj[path[i]];
  }
  return length ? obj : void 0;
};

_.property = function (path) {
  if (!_.isArray(path)) {
    return shallowProperty(path);
  }
  return function (obj) {
    return deepGet(obj, path);
  };
};
```

参考:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties

本文最早发布于[CSDN](https://blog.csdn.net/zhuanyemanong/article/details/84785246)
