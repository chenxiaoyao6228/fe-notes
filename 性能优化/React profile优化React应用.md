## 前言

React DevTools中的Profile工具用于收集和分析React应用的性能数据。它能够提供有关组件渲染时间、函数执行时间等详细信息，帮助开发者找到性能瓶颈并进行优化。React DevTools只能定位发生在 commit 阶段（提交阶段）的性能问题, [什么是commit与render](https://dev.to/thee_divide/reconciliation-react-rendering-phases-56g2)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/react-lifecycle.png)

## 安装 && 使用

在浏览器的扩展商店中搜索并安装React DevTools。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/react-devtools.png)

安装成功之后打开一个React本地开发的页面，就可以看到对应的Profile选项了

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/react-devtools-profile-1.png)

## 面板介绍

Profile的面板分为三个部分: 工具栏、commit 选择区域、详情区域

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/react-devtool-profile-panel.png)


### 工具栏

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/react-devtool-profile-panel-1.png)

从左到右依次是：

- 录制、停止录制、清除记录按钮
- 火焰图、排行榜视图切换按钮: 
- 根组件选择器
- 设置按钮
- commit 选择区域。每一条对应一个commit，颜色越黄、高度越高，代表该commit耗时越长

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/react-devtool-profile-panel-2.png)


设置面板建议勾选上：Record why each component renderer while profiling. 后续可以告知每一次 re-render 的原因。

### 详细信息

commit信息区域

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/react-devtool-profile-panel-3.png)

应用火焰图

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/react-devtool-profile-panel-4.png)

点击具体的commit，可以看到对应的commit的原因, 比如这里我们看到是'Hooks 4 and 7 changed', 说明是第4个和第7个hooks发生了变化，导致了这次commit。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/react-devtool-profile-panel-5.png)

我们可以切换到`Components`Tab下面，就可以看到具体的hook了

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/react-devtool-profile-panel-6.png)

接下来要做的就是对这些代码进行具体分析了。

## 案例

TODO