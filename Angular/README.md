## 前言

因公司业务需要维护 Angular 代码, 几年来, 从 AngularJS 到 Vue 再到 React, 兜兜转转还是回到了原点, 秉承着要用什么学什么, 重学 Angular.(又开了一个坑)

## 企业级框架

Angular 不仅仅是一个用于构建 UI 的库，还包括了路由、表单处理、依赖注入、HTTP 客户端、命令行工具等，形成了一个完整的、规范化的开发生态系统。

而在 React 生态中, UmiJS 等才是同一级别企业级框架, 它基于 React, 集成了大量优秀的第三方库, 并提供了开箱即用的功能, 比如路由、状态管理、构建工具等。

如果要用一句话对比 Angular 与 React 的话, 大概是:

> Angular = React + Redux + React Router + i18n-next + Axios + ...

对于有选择困难症的人来说, 一键配置,并提供 [Best practice](https://angular.dev/style-guide) 才是最好的,

比如 React, 状态管理库满天飞, API 重新学习需要花成本, 但真的解决问题或者比旧方案有显著提升了吗, 未必?

但大而全的缺点也很明显, 比如有遇到不想用内置的 DvaJS, 或者是有要改 Webpack 配置的时候就会比较痛苦.

## 为什么火不起来

个人觉得, 火不起来的原因有以下:

- AngularJS 到 Angular2 断崖式升级, 让很多开发者丧失了信心
- 学习曲线比较陡峭, 老鸟还好, 有其他框架的使用经验, 但对新人而言概念比较多, Typescript, 依赖注入, RXJS, ZoneJS...
- 对比 Vue 的渐进式文档, Angular 的文档还是差点. 中文文档更新不及时也将一大波国内初级开发者拒之门外

## 如何学

采用基础概念 + 实践的方式, 目的是为了尽快熟悉 Angular 中的 API, 同时与其他框架(Vue, React 对比)

基础:

- Angular 中的组件
- 组件通讯
- Angular 中的服务
- Angular 中的指令
- Angular18 中的 Signal
- 项目结构

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

插件安装: `Angular Language Service`

组件在线预览: [地址](https://chenxiaoyao.cn/ng-ui/)

## 参考

- 官方文档: https://angular.dev/
