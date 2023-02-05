---
title: 理解angularJS中的transclusion
categories:
  - tech
tags:
  - angular
date: 2019-12-22
permalink: 2019-12-22-understand-transclusion-in-angularJS
---

## transclusion 是什么

在字典中并没有找到相应的词汇，维基百科上有一条关于此的解释。

> 在计算机科学中，transclusion(包含？)是指通过超文本引用将一部分或全部电子文档包含到一个或多个其他文档中。

![transclusion](https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Transclusion_simple.svg/250px-Transclusion_simple.svg.png)

类比一下 Vue 的 slot(插槽)就很容易理解它的使用场景了, modal, layout, tabbar，grid 自定义组件等都需要用到插槽，这些组件只是作为一个基本的 wrapper, 内容由用户提供。

```vue
// 简单的base-layout组件
<div class="container">
  <header>
    <slot name="header"></slot> //具名插槽
  </header>
  <main>
    <slot></slot> //默认插槽 na
  </main>
  <footer>
    <slot name="footer">默认的footer的内容</slot> // 具名插槽,带默认内容
  </footer>
</div>
```

```vue
<base-layout>
  <template v-slot:header>
    <h1>title</h1>
  </template>

  <p>some main content</p>
  <p>some other content</p>

  <template v-slot:footer>
    <p>footer</p>
  </template>
</base-layout>
```

可以看到，我们需要有允许用户选择在不同的地方放置不同内容的能力。

## tranclude 的基本用法

来看下 AngularJS 中对应的方法使用

### 用法 1.transclude: true

#### ng-transclude

定义 container 指令， template 中定义的 ng-transclude 对应我们的 slot, 也就是内容被填充的地方

```js
.directive("foo", function() {
  return {
    transclude: true,
    template: "<div>the template</div><ng-transclude></ng-transclude>"
  };
})

```

```html
<div foo>Some Content Here</div>
```

最终生成的 html 是这样的, foo 之中的内容被搬到了 ng-transclude 标记的位置

```html
<div foo>
  <div>the template</div>
  <div ng-transclude>Some Content Here</div>
</div>
```

#### transclude: element + ng-transclude

与 transclude: true 不同， transclude:element 会把 ng-transclude 所在的块也换掉

```html
<div>
  <div ng-transclude>
    <span>{{ something }}</span>
    {{ otherThing }}
  </div>
</div>
```

```html
<div>
  <!-- transcluded -->
</div>
```

另外一个常见的例子是 ng-repeat

```html
<ul>
  <li ng-repeat="color in colors">{{color}}</li>
</ul>
```

结果为

```html
<ul>
  <!-- ngRepeat: color in colors -->
  <li ng-repeat="color in colors" class="ng-binding ng-scope">red</li>
  <!-- end ngRepeat: color in colors -->
  <li ng-repeat="color in colors" class="ng-binding ng-scope">blue</li>
  <!-- end ngRepeat: color in colors -->
  <li ng-repeat="color in colors" class="ng-binding ng-scope">green</li>
  <!-- end ngRepeat: color in colors -->
  <li ng-repeat="color in colors" class="ng-binding ng-scope">black</li>
  <!-- end ngRepeat: color in colors -->
</ul>
```

#### 默认插槽

下面的例子中， 在没有指定内容的情况下`<b style="color: red;">Button1</b>`这段会作为默认的内容

```html
<script>
  angular
    .module("transcludeFallbackContentExample", [])
    .directive("myButton", function () {
      return {
        restrict: "E",
        transclude: true,
        scope: true,
        template:
          '<button style="cursor: pointer;">' +
          "<ng-transclude>" +
          '<b style="color: red;">Button1</b>' +
          "</ng-transclude>" +
          "</button>",
      };
    });
</script>
<!-- fallback button content -->
<my-button id="fallback"></my-button>
<!-- modified button content -->
<my-button id="modified">
  <i style="color: green;">Button2</i>
</my-button>
```

#### 多插槽

像上面的 vue container 的例子，我们有时候希望能在不同的地方插入节点, 而 angularJS1.5 开始支持 multi-slot 多插槽机制, 现在的 transclude 拥有三种值，true, element, object 对象

```html
angular.module('multiSlotTranscludeExample', []) .directive('pane', function(){
return { restrict: 'E', transclude: { 'title': '?pane-title', 'body':
'pane-body', 'footer': '?pane-footer' }, template: '
<div style="border: 1px solid black;">
  ' + '
  <div class="title" ng-transclude="title">Fallback Title</div>
  ' + '
  <div ng-transclude="body"></div>
  ' + '
  <div class="footer" ng-transclude="footer">Fallback Footer</div>
  ' + '
</div>
' }; })
```

#### 作用域插槽

插槽要注意作用域的问题，见[vue 文档的编译作用域](https://cn.vuejs.org/v2/guide/components-slots.html#%E7%BC%96%E8%AF%91%E4%BD%9C%E7%94%A8%E5%9F%9F)

> 父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

### 用法 2. tranclude()与 transclude(cb)

在有些情况下(比如内部的 ng-repeat 指令)，你需要对同一片模板进行复制，填充不同的数据，angularJS 官方在 link,compile 以及 controller 都提供了 transclude 参数

1）不带 cb 的情况

```js
directive("foo", function () {
  return {
    template: "<div>the template</div>",
    transclude: true,
    link: function (scope, element, attrs, ctrl, transclude) {
      element.append(transclude());
      element.append(transclude());
      element.append(transclude());
    },
  };
});
```

```html
<div foo>
  <div>
    the template
    <div>Some Content Here</div>
  </div>
</div>
```

在这种情况下，插槽的内容只会复制一次，因此每次进行 append 操作的时候, 操作的都是同一个 dom 结构

2）带 cb 的情况

```js
.directive("foo", function() {
  return {
    template: "<div>the template</div>",
    transclude:true,
    link: function(scope, element, attrs, ctrl, transclude) {
      transclude(function(clone) {
        element.append(clone);
      });
      transclude(function(clone) {
        element.append(clone);
      });
      transclude(function(clone) {
        element.append(clone);
      });
    }
  };
})
```

最终填充出来的 HTML 是这样的

```html
<div foo>
  <div>
    the template
    <div>Some Content Here</div>
    <div>Some Content Here</div>
    <div>Some Content Here</div>
  </div>
</div>
```

和上面不同的是，模板被进行了三次复制。

## Transclusion 与 scope 作用域

在 AngularJS 1.3 或更高版本中，默认情况下，被插入的内容的作用域范围将是该指令范围的子范围(在上面的例子中就是我们的 foo, 而不是在 ng-transclude 的范围下面)。

当然,transclude 还提供了 scope 参数，方便我们修改 scope 的值

```js
tranclude(scope, function (clone) {});
```

关于作用域的的具体请看[这里翻译的官方的 wiki](2020-12-22-understand-scope-in-angularJS)

## 参考资料

<https://docs.angularjs.org/api/ng/directive/ngTransclude>

<https://www.accelebrate.com/blog/angularjs-transclusion-part-1>
