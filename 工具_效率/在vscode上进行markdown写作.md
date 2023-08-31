# 在vscode上进行markdown写作

## markdown 编辑器比对

markdown 的出现为写作者提供了很好的文章书写体验,同时 markdown 文件很容易发布到多个平台, 鉴于此,世面上的 markdown 编辑器有[很多](https://zhuanlan.zhihu.com/p/69210764), 如**Typora**, **Draft**..., 作为`vscode`深度使用者而言, 集成插件, 使用 vscode 作为自己的 markdown 编辑器也是一种不错的选择.

markdown 编辑器一般会集成几个功能: 快速编辑, 实时预览, 图片上传以及插入, 当然还有导出 pdf 等高级功能, vscode 插件可以帮助我们解决这些问题

## markdown 快捷键

### 常用快捷键

加粗, 下划线, 插入链接, 插入图片等是常用的功能, 可以通过[markdown shortcut 插件](https://marketplace.visualstudio.com/items?itemName=mdickin.markdown-shortcuts)

![2019-10-29-13-33-36](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019//10/2019-10-29-13-33-36.png)

## emoji😸

使用 emoji 也是为文章添色的一种方法, 这里推荐的是[emoji](https://github.com/Perkovec/Emoji.git)

![emoji](https://github.com/Perkovec/Emoji/raw/master/example.gif)

## 图片编辑与管理

图片的处理需要考虑两个因素:

### 一.便捷性

截图粘贴自动预览, 提升写作体验, 可以用的工具有很多, 如[picGo](https://picgo.github.io/PicGo-Doc/zh/)

### 二. 可迁移性

图片应该与文档解耦, 这样无论是换静态博客生成器(hexo, next.js), 还是自己的动态博客, 图片都不应该受到影响.

这意味着我们的图片应该选择**绝对路径**, 因此需要使用图床

使用图床需要考虑的**中途迁移**的问题:

- 免费图床可能会挂, 且可能有容量限制(如 github)
- 免费图床可能会升级为收费
- 现有图床后续收费可能不合理, 想更换
  ....

想到的解决办法是: **备份同步**

- 图片文件夹按照年/月的方式进行管理
- 同步到云盘设备, 如百度云

~~因为自己现有的图床是七牛, picGo 文档太长....因此找了 vscode 的插件, [paste-image-to-qiniu](https://marketplace.visualstudio.com/items?itemName=favers.paste-image-to-qiniu), 支持**截图上传,并生成本地文件**,功能对我来说, 够了.
![](https://github.com/favers/vscode-qiniu-upload-2019/raw/master/screenshot/screenshot.gif)~~

> 域名备案失效，导致七牛的图床无法访问

### Github + jsdelivr.net

这个没什么好说的, 图片地址: https://github.com/chenxiaoyao6228/cloudimg

使用格式: https://raw.githubusercontent.com/chenxiaoyao6228/cloudimg/main/2021/logo-small.png, 经过测试,在掘金等平台上也是可以访问的, 开发的时候可以使用 snippet 完成这个工作

测试如下
![](https://raw.githubusercontent.com/chenxiaoyao6228/cloudimg/main/2021/logo-small.png)

在使用之后发现图片在国内的网络环境下无法访问, 去搜索了一下, 发现可以通过`cdn.jsdelivr.net`来解决这个问题

替换前

> https://raw.githubusercontent.com/chenxiaoyao6228/cloudimg/main/2021/logo-small.png

替换后

> https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2021/logo-small.png,

注意除了域名前缀, 相应的要把 git 的仓库分支名改动一下

可以使用 alfred 等工具制作一个 snippet 添加图片的前缀, 相比后面的方案, 少了插件的安装, 也还算是不错的选择
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2022/alfred-pic-snippet.png)

## 文章预览

使用插件如[markdown github preview](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles)可以解决预览问题
![Markdown Preview Github Styling](https://github.com/mjbvz/vscode-github-markdown-preview-style/raw/master/docs/example.png)

## markdown 写作规范

对于写作规范可以参考阮一峰老师的[中文技术文档的写作规范](https://github.com/ruanyf/document-style-guide)

## 参考资料:

- https://code.visualstudio.com/docs/languages/markdown
- https://www.zhihu.com/question/21065229/answer/132993179
