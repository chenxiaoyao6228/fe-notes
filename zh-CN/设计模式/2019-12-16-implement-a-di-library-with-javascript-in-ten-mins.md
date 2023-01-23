---
title: 十分钟用JS实现一个简单的依赖注入框架
categories:
  - tech
tags:
  - javascript
date: 2019-12-16
permalink:  2019-12-16-implement-a-di-library-with-javascript-in-ten-mins
---

## 前言

## 实现

### 基本

```js
function launchRocket() {
  console.log('Rocket launched!')
}
function Button() {}
Button.prototype = {
  openLid() { this.open = true},
  closeLid() { this.open = false},
  launch() {
    if (this.open) {
      launchRocket()
    }
  }
}

function spaceProgram() {
  let button = new Button()
  button.openLid()
  button.launch()
  button.closeLid()
}

spaceProgram()
```

### spaceProgram支持参数

我们希望spaceProgram可以传入不同的按钮， 同时button有更多的功能, 可以传入target

```js
function launchRocket() {
  console.log('Rocket launched!')
}
function Button(target) {
  this.target = target
}
Button.prototype = {
  openLid() {
    this.open = true
  },
  closeLid() {
    this.open = false
  },
  launch() {
    if (this.open) {
      this.target()
    }
  }
}

function spaceProgram(button) {
  button.openLid()
  button.launch()
  button.closeLid()
}
spaceProgram(new Button(launchRocket))   
```

### 引入框架代码

```js
// Framework
function createInjector() {
  let cache = {}
  function value(key, val) {
    cache[key] = val
  }
  function invoke(fn) {
    let argStr = fn
      .toString()
      .match(/^function\s*[^(]*\(([^))]*)\)/)[1]
      .split(',')
      .map(s => s.trim())
    let args = argStr.map(arg => {
      if (cache[arg]) {
        return cache[arg]
      }
    })
    return fn.apply(fn, args)
  }
  return {
    value: value,
    invoke: invoke
  }
}
// App
function launchRocket() {
  console.log('Rocket launched!')
}
function Button(target) {
  this.target = target
}
Button.prototype = {
  openLid() {
    this.open = true
  },
  closeLid() {
    this.open = false
  },
  launch() {
    if (this.open) {
      this.target()
    }
  }
}

function spaceProgram(button) {
  button.openLid()
  button.launch()
  button.closeLid()
}
let injector = createInjector()
injector.value('button', new Button(launchRocket))
injector.invoke(spaceProgram)
```

### 添加fatory方法

```js
// FrameWork
function createInjector() {
  let instanceCache = {}
  let providerCache = {}
  function value(key, val) {
    instanceCache[key] = val
  }
  function factory(key, factoryFn) {
    providerCache[key] = factoryFn
  }
  function invoke(fn) {
    let argStr = fn
      .toString()
      .match(/^function\s*[^(]*\(([^))]*)\)/)[1]
      .split(',')
      .map(s => s.trim())
    let args = argStr.map(arg => {
      if (Object.prototype.hasOwnProperty.call(instanceCache, arg)) {
        return instanceCache[arg]
      } else if (Object.prototype.hasOwnProperty.call(providerCache, arg)) {
        let provider = providerCache[arg]
        let instance = invoke(provider)
        instanceCache[arg] = instance
        return instance
      }
    })
    return fn.apply(fn, args)
  }
  return {
    value: value,
    invoke: invoke,
    factory: factory
  }
}
// App
function launchRocket() {
  console.log('Rocket launched!')
}
function Button(target) {
  this.target = target
}
Button.prototype = {
  openLid() {
    this.open = true
  },
  closeLid() {
    this.open = false
  },
  launch() {
    if (this.open) {
      this.target()
    }
  }
}

function spaceProgram(button) {
  button.openLid()
  button.launch()
  button.closeLid()
}
let injector = createInjector()
injector.value('buttonTarget', launchRocket)
injector.factory('button', function(buttonTarget) {
  return new Button(buttonTarget)
})
injector.invoke(spaceProgram)
```

## 参考

[Build-your-own-angularJS](https://www.youtube.com/watch?v=3ju-32Bcx1Q&ab_channel=ScotlandJS)
[Dependency-injection-in-JavaScript](https://krasimirtsonev.com/blog/article/Dependency-injection-in-JavaScript)