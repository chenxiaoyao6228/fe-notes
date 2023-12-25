## 前言

本文主要总结 webpack 构建优化相关的事情

> PS: webpack 的每次更新都会带来很多的新特性，因此学习新知识的时候，不要专注于流程的配置和调参。因为流程终会简化，参数（API）终会升级。要抓大放小，把精力放在最核心的内容上，因为核心的思想是最不容易过时的.

## webpack 性能瓶颈

webpack 优化主要分为两个方向：

### 构建速度优化

- 使用最新版本的 webpack，一般融合了最佳实践
- 文件过滤：使用 include 和 exclude， ignorePlugin 等
- 优化 resolve.modules 配置: 合理配置 resolve.modules，指定 Webpack 去哪些目录下寻找模块。避免过多的目录会加速模块的查找速度。
- 优化 loader(减少 loader 链的复杂性， 如 thread-loader 或 cache-loader)
- 利用多核 CPU 多进程构建( HappyPack 或者 Webpack 5 提供的 cache 和 parallel 选项)
- 缓存(DLL 等空间换时间的方案)
- 使用更轻量的 SourceMap（cheap-module-source-map）
- 代码分割： 将代码拆分成小块，只加载在当前页面上需要的部分。
- 合理配置打包版本

#### 代码分割(拆包 splitChunks)

在不配置拆包的情况下，Webpack 会将所有的资源都打包在一个 js 文件中，这无疑会让请求时候的响应体积变得非常大，从而降低加载速度。

同时，不配置拆包，会在首次加载的时候加载一些无关的资源，浪费了一次宝贵的请求。合理配置拆包，让每次请求都只请求对应的核心资源，从而达到按需加载的程度。

拆包通常的逻辑：

- 业务代码和第三方依赖进行拆分
- 对于第三方依赖：
  - 将版本经常变动的与版本不怎么变动的进行拆分
  - 版本不怎么变动的依赖可以合理配置 CDN
- 对于业务代码：
  - 将业务模块和公共模块进行拆分
  - 业务模块也根据调用的次数进行拆分
  - 将首屏模块单独进行拆分

#### 合理配置打包版本

### 代码体积优化

- Three shaking 移除项目中未使用的代码
- 压缩代码: 如 terser-webpack-plugin, css-minimizer-webpack-plugin
- 分割代码（Code Splitting）
- 动态导入（Dynamic Import）
  - import('some-module').then(({ someModule }) => {// 使用 someModule});
- 提取公共模块： 通过 Webpack 的 CommonsChunkPlugin 或 optimization.splitChunks 来提取公共模块，减小重复模块的体积
- 图像、字体等资源优化

掌握优化策略，然后用到的时候直接通过官方文档查找最新的 API 即可或者搜索关键字即可

## 参考

- https://jelly.jd.com/article/61179aa26bea510187770aa3
- https://juejin.cn/post/6844903952140468232
