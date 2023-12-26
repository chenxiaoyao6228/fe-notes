## 前言

Provider 模式： 一种软件设计模式，其中存在一个专门的组件或模块（提供者），其责任是提供特定的服务、功能、数据或资源，并允许其他组件或模块通过预定的接口或机制来访问或利用这些提供的内容。这有助于降低系统中各部分之间的耦合，提高代码的可重用性和可扩展性。

AngularJS 中的 Provider 也是一种设计模式，它是一个对象，用于创建和配置服务。它是一个函数，它可以有一个 `$get()` 方法。`$get()` 方法是一个工厂函数，用于创建服务实例。

> Providers are objects that know how to make dependencies. They’re useful when you actually need to run some code when constructing a dependency. They’re also useful when your dependency has other dependencies, which you’d also like to have injected.

## $provide

`$provide` 是一个服务，它提供了一些方法，用于注册服务、实例、常量、值、工厂函数、服务提供者等。

```js
it("allows registering a provider and uses its $get", function () {
  var module = angular.module("myModule", []);
  module.provider("a", {
    $get: function () {
      return 42;
    },
  });
  var injector = createInjector(["myModule"]);
  expect(injector.has("a")).toBe(true);
  expect(injector.get("a")).toBe(42);
});
```

loader 的实现如下，对原先代码进行了小重构， 对 constant 和 provider 的注册，都是通过 invokeLater 方法，将注册的方法名和参数保存到 invokeQueue 中，最后通过 invokeLater 方法，将 invokeQueue 中的方法依次执行。

```js
// src/loader.js
var invokeLater = function (method) {
  return function () {
    invokeQueue.push([method, arguments]);
    return moduleInstance;
  };
};

var moduleInstance = {
  name: name,
  requires: requires,
  constant: invokeLater("constant"),
  provider: invokeLater("provider"),
  _invokeQueue: invokeQueue,
};
```

injector 的实现如下

```js
var $provide = {
  constant: function (key, value) {
    if (key === "hasOwnProperty") {
      throw "hasOwnProperty is not a valid constant name!";
    }
    cache[key] = value;
  },
  provider: function (key, provider) {
    cache[key] = provider.$get();
  },
};
```

## provider 的依赖注入

注意下面的例子，provider `b` 依赖于 constant `a`，我们希望能够提供自动的查找注入.

```js
it("injects the $get method of a provider", function () {
  var module = angular.module("myModule", []);
  module.constant("a", 1);
  module.provider("b", {
    $get: function (a) {
      return a + 2;
    },
  });
  var injector = createInjector(["myModule"]);
  expect(injector.get("b")).toBe(3);
});
```

## 模块的延迟加载

顺序问题很重要

```js
it("injects the $get method of a provider lazily", function () {
  var module = angular.module("myModule", []);
  module.provider("b", {
    $get: function (a) {
      return a + 2;
    },
  });
  module.provider("a", { $get: _.constant(1) });
  var injector = createInjector(["myModule"]);
  expect(injector.get("b")).toBe(3);
});
```

## 参考

- [AngularJS in patterns]
- [AngularJS: Understanding Provider]
