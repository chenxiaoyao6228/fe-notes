---
title: '实现angular手记[四]事件系统'
date: 2019-07-15
categories:
  - tech
tags:
  - angular
permalink: 2019-07-15-build-your-own-angular-4-events
---

## 发布订阅

前端中**最最最**常用的设计模式之一, 事件的回调使用列表保存, $emit或者$broadcast 的时候遍历列表,执行回调, 这里需要注意的是 angular 中有向上广播`$emit`和向下广播`$broadcast`之分

```javascript
Scope.prototype.$on = function (eventName, listener) {
    var listeners = this.$$listeners[eventName];
    if (!listeners) {
        this.$$listeners[eventName] = listeners = [];
    }
    listeners.push(listener)
}
Scope.prototype.$emit = function (eventName) {
   ..
};
Scope.prototype.$broadcast = function (eventName) {
  ...
};
```

## event 对象

原生的 dom 事件触发的时候默认传入一个 event 对象, 我们的事件系统也需要对此做一个包装

```javascript
Scope.prototype.$$fireEventOnScope = function (eventName, restArgs) {
  var event = { name: eventName };
  var args = [event].concat(restArgs);
  var listeners = this.$$listeners[eventName] || [];
  var i = 0;
  while (i < listeners.length) {
    if (!listeners[i]) {
      listeners.splice(i, 1);
    } else {
      listeners[i].apply(null, args);
      i++;
    }
  }
  return event;
};
```

## 事件取消注册(deregister)

使用的是和 cp1 中的 watch 一样的方法: `$on`注册方法返回一个函数, 该函数被调用的时候会根据索引值,清除`$$listeners`队列中的函数. 为避免`$$listeners`在遍历的时候删除元素造成索引混乱, 将该项目设置为 null, 而不是移除该项

```javascript
Scope.prototype.$on = function (eventName, listener) {
  return function () {
    var index = listeners.indexOf(listener);
    if (index >= 0) {
      listeners[index] = null; //在遍历的时候移除项会导致索引混乱, 因此将该项设为空
    }
  };
};
```

## \$emit

向上广播`$emit`相对比较简单, 只需要沿着原型链向上查看, 触发相应的事件即可, 使用 do...while, 不停对 scope 进行赋值, 这种方法在树形结构遍历中比较常用

```javascript
Scope.prototype.$emit = function (eventName) {
  // lodash的rest api和underscore不同, drop函数满足我们的需求
  var restArgs = _.drop(arguments);
  var scope = this;
  do {
    scope.$$fireEventOnScope(eventName, restArgs);
    scope = scope.$parent;
  } while (scope);
};
```

## \$broadcast

这里用到了我们第二章的`$$everyscope函数`, 从中可以看出向下广播`$broadcast`结构更加复杂, 因此消耗的资源更多.

```javascript
Scope.prototype.$$everyScope = function (fn) {
  if (fn(this)) {
    return this.$$children.every(function (child) {
      return child.$$everyScope(fn);
    });
  } else {
    return false;
  }
};
```

## target 与 currentTarget

目前而言, 我们的 event 对象值传递了`eventName`这个信息, 这肯定是不够的, 如果你熟悉 dom api 的话, 还有两个重要的特性我们需要传递: event.target 和 event.currentTarget, 对应的实现分别为 targetScope 和 currentScope
targetScope 相对简单, 不会随着事件的冒泡而变化, 仅位于最初绑定的元素, 因此在`$emit`和 `$broadcast`的 event 对象中添加一个属性即可

```javascript
Scope.prototype.$emit = function (eventName) {
  var event = { name: eventName, targetScope: this };
};
```

对于 currentScope,也只需要添加一行`event.currentScope = scope;`

```javascript
Scope.prototype.$emit = function (eventName) {
    ...
    var scope = this;
    do {
        event.currentScope = scope;
        ...
    } while (scope);
    event.currentScope = null; // 结束之后将currentScope设置为null
    return event;
};
Scope.prototype.$broadcast = function (eventName) {
    this.$$everyScope(function (scope) {
        event.currentScope = scope;
        ....
    });
    event.currentScope = null;
    return event;
};
```

## stopPropogation

stopPropogation 只能用在`$emit`中, 子元素调用的 scope.stopPropogation, 就不会触发 parent 中相应事件的回调, 也就是向上查找的链条切断, 因此我们想到的方法是在 do..while 循环中加一个条件,当 event 对象中的 propogation 被调用的时候, propagationStopped 这个标识符会变为 true, 向上查找终止

```javascript
Scope.prototype.$emit = function (eventName) {
    var propagationStopped = false;
    var event = {
        ....
        stopPropagation: function () {
            propagationStopped = true;
        }
    };
    ...
    do {
        ....
    }while (scope && !propagationStopped);
```

## preventDefault

scope 类本身并没有任何内置的"默认行为", 因此, 调用该函数一般情况下没什么用, 但是在某些特定的场合(自定义指令)是会发挥作用(后续再回来补这段), 处理方法和上面一样, 调用该函数的时候会改变某个 flag 值

```javascript
preventDefault: function() {
    event.defaultPrevented = true;
}
```

## broadcast removal

移除一个 scope 的时候, 需要将其子 scope 以及对应的事件移除.我们可以借助之前实现的`$broadcast`以及`$destroy`方法

```javascript
Scope.prototype.$destroy = function () {
  this.$broadcast('$destroy'); // 添加这一行
  if (this.$parent) {
    var siblings = this.$parent.$$children;
    var indexOfThis = siblings.indexOf(this);
    if (indexOfThis >= 0) {
      siblings.splice(indexOfThis, 1);
    }
  }
  this.$$watchers = null;
  this.$$listeners = {}; // 事件移除
};
```
