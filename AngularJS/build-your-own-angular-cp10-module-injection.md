# 实现 angluar 手记[十]模块与依赖注入

angular 中的依赖注入是通过 loader 和 injector 模块来实现的, 可以把 injector 想象成为一个池子,我们可以通过类似 injector.get()的方法来获取内容, 但两者具体是怎么协作的呢? 我们先分别来看看这两个模块

阅读之前需要了解[angularJS 中的模块](https://docs.angularjs.org/guide/module)

本节我们将实现 AngularJS 的模块和依赖注入系统， 内容包括:

- 模块的创建与查找
- 函数三种注入方式(构造函数注入，内联注入，注解注入)
- 类的注入以及实例化

本节对应的代码： [loader](https://github.com/chenxiaoyao6228/angular-tiny/blob/master/src/loader.js)以及[injector](https://github.com/chenxiaoyao6228/angular-tiny/blob/master/src/injector.js)

## 模块与 angular.module

从测试用例入手

```js
it("has a constant that has been registered to a module", function () {
  var module = angular.module("myModule", []);
  module.constant("aConstant", 42);
  var injector = createInjector(["myModule"]);
  expect(injector.has("aConstant")).toBe(true);
  expect(injector.get("aConstant")).toBe(42);
});
```

跟 jQuery 一样，这里的 angular 是挂在 window 上的命名空间

```js
function setupModuleLoader(window) {
  var ensure = function (obj, name, factory) {
    return obj[name] || (obj[name] = factory());
  };
  var angular = ensure(window, "angular", Object);
}
```

另外大致可以猜到，constant 是用来定义常量的

```js
ensure(angular, "module", function () {
  var modules = {}; // 用来存放模块的

  var invokeQueue = []; // 用来存放需要执行的任务
  var createModule = function (name, requires, modules) {
    var moduleInstance = {
      name: name,
      requires: requires,
      constant: function (key, value) {
        invokeQueue.push(["constant", [key, value]]); // 这里并不直接调用 constant 方法，而是将 constant 方法的参数保存起来，具体原因后面会提到
      },
      _invokeQueue: invokeQueue,
    };
    modules[name] = moduleInstance; // 注册到 modules 中

    return moduleInstance;
  };

  var getModule = function (name, modules) {
    if (modules.hasOwnProperty(name)) {
      return modules[name];
    } else {
      throw "Module " + name + " is not available!";
    }
  };

  return function (name, requires) {
    if (requires) {
      return createModule(name, requires, modules);
    } else {
      return getModule(name, modules);
    }
  };
});
```

那么有个疑问: module.constant 定义的常量是如何被 injector 拿到的呢？

答案是： createInjector 里面直接依赖 window.angular.module

另外，创建 injector 的时候会遍历\_invokeQueue 进行初始化， 并将值存放在 cache 中，这样就可以通过 injector.get 获取到了

```js
function createInjector(modulesToLoad) {
  var cache = {};

  // provider, 提供值的注入， 类比React的Provider和Consumer？
  var $provide = {
    constant: function (key, value) {
      cache[key] = value;
    },
  };
  _.forEach(modulesToLoad, function (moduleName) {
    var module = angular.module(moduleName);
    _.forEach(module._invokeQueue, function (invokeArgs) {
      var method = invokeArgs[0];
      var args = invokeArgs[1];
      $provide[method].apply($provide, args);
    });
  });
  return {
    has: function (key) {
      return cache.hasOwnProperty(key);
    },
    get: function (key) {
      return cache[key];
    },
  };
}
```

### 引入其他模块

如果在引入的模块中，又引入了其他模块，那么我们需要先加载其他模块，然后再加载当前模块

```js
_.forEach(modulesToLoad, function loadModule(moduleName) {
  var module = angular.module(moduleName);
  // 🚧 递归加载依赖模块，优先加载依赖模块
  _.forEach(module.requires, loadModule);
  _.forEach(module._invokeQueue, function (invokeArgs) {
    var method = invokeArgs[0];
    var args = invokeArgs[1];
    $provide[method].apply($provide, args);
  });
});
```

同时我们需要解决循环依赖的问题

对应的测试用例如下:

```js
it("loads each module only once", function () {
  angular.module("myModule", ["myOtherModule"]);
  angular.module("myOtherModule", ["myModule"]);
  createInjector(["myModule"]);
});
```

为了处理循环依赖，我们需要确保每个模块只加载一次。这还会产生一个效果，即当有两条（非循环的）路径指向同一个模块时，它不会被加载两次，因此避免了不必要的额外工作。
我们将引入一个对象，用于跟踪已加载的模块。在加载模块之前，我们会检查它是否已经加载：

```js
var loadedModules = {};

if (!loadedModules.hasOwnProperty(moduleName)) {
  // 检查模块是否已经加载
  loadedModules[moduleName] = true;

  var module = angular.module(moduleName);
  _.forEach(module.requires, loadModule);
  _.forEach(module._invokeQueue, function (invokeArgs) {
    var method = invokeArgs[0];
    var args = invokeArgs[1];
    $provide[method].apply($provide, args);
  });
}
```

总的来说，运用了两点技术

- 模块的延迟加载
- 模块的递归注册加载

## 函数注解

injector 会根据函数的参数名，自动注入对应的值，这个过程叫做模块注解

注解有三种方式:

- $inject 属性注解
- 数组内联注解
- 函数参数名注解

### $inject 属性注解

测试用例如下：

```js
it("invokes an annotated function with dependency injection", function () {
  var module = angular.module("myModule", []);
  module.constant("a", 1);
  module.constant("b", 2);
  var injector = createInjector(["myModule"]);
  var fn = function (one, two) {
    return one + two;
  };
  fn.$inject = ["a", "b"];
  expect(injector.invoke(fn)).toBe(3);
});
```

显然，injectory 要调用 fn, 并传入对应的参数 a, b, 那么问题来了:

- 如何知道 fn 的参数是什么
- 如何知道 a, b 的值是什么

方法也很简单，我们只需要在 cache 中查找 fn.$inject 对应的值即可。

```js
function invoke(fn) {
  var args = _.map(fn.$inject, function (token) {
    return cache[token];
  });
  return fn.apply(null, args);
}
```

#### this 的绑定

在函数调用的过程中，我们还需要注意 this 的绑定问题，这里的 invoke 函数提供了第二个参数，将 fn 的 this 绑定到 obj 上

```js
it("invokes a function with the given this context", function () {
  var module = angular.module("myModule", []);
  module.constant("a", 1);
  var injector = createInjector(["myModule"]);
  var obj = {
    two: 2,
    fn: function (one) {
      return one + this.two;
    },
  };
  obj.fn.$inject = ["a"];
  expect(injector.invoke(obj.fn, obj)).toBe(3);
});
```

```js
function invoke(fn, self) {
  var args = _.map(fn.$inject, function (token) {
    if (_.isString(token)) {
      return cache[token];
    } else {
      throw "Incorrect injection token! Expected a string, got " + token;
    }
  });
  return fn.apply(self, args); // apply传入第二个参数，将 fn 的 this 绑定到 obj 上
}
```

### 数组内联注解

用例如下

```js
describe("annotate", function () {
  it("returns the $inject annotation of a function when it has one", function () {
    var injector = createInjector([]);
    var fn = function () {};
    fn.$inject = ["a", "b"];
    expect(injector.annotate(fn)).toEqual(["a", "b"]);
  });
});
```

抽取一个 annotate 函数，用来获取函数的参数名, 目前支持前两种方式

```js
function annotate(fn) {
  if (_.isArray(fn)) {
    return fn.slice(0, fn.length - 1);
  } else {
    return fn.$inject;
  }
}
```

### 函数参数名注解

最常用的一种方式，主要是通过正则表达式来获取函数的参数名

使用方式如下:

```js
it("returns annotations parsed from function args when not annotated", function () {
  var injector = createInjector([]);
  var fn = function (a, b) {};
  expect(injector.annotate(fn)).toEqual(["a", "b"]);
});
```

实现方法是通过 toString 方法获取函数的源码，然后通过正则表达式匹配出参数名

```js
var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

function annotate(fn) {
  if (_.isArray(fn)) {
    return fn.slice(0, fn.length - 1);
  } else if (fn.$inject) {
    return fn.$inject;
  } else if (!fn.length) {
    return [];
  } else {
    var argDeclaration = fn.toString().match(FN_ARGS);
    return _.map(argDeclaration[1].split(","), function (argName) {
      return argName.match(FN_ARG)[1];
    });
  }
}
```

重点解释下正则表达式的部分:

- `^function` : 匹配以 "function" 开头。
- `\s*` : 匹配零个或多个空白字符。
- `[^\(]*` : 匹配零个或多个非左括号字符。
- `\(` : 匹配左括号 "("。
- `\s*` : 匹配零个或多个空白字符。
- `([^\)]*)` : 匹配零个或多个非右括号字符，使用括号捕获匹配结果。
- `\)` : 匹配右括号 ")"。
- `/m` : 多行匹配模式，使得 ^ 和 $ 匹配每一行的开头和结尾。

此部分还涉及严格模式、注释的移除等处理，这里为简化暂不做处理

## 类的注入以及实例化

injector 还应该支持类的实例化, 且同样支持三种注入方式

```js
// inject属性注解
it("instantiates an annotated constructor function", function () {
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
});

// 数组内联注解

// 参数名
it("instantiates a non-annotated constructor function", function () {
  var module = angular.module("myModule", []);
  module.constant("a", 1);
  module.constant("b", 2);
  var injector = createInjector(["myModule"]);
  function Type(a, b) {
    this.result = a + b;
  }
  var instance = injector.instantiate(Type);
  expect(instance.result).toBe(3);
});
```

同时需要支持原型链

```js
it("uses the prototype of the constructor when instantiating", function () {
  function BaseType() {}
  BaseType.prototype.getValue = _.constant(42);
  function Type() {
    this.v = this.getValue();
  }
  Type.prototype = BaseType.prototype;
  var module = angular.module("myModule", []);
  var injector = createInjector(["myModule"]);
  var instance = injector.instantiate(Type);
  expect(instance.v).toBe(42);
});
```

instantiate 函数的实现如下:

```js
function instantiate(Type, locals) {
  var UnwrappedType = _.isArray(Type) ? _.last(Type) : Type;
  var instance = Object.create(UnwrappedType.prototype);
  invoke(Type, instance, locals);
  return instance;
}
```

这不就是面试常问的实现自定义 new 的方式吗？, 通过 apply 将参数传入构造函数，然后将构造函数的 this 指向 instance

更多相关的可以参考[这里](https://github.com/chenxiaoyao6228/js-rocks/blob/85dd4e69ca30576138b5585a2861f38ca96821c3/packages/lodash-tiny/src/inheritance/index.js#L7)
