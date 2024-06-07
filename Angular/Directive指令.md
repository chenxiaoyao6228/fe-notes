## 指令

在 Angular 中，指令用于扩展 HTML 的功能，允许你在 DOM 元素上添加自定义行为或修改现有的行为。指令可以用来操控 DOM、绑定事件、改变元素的样式或结构，从而实现特定的交互效果和动态 UI 变化。

使用指令的关键在于是否需要在多个地方复用某种行为、是否需要直接操作 DOM、以及是否需要在不改变组件结构的情况下添加功能。如果是这样，使用指令是合适的选择；否则，使用组件或其他方法可能更为简便和高效。

Vue 中也有一样的概念, 不过是语法不同罢了

## 一个例子: scrollDirective

```ts
// scroll.directive.ts
import { Directive, HostListener, Output, EventEmitter } from "@angular/core";

@Directive({
  selector: "[appScroll]",
})
export class ScrollDirective {
  @Output() scrollPosition = new EventEmitter();

  @HostListener("scroll", ["$event"])
  onScroll(event: any): void {
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const offsetHeight = event.target.offsetHeight;
    const scrollPosition = scrollTop + offsetHeight;

    // 发送滚动事件
    this.scrollPosition.emit({
      scrollTop,
      scrollHeight,
      offsetHeight,
      scrollPosition,
      atBottom: scrollPosition >= scrollHeight,
    });
  }
}
```

使用

```ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { ScrollDirective } from "./scroll.directive";

@NgModule({
  declarations: [AppComponent, ScrollDirective],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

在组件的模板中使用 appScroll 指令，并监听 scrollPosition 事件：

```html
<div
  appScroll
  (scrollPosition)="onScroll($event)"
  style="height: 200px; overflow-y: scroll;"
>
  <div style="height: 1000px;">Scrollable content...</div>
</div>
```

在组件类中定义 onScroll 方法来处理滚动事件：

```ts
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  onScroll(event: any): void {
    console.log("Scroll Event:", event);

    if (event.atBottom) {
      console.log("Reached the bottom!");
    }
  }
}
```

## 为什么 React 不需要指令

主要与 React 的设计哲学和核心理念有关

- 组件化设计: React 的核心是组件（Components），它们是构建用户界面的基本单位。每个组件都可以包含自己的逻辑和 UI，而不需要依赖外部指令来扩展功能。组件本身就是最小的功能单元，负责渲染和管理自身的状态和行为。

- JSX 的简洁性: React 使用 JSX 来描述 UI 结构，JSX 看起来类似于 HTML，但它是完全在 JavaScript 中的。这种方式使得 UI 逻辑和渲染逻辑紧密结合在一起，而不是像 Angular 中的指令那样分离。通过这种方式，React 代码更加直观和简洁。

- Hooks 的引入: React 引入了 Hooks，使得在函数组件中可以方便地使用状态和其他 React 特性。Hooks 提供了一种在组件中复用逻辑的方式，而不需要创建复杂的指令。比如，useEffect 和 useState 等 Hook 可以在函数组件内部管理副作用和状态，从而避免了对指令的需求。

### 如何用 React Hooks 实现 scrollDirective

```jsx
// useScroll.ts
import { useEffect, useRef, useCallback } from "react";

function useScroll(callback) {
  const ref = useRef(null);

  const handleScroll = useCallback(() => {
    const scrollTop = ref.current.scrollTop;
    const scrollHeight = ref.current.scrollHeight;
    const offsetHeight = ref.current.offsetHeight;
    const scrollPosition = scrollTop + offsetHeight;

    callback({
      scrollTop,
      scrollHeight,
      offsetHeight,
      scrollPosition,
      atBottom: scrollPosition >= scrollHeight,
    });
  }, [callback]);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener("scroll", handleScroll);
      return () => {
        node.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  return ref;
}
```

在组件中使用

```jsx
import React from "react";
import useScroll from "./useScroll";

function App() {
  const onScroll = (event) => {
    console.log("Scroll Event:", event);

    if (event.atBottom) {
      console.log("Reached the bottom!");
    }
  };

  const scrollRef = useScroll(onScroll);

  return (
    <div ref={scrollRef} style={{ height: "200px", overflowY: "scroll" }}>
      <div style={{ height: "1000px" }}>Scrollable content...</div>
    </div>
  );
}

export default App;
```

## 内置指令

Angular 提供了许多内置指令，主要分为结构型指令和属性型指令.

### 属性型指令

属性型指令通过更改元素的行为或外观来影响元素。

| 指令      | 说明                             | 示例                                                                                                     |
| --------- | -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `ngClass` | 动态添加或移除 CSS 类            | `<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }">Class Binding</div>`                    |
| `ngStyle` | 动态设置内联样式                 | `<div [ngStyle]="{ 'color': isRed ? 'red' : 'blue', 'font-size': fontSize + 'px' }">Style Binding</div>` |
| `ngModel` | 用于双向数据绑定，常用于表单元素 | `<input [(ngModel)]="username" placeholder="Enter your name">`                                           |

### 结构型指令

结构型指令通过添加、移除或替换 DOM 元素来改变 DOM 布局。结构型指令通常带有星号 (\*) 前缀。

| 指令                 | 说明                                                | 示例                                                                                                                                     |
| -------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `*ngIf`              | 根据条件表达式的真假值来添加或移除元素              | `<div *ngIf="isVisible">Content is visible</div>`                                                                                        |
| `*ngIfElse`          | 使用 `else` 模板来渲染不同的模板                    | `<div *ngIf="isVisible; else elseTemplate">Content is visible</div>` `<ng-template #elseTemplate><p>Content is hidden</p></ng-template>` |
| `*ngFor`             | 根据集合的数据项来重复渲染元素                      | `<div *ngFor="let item of items">{{ item }}</div>`                                                                                       |
| `ngForTrackBy`       | 提高 `*ngFor` 渲染效率，使用 `trackBy` 函数来追踪项 | `<div *ngFor="let item of items; trackBy: trackByFn">{{ item }}</div>`                                                                   |
| `*ngSwitch`          | 根据表达式的值来显示不同的元素                      | `<div [ngSwitch]="value">`                                                                                                               |
| `*ngSwitchCase`      | 在 `*ngSwitch` 内，指定匹配某个值时显示的元素       | `<div *ngSwitchCase="'a'">Case A</div>`                                                                                                  |
| `*ngSwitchDefault`   | 在 `*ngSwitch` 内，指定默认显示的元素               | `<div *ngSwitchDefault>Default case</div>`                                                                                               |
| `*ngTemplateOutlet`  | 动态渲染模板                                        | `<ng-container *ngTemplateOutlet="templateRef; context: myContext"></ng-container>`                                                      |
| `*ngComponentOutlet` | 动态渲染组件                                        | `<ng-container *ngComponentOutlet="myComponent"></ng-container>`                                                                         |

## 指令生命周期

与组件的生命周期钩子类似

## 指令组合 API
