---
title: 实现angular手记[三]监听集合
categories:
  - tech
tags:
  - angular
permalink: 2019-07-14-build-your-own-angular-3-watch-collections
---

## 前言

本章要实现`$watchCollection`方法, 实现集合(数组,非数组的其他对象)以及基本数据类型的监听

大致分类为:

- 数组与类数组对象(argument 参数, DOM NodeList)
- 其他普通对象(Date, Plain Object, ....)
- 基本数据类型

```js
// internalListenerFn
// 对象的处理
 if (utils.isObject(newValue)) {
   if (utils.isArrayLike(newValue)) {
      // 数组, arguments, NodeList
    }else{
      // 普通对象
    }
  else {
    // 普通基础类型
  }
```

## 基本原理

我们的`$watchCollection`最终依赖的是还是我们原来的`$watch`实现,

```js
return this.$watch(internalWatchFn, internalListenerFn);
```

回想下`watchFn`和`listenerFn`

- 每次 digest 的时候, watchFn(scope) 需要返回一个值, 通过和上一个返回的值进行比较, 得知数据是否发生变更, listener 函数去更新视图

- listener 函数在被调用的时候需要知道 oldValue, newValue

实现方法是:

- internalWatchFn 和 internalListenerFn 对 watchFn 和 listenerFn 进行装饰

- internalWatchFn 内部调用 watchFn 可以得到 newValue 值, 而上次的 oldValue 值可以保存在当前的函数作用域里面, 样 internalListenerFn 在被调用的时候就可以拿到对应的值, 最后返回一个 changeCount 标志值是否发生改变.

```js
$watchCollection(watchFn, listenerFn) {
    let newValue, oldValue
    let changeCount = 0
    let internalWatchFn = scope => {
      newValue = watchFn(scope)

      // 检查变化
      if (this.$$areEqual(oldValue, newValue, false)) {
        changeCount++
      }

      return changeCount // 是否变化
    }
    let internalListenerFn = () => {
      listenerFn(newValue, oldValue, this)
    }

    return this.$watch(internalWatchFn, internalListenerFn)
  }

```

通过上面的简单实现我们已经能够处理对基本数据类型的处理, 接下来才是 array 和 object, 主要的处理逻辑在 InternalWatchFn 中, 参考前言部分

## 监听数组变化

作者进行了一下划分

- 类型改变: 非数组转数组, 数组转非数组
- 新增/移除元素: 长度发生改变
- 元素换序, 遍历检测数组中每个元素的值是否相等

```js
if (_.isArray(newValue)) {
  // 非数组变为数组, 初始化数组
  if (!_.isArray(oldValue)) {
    changeCount++;
    oldValue = [];
  }
  // 将新值挪到旧值上面保存
  if (newValue.length !== oldValue.length) {
    changeCount++;
    oldValue.length = newValue.length;
  }
  newValue.forEach((newItem, index) => {
    let bothNaN = _.isNaN(newItem) && _.isNaN(oldValue[index]);
    if (!bothNaN && newItem !== oldValue[index]) {
      changeCount++;
      oldValue[index] = newItem;
    }
  });
} else {
  //....
}
```

对于复合数据类型保存的是引用, 如果直接使用`oldValue = newValue`的形式, oldValue 和 newValue 指向的是同一引用, 即使一个对象内部发生了变化, 我们也是不能判断出来的

因此第一次为`oldValue`赋值的时候, 并没有把 oldValue 直接赋值给 watchFn 返回的值, 而是新建了一个数组(`oldValue = [];`),

同样, 在后续的新值和旧值不一样的时候, 也是通过手动修改 oldValue 的值方式来完成的, 而不是通过`oldValue = newValue`这种直接赋值的形式. 下面的对象也是类似的道理

既然这样,为什么不直接对 newValue 的值进行深拷贝呢? 答案是性能问题.

## 监听对象变化

下面是对象分支的处理逻辑, 同样包括 key 的新增, 删除, value 值的变化三种情况

```js
// 由非对象转为普通对象或者由数组转化为对象, 初始化对象
if (!_.isObject(oldValue) || _.isArrayLike(oldValue)) {
  changeCount++;
  oldValue = {};
}
_.forOwn(newValue, function (newVal, key) {
  var bothNaN = _.isNaN(newVal) && _.isNaN(oldValue[key]);
  if (!bothNaN && oldValue[key] !== newVal) {
    changeCount++;
    oldValue[key] = newVal; // 处理新增key
  }
});
_.forOwn(oldValue, function (oldVal, key) {
  if (!newValue.hasOwnProperty(key)) {
    changeCount++;
    delete oldValue[key]; // 处理属性移除
  }
});
```

也需要特殊情况 如 NaN, 带有 length 的普通对象, 这里不赘述

## listnerFn 的处理

按照原先的约定, \$watch 函数中的 listenerFn 函数接受三个参数 newValue, oldValue, scope, 但是我们的 oldValue 值的更新是在 internalWatchFn 中的, 也就是 internalListenerFn 在被调用的时候, 其值已经更新了 😿😿😿, 所以在当前的实现中, oldValue 和 newValue 的值永远是相等的

但是有一点值得注意的是, 我们的 listener 函数大多数情况下仅仅需要用到 newValue 值去进行视图更新, 因此我们可以维护一个`veryOldValue`变量, 在`digest`过程之前通过 copy 的形式保存我们的`oldValue`, 由于这种操作需要消耗一定的性能, 所以我们希望当且仅当 listener 函数需要用到我们的参数的时候我们才进行处理

如何获取 listenerFn 中参数的个数呢? 👉👉 [Function.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length)

\$watch 在第一次调用的时候, listenerFn 的调用传入的两个值都是 newValue, 也即

```js
listenerFn(newValue, newValue, this);
```

在第一次调用之后我们就可以知道是否要进行旧值得拷贝了

```js
$watchCollection(watchFn, listenerFn) {
  let veryOldValue;
  let trackVeryOldValue = (listenerFn.length > 1)
};


let internalListenerFn =  () =>  {
  listenerFn(newValue, veryOldValue, self);
  if (trackVeryOldValue) {
    veryOldValue = _.clone(newValue);
  }
};
```
