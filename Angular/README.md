## 前言

因公司业务需要维护 Angular 代码, 几年来, 从 AngularJS 到 Vue 再到 React, 兜兜转转还是回到了原点, 秉承着要用什么学什么, 重学 Angular.(又开了一个坑)

## 企业级框架

Angular 不仅仅是一个用于构建 UI 的库，还包括了路由、表单处理、依赖注入、HTTP 客户端、命令行工具等，形成了一个完整的、规范化的开发生态系统。

而在 React 生态中, UmiJS 等才是同一级别企业级框架, 它基于 React, 集成了大量优秀的第三方库, 并提供了开箱即用的功能, 比如路由、状态管理、构建工具等。

如果要用一句话对比 Angular 与 React 的话, 大概是:

> Angular = React + Redux + React Router + i18n-next + Axios + React SSR ...

对于有选择困难症的人来说, 一键配置,并提供 [Best practice](https://angular.dev/style-guide) 才是最好的,

比如 React, 状态管理库满天飞, API 重新学习需要花成本, 但真的解决问题或者比旧方案有显著提升了吗? 未必.

但大而全的缺点也很明显, 比如有遇到不想用内置的 DvaJS, 或者是有要改 Webpack 配置的时候就会比较痛苦.

## 为什么在国内火不起来

个人觉得, 火不起来的原因有以下:

- AngularJS 到 Angular2 断崖式升级, 让很多开发者丧失了信心
- 学习曲线比较陡峭, 老鸟还好, 有其他框架的使用经验, 但对新人而言概念比较多, Typescript, 依赖注入, RXJS, ZoneJS...
- 对比 Vue 的渐进式文档, Angular 的文档还是差点. 中文文档更新不及时也将一大波国内初级开发者拒之门外
- 基于前面的几点, 导致了国内的生态不活跃, 类似(xx 管理系统, xx 商城等, 绝大多数前端干的都是这类活), 反过来也是如此

## 一些使用上的感受

主要和 React 的对比

## 语法复杂

1. 在旧版本的 Angular 中新建一个组件要创建 4 个文件, 还要有 Module 的概念, 新版本引入了 standalone 组件, 但还是不方便, 各类 import, 比如一个 ngClass 之类的东西为啥就不能内置, 还得单独引入 ngClass 或者 CommonModule

```ts
@Component({
  selector: "app-file-tree",
  templateUrl: "./file-tree.component.html",
  styleUrls: ["./file-tree.component.scss"],
  standalone: true, // 去除Module, 组件也可以引入模块了
  imports: [MatIconModule, MatTreeModule, NgClass, NgStyle], // 又或者是引入CommonModule
  changeDetection: ChangeDetectionStrategy.OnPush, // 优化策略
})
export class FileTreeComponent {
  //
}
```

对比 React, 哪个舒服一目了然

```ts
import { Icon } from "antd";

function FileTreeComponent() {
  return <Icon />;
}
```

### 模板与 jsx

总的来说还是喜欢 JSX:

- Angular 模板需要记太多语法糖, 比如新版本的 Angular 为了引进 Signal, 又添加了一套 for, if 的语法糖, 对于新旧项目都要写的人, 很蛋疼, 而 JSX 会 JS 就行
- 组件模板是连字符的形式, 导入的模块是首字母大写的形式, 要找 Props 不太方便(比如我引入了一个三方组件, 想快捷通过 ts 类型定义找到参数不太容易)

至于你说模板的性能比 Jsx 好, 我觉得快速出活对开发仔来说才是最重要的, 那点性能不值一提.

## 如何学

采用基础概念 + 实践的方式, 目的是为了尽快熟悉 Angular 中的 API, 同时与其他框架(Vue, React 对比)

基础:

- Component 组件
- [Directive 指令](./Directive指令.md)
- Pipe 管道
- Service 服务
- Signal
- 依赖注入

实现:

- CheckBox && Checkbox group
- 实现 Modal(对比 React Portal)
- 实现 Message(Alert 组件)
- 递归组件 tree
- 表单
- 路由 && 路由实现
- Rxjs 学习
- ...

## 项目搭建

代码还是在(\_demo)文件目录下, 脚手架用了[storybook](https://storybook.js.org/tutorials/intro-to-storybook/angular/en/get-started/)的

当前 Angular 版本: 18.0.0

插件安装: `Angular Language Service`

组件在线预览: [地址](https://chenxiaoyao.cn/ng-ui/)

## 参考

- 官方文档: https://angular.dev/
