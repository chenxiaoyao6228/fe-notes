---
title: '实现angular手记[一]scope和digest'
date: 2019-07-12
categories:
  - tech
tags:
  - angular
permalink: 2019-07-12-build-your-own-angular-1-scope
---

## Scope

`Vue`和`AngularJS`一样, 都采用了观察者模式来实现自己的检测模型, **在模板编译的时候进行数据的依赖收集, 构建 watcher, 绑定相应的 updateView 函数**

![](https://012.vuejs.org/images/mvvm.png)

`angularJS` 使用的是"脏检查"机制来实现数据的双向绑定, 第一章要实现的 Scope 充当着重要的角色, 主要功能有:

- controller 和 view 之间的数据传递
- 应用间不同部分的数据传递
- 事件系统的广播与监听
- 监听数据的变化

## Scope 与 Digest

使用的是观察者模式, scope 中保存一个`$watcher`队列, $watch 函数往该队列中推入 watcher, \$digest 的时候遍历该列表, watchFn 函数职责只有一个, 那就是返回监听的值, 根据比较条件执行相应的回调, 也就是 listenerFn 函数

`Digest`可以类比`React`的`setData`, 触发视图更新

```javascript
Scope.prototype.$watch = function (watchFn, listenerFn) {
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn,
    last: function () {},
  };
  this.$$watchers.push(watcher);
};
Scope.prototype.$digest = function () {
  var self = this;
  var newValue, oldValue;
  _.forEach(this.$$watchers, function (watcher) {
    newValue = watcher.watchFn(self);
    oldValue = watcher.last;
    if (newValue !== oldValue) {
      watcher.last = newValue;
      watcher.listenerFn(newValue, oldValue, self);
    }
  });
};
```

### 使用空函数作为唯一值

由于函数是复合数据类型,watcher 的最初值使用一个空函数而不是一个普通的值, 更加可靠

```javascript
function initWatchVal() {}
```

### digest 与 digestOnce

由于 watch 的回调中可能会修改 scope 中的值, 如果修改的值在监听的 watchFn 执行之后, 则新改变的值不会触发回调, 因此需要有一个机制, 当 listenerFn 中对 scope 中的值进行修改之后, 再次执行\$digest 过程, 书中使用的是**dirty 标识符**来标志是否需要进行下一轮的 digest

```javascript
Scope.prototype.$$digestOnce = function () {
    ....
    _.forEach(this.$$watchers, function (watcher) {
        ....
        if (newValue !== oldValue) {
            dirty = true;
        }
    });
    return dirty;
};

Scope.prototype.$digest = function () {
    var dirty;
    do {
        dirty = this.$$digestOnce();
    } while (dirty);
}
```

### 不稳定临界值处理

如果 listenerFn 中 watcherA 中的 WatchFnA 监听的 A 值在 WatcherB 中被改变, 而 WatcherB 中监测的值 B 在 watcherA 中被改变, 那么\$digest 过程会不断被执行, 因此要有一个最大的调用临界点, 一旦超过这个点, 就要抛出异常.

```javascript
Scope.prototype.$digest = function () {
  var ttl = 10;
  var dirty;
  do {
    dirty = this.$$digestOnce();
    if (dirty && !ttl--) {
      throw '10 digest iterations reached';
    }
  } while (dirty);
};
```

### 记录最后一个 dirtyWatcher

当前的实现中无论 dirtyWatcher 在\$\$wathcers 队列的哪个位置,每次 digest 的时候都要遍历所有的 watcher, 举个极端的例子: 100 个 watcher, 只有第一个 watcher 是 dirty 的, 那么两轮循环就进行了 200 次, 实际上, 我们可以通过记录最后一个 dirtyWatcher, 将次数变成 101 次

```javascript
function Scope() {
  this.$$lastDirtyWatch = null;
}
```

在\$\$digestOnce 中

```javascript
oldValue = watcher.last;
if (newValue !== oldValue) {
  self.$$lastDirtyWatch = watcher;
} else if (self.$$lastDirtyWatch === watcher) {
  return false;
}
```

## 监听数组或者对象内部的变化

当前的检查机制是使用`===`来进行比较的, 在面对复合数据类型如对象数组的时候, 并不能检测到数组或者对象内部的变化, 一种解决的办法是复制整个对象或者数组, 但是这样会带来内存的消耗, 因此 angular 提供了另外一套监听机制, collection watching(将在第三章实现)

```javascript
watcher.last = watcher.valueEq ? _.cloneDeep(newValue) : newValue;
```

**Ps**: Vue2.x 的实现使用`$set`来处理新加入的 key, 而对数组则是直接通过直接修改 Array.prototype 的方法来处理

## \$eval 与\$apply

应用中有一些代码是不为 angular 感知的, 比如用户手动操作了 dom 修改了数据, 因此我们需要将新的变化纳入 scope 的检测, 这就是$eval和$apply 的初衷. **\$eval 接受一个函数并且以 scope 作为参数, 立即执行该函数**, 这使得我们可以在 scope 的上下文中对外部代码进行求值, \$apply 执行$eval操作后, 主动触发$digest 过程

```javascript
Scope.prototype.$eval = function (expr, arg) {
  return expr(this, arg);
};
Scope.prototype.$apply = function (expr) {
  try {
    return this.$eval(expr);
  } finally {
    this.$digest();
  }
};
```

## \$evalAsync

**在相同的 digest 周期内延迟执行某些函数或者表达式**, 比如 ajax 请求返回了数据, 处理的方法也简单, 使用一个\$\$asyncQueue 来执行我们需要异步执行的函数, 在每次 digest 前, 先处理该队列中的异步函数(是不是有点类似浏览器微任务队列的味道?)

```javascript
function Scope() {
    this.$$asyncQueue = [];
}

Scope.prototype.$digest = function () {
    ...
    do {
        while (this.$$asyncQueue.length) {
            var asyncTask = this.$$asyncQueue.shift();
            asyncTask.scope.$eval(asyncTask.expression);
        }
        ...
       // 处理watchFn中调用$evalAsync的情况, 无脏值, 但是异步队列中有函数
    } while (dirty || this.$$asyncQueue.length);
};
```

## scopePhase

目前的方案存在一个问题, 就是异步队列中函数的执行依赖的是$digest的周期, 但是digest周期是由其他外在因素确定的(脏值), $evalAsync 本身并不会触发 digest 过程, **我们希望的是\$evalAsync 本身可以检测 digest 周期是否正在进行,如果没有的话主动触发一个**, 为了解决这个问题, 我们使用一个 phase 标志来标记当前的状态

```javascript
function Scope() {
  this.$$phase = null;
}
```

定义标记 phase 的两个函数

```javascript
Scope.prototype.$beginPhase = function (phase) {
  if (this.$$phase) {
    throw this.$$phase + ' already in progress';
  }
  this.$$phase = phase;
};

Scope.prototype.$clearPhase = function () {
  this.$$phase = null;
};
```

在\$digest 和 apply 中分别使用这两个函数来标志 phase

```javascript
Scope.prototype.$apply = function (expr) {
  try {
    this.$beginPhase('apply');
  } finally {
    this.$clearPhase();
  }
};
```

最后一步,在\$evalAsync 中检测周期

```javascript
Scope.prototype.$evalAsync = function (expr) {
  var self = this;
  if (!self.$$phase && !self.$$asyncQueue.length) {
    setTimeout(function () {
      if (self.$$asyncQueue.length) {
        self.$$digestOnce();
      }
    }, 0);
  }
  this.$$asyncQueue.push({ scope: this, expression: expr });
};
```

## \$applyAsync

$evalAsync用来处理digest周期内部需要延期执行的函数, 对于在digest周期外需要执行的函数, 我们需要定义另外一个函数$applyAsync, 该函数既不立即执行传入的函数也不立即触发 digest 周期, 而是将两者都延期执行, 一个常见的场景是 http 请求, 当请求数很多而我们每次获得响应都执行一次 digest 周期的话势必带来性能问题,\$applyAsync 可以将短期内的连续变化并入一个 digest 周期.

- 延期执行, 使用 setTimeout 0, 因为当 setTimeout 中的函数被执行的时候, 主程上的其他代码肯定已经被执行完了.
- 多个合并, 利用 setTimeout 返回的 id 作为\$\$applyAsyncId, 只有当 id 不存在的时候,才会安排一个新的 timeout

## \$\$postDigest

Scope 里面添加一个新的队列

```js
this.$$postDigestQueue = [];
```

在digest的最后触发执行

```js
Scope.prototype.$digest = function () {
  ....
  while (this.$$postDigestQueue.length) {
    this.$$postDigestQueue.shift()();
  }
};
```

## Error handling

添加 try...catch 语句, 以确保当某一个 watcher 中出现问题的时候程序还能够正常运行

## destroy a watch

angular 中, 每一个 watch 都返回一个特定的函数值, 该函数在触发的时候, 会销毁相应的 watcher

```javascript
this.$watch = function() {
    ...
    return function () {
        var index = this.$$watchers.indexOf(wathcer);
        this.$$watchers.splice(index, 1);
    }
}
```

## \$watchGroup

我们希望可以批量监听一组数据,当这些数据中的某个发生变化的时候, 都会触发相同的回调, 最容易想到的是将 watchFns 数组进行遍历, 对每个 watchFn 进行监听

```javascript
Scope.prototype.$watchGroup = function (watchFns, listenerFn) {
  var self = this;
  _.forEach(watchFns, function (watchFn) {
    self.$watch(watchFn, listener);
  });
};
```

(本节完)
