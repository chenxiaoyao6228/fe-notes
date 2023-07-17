# 实现angular手记[二]scope继承

## 一. 前言

在搜索 scope 相关内容的时候在官方的[wiki](https://github.com/angular/angular.js/wiki/Understanding-Scopes)上看到一篇很好地解释了 angularJS 中的 scope 的原理，就大致搬运过来了。

这一节比较重要, 和后面的模板编译的作用域有关(不知道 Vue 是如何处理这个问题的,有新的想法再回来看吧, 据说 Angular2 中移除了 Scope?)

### 1.1 JavaScript Protocal Inheritance

需要理解原型链的继承方式，有需要可以看看之前的文章

![normal prototypal inheritance](https://camo.githubusercontent.com/5348d43c83b66ac0def32a9fa3ae61c2fae7aa1bfa2a14470b5b16c7779ec26f/687474703a2f2f692e737461636b2e696d6775722e636f6d2f61544147672e706e67)

### 1.2 Angular Scope Inheritance

简单来说分两种 Scope

- 正常的 Scope: 值为 false(默认)，自动从 parent scope 进行继承，scope： true， 为当前 directive 创建一个 scope, 在寻值的时候优先从 directive 的 scope 中进行查找，找不到再到 parent scope 进行查找
- isolate scope: 值为{..}，在我们创建 component 或者 directive 的时候用到，可以通过’=‘，’@‘, ’&‘,和 ‘<’的方式获取父 scope 的属性值

#### 正常的 scope 继承

1. 正常的原型链 scope 继承，ng-switch, ng-include, ng-controller, 带有 scope 为 true 的指令
2. ng-repeat：正常的原型链 scope 继承，但是会对 childScope 进行复制赋值，在每次迭代 ng-repeat 都创建了一个新的 childScope, 且 childScope 总能获得最新值。(因此 ng-repeat 中出现双向数据绑定的时候需要注意)
3. Transcluded-scope -- 带有`transclude:true`的指令，该 scope 使用了正常的原型链继承，但同时也是其余 isolate-scope 的兄弟节点

#### Isolate scope 的四种绑定

```js
bindings: {
  attr1: '@',
  attr2: '<',
  attr3: '=',
  attr4: '&'
}
```

##### 1. @ :读取属性的文本

可以认为是一次性初始化，对于不再会更新的列表项很有用

```js
app.component("readingstring", {
  bindings: { text: "@" },
  template: "<p>text: <strong>{{$ctrl.text}}</strong></p>",
});
```

渲染

```html
<readingstring text="hello"></readingstring>
```

结果

> text: hello

##### 2. = :双向数据绑定

如用于显示动态 input 输入的值

```js
app.component("dynamicinput", {
  bindings: { in: "=" },
  template: "<p>dynamic input: <strong>{{$ctrl.in}}</strong></p>",
});
```

这里的 in 和 outerVariable 进行了绑定

```html
<dynamicinput in="outervariable"></dynamicinput>
```

##### 3. < :单向数据绑定

AngularJS1.5 之后出现了单向数据绑定

```html
<dynamicinput in="calculateSomething()"></dynamicinput>
```

##### 4. & ：函数绑定

```js
app.component("output", {
  bindings: { out: "&" },
  template: `
        <button ng-click="$ctrl.out({amount: 1})">buy one</button>
       <button ng-click="$ctrl.out({amount: 5})">buy many</button> `,
});
```

```html
Outer value: {{count}} <output out="count = count + amount"></output>
```

### 1.3 简图

![scope in angularJS](https://bennadel-cdn.com/resources/uploads/2014/isolate-scope-and-prototype-tree-in-angularjs.png)

**注意的是 Isolate scope 的原型链指向的是 Scope 对象，$parent 属性指向的是 parent scope.**

**对于所有的 scope，不管是正常的 scope 还是 isolate scope， AngularJS 都使用了$parent, $childHead, $childTail 的方式来维持层级关系，主要用来处理事件的广播**

## 二. 实现

### 2.1 利用原型链进行继承

使用

```js
let parentScope = new Scope();
let childScope = parentScope.$new();
```

实现

```js
$new() {
    let ChildScope = function() {}
    ChildScope.prototype = this
    let child = new ChildScope()
    child.$$watchers = []
    return child
  }
```

### 2.2 每个子组件拥有自己的 watchers 队列

每个 scope 只能控制自己以及 child, 不能控制其 parent 以及 parent 的其他子节点, 这样是比较符合直觉的, 当父组件发生了变化的时候, 子组件可能订阅了其中的属性.

每个 scope 拥有自己的`watchers`队列, 在`digest`时候就不会在原型链上向上查找了

为了对其子组件的`watchers`进行遍历, parentScope 需要知道其 childScope 的存在, 解决的方法是在每次`$new`的时候记录到`$$children`队列中, 形成树结构

```js
  $new() {
    let ChildScope = function() {}
    ChildScope.prototype = this
    let child = new ChildScope()
    this.$$children.push(child)
    child.$$watchers = []
    child.$$children = []
    return child
  }
```

接下来要对`$digestOnce`进行修改, 增加对 childScope 的遍历, 只有当每个`childScope`都返回 false 的时候, 才算结束

```js
$$everyScope(fn) {
    if (fn(this)) {
      return this.$$children.every(function(child) {
        return child.$$everyScope(fn)
      })
    } else {
      return false
    }
  }
```

```js
  $$digestOnce() {
    let dirty
    let continueLoop = true
    this.$$everyScope(scope => {
      let newValue, oldValue
      utils.forEachRight(this.$$watchers, watcher => {
        try {
          if (watcher) {
            let newValue = watcher.watchFn(scope)
            let oldValue = watcher.oldValue
            if (!scope.$$areEqual(newValue, oldValue, watcher.valueEq)) {
              this.$$lastDirtyWatch = watcher
              watcher.oldValue = watcher.valueEq
                ? utils.deepClone(newValue)
                : newValue
              watcher.listenerFn(
                newValue,
                oldValue === this.$$initWatch ? newValue : oldValue,
                scope
              )
              dirty = true
            } else if (this.$$lastDirtyWatch === watcher) {
              continueLoop = false
              dirty = false
              return false
            }
          }
        } catch (e) {
          console.error(e)
        }
      })
      return continueLoop
    })
    return dirty
  }
```

树结构可以用链表来表示, 也可以用数组来表示

PS: AngularJS 内部并没有实现\$\$children 数组, 而是使用了链表的数据结构, `$$nextSibling, $$previousSibling, $$childHead, $$childTail`

PPS: React Fiber 内部不也是使用了这种链表的结构吗?

### 2.3 从根节点开始 digest

每个 childScope 都有一个`$root`属性来保存根节点, childScope 在调用`$apply`的时候直接委托根节点的`$digest`来触发自上而下的更新

```js
$apply(expression) {
    try {
      this.$beginPhase('$apply')
      expression.apply(null, [this])
    } finally {
      this.$clearPhase()
      this.$root.$digest() // 从根节点开始更新
    }
  }
```

evalAsync 也是如此

```js
 $evalAsync(expression) {
    if (!this.$$phase && !this.$$asyncQueue.length) {
      setTimeout(() => {
        if (this.$$asyncQueue.length) {
          this.$root.$digest() //
        }
      }, 0)
    }

    this.$$asyncQueue.push({
      scope: this,
      expression: expression
    })
  }
```

### 2.4 isolated Scope

```js
if (isolated) {
  child = new Scope();
  child.$root = this.$root;
}
```

### 2.5 传入其他 scope 作为 parent

eval 的时候 scope 值

### 2.6 destorying scope

需要保存一个`$parent`的引用, 通过 parent.\$\$children 来移除当前 scope
