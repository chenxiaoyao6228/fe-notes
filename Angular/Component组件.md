## 前言

## 组件要素

## 模板语法

## 组件通讯

### 父子

- Input
- @ViewChild

- Output
- 依赖注入间接获取 parent 的实例

- service + rxjs BehaviorObject
- 路由传参, localStorage 传参

## 内容嵌入与 ng-content

- 默认插槽
- 具名插槽

## 组件生命周期

Vue, React, Angular 的对比

- constructor vs ngOnInit

## 变化监测

### 异步任务的来源

- Event
- XHR/Websocket
- Timers: setTimeout/RequestAnimationFrame

### 变动通知机制

React 中使用了从 root 开始 reconcile 的策略

Angular 中使用了 ngZone

Vue 使用了$watcher

### 变更策略

ChangeDetectionStrategy 用于控制组件的变更检测策略。变更检测是 Angular 框架用于检查数据变化并更新 UI 的机制。ChangeDetectionStrategy 有两种主要模式：Default 和 OnPush。让我们来详细解释一下这两种策略。

#### Default

这是 Angular 的默认变更检测策略。当使用 Default 策略时，Angular 会在以下情况下检查和更新组件的视图：

- 组件的输入属性（@Input）发生变化时。
- 组件触发事件时（例如点击按钮、输入框变化等）。
- 定时器（setTimeout、setInterval）触发时。
- 任何异步操作完成时（例如 Promise、Observable）。

这种策略会对整个组件树进行变更检测，从根组件开始，直到所有子组件都检测完毕。这样做的好处是确保所有可能的变化都能被检测到并反映在 UI 上，但代价是性能开销较大，尤其是在组件树较深或组件数量较多时。

#### OnPush

当使用 OnPush 策略时，Angular 只会在以下情况下检查和更新组件的视图：

- 组件的输入属性（@Input）发生变化，并且变化是通过引用发生的（即引用地址改变，而不是对象内部属性改变）。
- 组件内部触发事件时（例如点击按钮）。
- 使用 markForCheck 或 detectChanges 方法手动触发变更检测。
- OnPush 策略不会自动检测所有变化，只在输入属性引用改变时进行检测。这可以显著提高性能，因为减少了不必要的变更检测次数，尤其是在大型应用中。

OnPush 模式是 Angular 对组件进行性能优化的一个方式，组件是 OnPush 模式意味着只有当组件的参数的引用更新后才会执行组件极其子组件的变化检测，参数无变化的情况下是会跳过变化检测的，就跟 React 的 useMemo 类似。

#### ZoneJS

## 组件设计

在实现一个基础组件的时候，我们通常有三种对外使用的方式：全局服务、组件、指令，组件设计阶段最先考虑的应该是组件的划分、是否提供指令、是否提供服务等。

## Module 模块 && standalone component

优点:

模块的缺点:

### Provider

### Ref

## 参考

- https://blog.angular-university.io/angular-standalone-components/
- https://medium.com/@antmihlin/getting-rid-of-ngmodule-in-angular-javascript-43fd510779bc
- https://www.zhihu.com/question/21550655/answer/2403312676
