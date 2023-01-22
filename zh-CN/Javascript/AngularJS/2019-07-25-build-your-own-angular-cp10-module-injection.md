@ -1,257 +0,0 @@
---

title: "实现angluar手记[十]模块与依赖注入"
date: 2019-07-25T08:45:28.000Z
tags: null
permalink: 2019-07-25-build-your-own-angular-cp10-module-injection
---

angular 中的依赖注入是通过 loader 和 injector 模块来实现的, 可以把 injector 想象成为一个池子,我们可以通过类似 injector.get()的方法来获取内容, 但两者具体是怎么协作的呢? 我们先分别来看看这两个模块

## module 模块(loader.js)

loader 模块的主要功能就是暴露在 angular 上定义一个 module 函数, 这个函数同时充当了 getter 和 setter 的功能, name, requires 分别代表模块名, 依赖, 当只有 name 的时候是查询模块, 有 require 参数的时候是创建模块, modules 参数是一个查询表, 用来判断 name 是否已经存在

```js
  ensure(angular, 'module', function() {
    var modules = {};
    return function(name, requires) {
      if (requires) {
        return createModule(name, requires, modules);
      } else {
        return getModule(name, modules);
      }
    };
```

createModule, 可能比较反直觉的是, 我们在注册模块的时候, 使用类似`module.instance('a', 4)`的方法往上面挂在属性的时候, `a`并不是直接挂在我们的 module 上的, 而是通过一个 invokeQueue 来进行保存, `invokeQueue.push(['constant', [key, value]]);`, 在后续创建 injector 实例的时候会遍历这个 invokeQueue, 挂在在 injector 内部的 cache 池上。

```js
var createModule = function(name, requires, modules) {
  if (name === "hasOwnProperty") {
    throw "hasOwnProperty is not a valid module name";
  }
  var invokeQueue = [];
  var moduleInstance = {
    name: name,
    requires: requires,
    constant: function(key, value) {
      invokeQueue.push(["constant", [key, value]]); // 看这里
    },
    _invokeQueue: invokeQueue
  };
  modules[name] = moduleInstance;
  return moduleInstance;
};
```

getModule 就不说了, 简单返回模块实例

```js
var getModule = function(name, modules) {
  if (modules.hasOwnProperty(name)) {
    return modules[name];
  } else {
    throw "Module " + name + " is not available!";
  }
};
```

[完整代码](https://github.com/teropa/build-your-own-angularjs/blob/chapter11-modules-and-the-injector/src/loader.js)

## injector 注入器(injector.js)

inject 的功能

- 获取模块上的属性
- 依赖注入(通过函数或者构造器)

### 获取模块的属性

前面提到， 我们在 module 上挂在的属性， 是通过 injector 拿到的， 如 injector.get()

```js
var module = angular.module("myModule", []);
module.constant("aConstant", 42);
var injector = createInjector(["myModule"]);
expect(injector.get("aConstant")).toBe(42);
```

那 injector 是如何拿到的呢

```js
_.forEach(modulesToLoad, function loadModule(moduleName) {
  if (!loadedModules.hasOwnProperty(moduleName)) {
    loadedModules[moduleName] = true;
    var module = window.angular.module(moduleName);
    _.forEach(module.requires, loadModule);
    _.forEach(module._invokeQueue, function(invokeArgs) {
      var method = invokeArgs[0];
      var args = invokeArgs[1];
      $provide[method].apply($provide, args);
    });
  }
});
```

在定义完所有的 module 之后， angular 才会创建唯一的 injector 实例， 创建的时候会将 module 实例上的 ivokeQueue 进行遍历， 执行相应的函数， 将属性挂在到 injector 的 cache 上， 拿刚刚的例子

```js
module.constant("aConstant", 42);
```

前面说过，当我们在定义的时候模块属性的时候， 实际上属性并没有创建， 而是以下面这种形式挂在了 invokeQueue 上, 第一个参数为函数名, 告诉 injector 要用这个函数生成属性,后面的列表是参数

```
[
  ['constant', ['aConstant', 42]]
]`
```

来看看 injector 的 constant 方法, 可以看到, 我们最终以 key = aConstant, value = 42, 将 aConstant 属性挂在了 cache 上, 这样我们能通过 injector.get 从 cache 中拿到相应的参数了.

```
function createInjector(modulesToLoad, strictDi) {
  // 顶部定义缓存
  var cache = {};

  // ...省略若干代码....

  constant: function(key, value) {
        if (key === 'hasOwnProperty') {
          throw 'hasOwnProperty is not a valid constant name!';
        }
        cache[key] = value;
      }
  };
}
```

当模块依赖模块的时候, 如下面的 module2, 将 module1 作为依赖, 我们希望在创建 injector 之后, 也能拿到依赖模块中的内容

```js
var module1 = angular.module("myModule", []);
var module2 = angular.module("myOtherModule", ["myModule"]);
module1.constant("aConstant", 42);
module2.constant("anotherConstant", 43);
var injector = createInjector(["myOtherModule"]);
expect(injector.has("aConstant")).toBe(true);
expect(injector.has("anotherConstant")).toBe(true);
```

实际上只需要一行代码就可以了, 通过递归调用将依赖的模块导入, 和 webpack 有异曲同工的地方

```js
_.forEach(module.requires, loadModule); // 添加这行
_.forEach(module._invokeQueue, function(invokeArgs) {
  var method = invokeArgs[0];
  var args = invokeArgs[1];
  $provide[method].apply($provide, args);
});
```

[完整代码](https://github.com/teropa/build-your-own-angularjs/blob/chapter11-modules-and-the-injector/src/injector.js)

### 依赖注入

injector 的主要功能不在于或者参数, 而在于**依赖注入, 即触发函数构造对象,并自动查找构建过程中的依赖**, 主要包括两种形式, 其中需要解决的问题是**函数参数的解析**

1. 函数形式
2. 构造器形式

#### 函数形式

先来看一个测试用例, 我们希望 injector.invoke 在触发函数的时候, 能找到相应的参数, 而参数挂在 fn.\$inject 属性上

```js
var module = angular.module("myModule", []);
module.constant("a", 1);
module.constant("b", 2);
var injector = createInjector(["myModule"]);
var fn = function(one, two) {
  return one + two;
};
fn.$inject = ["a", "b"];
expect(injector.invoke(fn)).toBe(3);
```

可以看到, invoke 通过在 cache 上查找 a, b 属性, 然后以此作为参数调用了 fn 函数

```js
function invoke(fn) {
  var args = _.map(fn.$inject, function(token) {
    return cache[token];
  });
  return fn.apply(null, args);
}
```

支持三种形式的参数解析

- 函数对象上的\$inject 属性
- 数组的形式

```js
[
  "a",
  "b",
  function(one, two) {
    return one + two;
  }
];
```

- 普通函数的形式, 最复杂, 需要调用 fn.toString 方法拿到函数字符串再经过正则解析

angular 定义了一个 annotate 函数来进行解析

```js
var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var STRIP_COMMENTS = /(\/\/.*$)|(\/\*.*?\*\/)/gm;

function annotate(fn) {
  if (_.isArray(fn)) {
    return fn.slice(0, fn.length - 1);
  } else if (fn.$inject) {
    return fn.$inject;
  } else if (!fn.length) {
    return [];
  } else {
    if (strictDi) {
      throw "fn is not using explicit annotation and cannot be invoked in strict mode";
    }
    var source = fn.toString().replace(STRIP_COMMENTS, "");
    var argDeclaration = source.match(FN_ARGS);
    return _.map(argDeclaration[1].split(","), function(argName) {
      return argName.match(FN_ARG)[2];
    });
  }
}
```

#### 构造器的形式

```js
var module = angular.module("myModule", []);
module.constant("a", 1);
module.constant("b", 2);
var injector = createInjector(["myModule"]);
function Type(one, two) {
  this.result = one + two;
}
Type.$inject = ["a", "b"];
var instance = injector.instantiate(Type);
expect(instance.result).toBe(3);
```

对于构造器的形式,定义了一个 instantiate 方法, 需要注意的是原型链的处理

```js
function instantiate(Type, locals) {
  var UnwrappedType = _.isArray(Type) ? _.last(Type) : Type;
  var instance = Object.create(UnwrappedType.prototype);
  invoke(Type, instance, locals);
  return instance;
}
```