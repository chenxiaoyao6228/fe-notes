## 前言

本文探讨下前端国际化 RTL 适配相关的知识, 内容包括:

- RTL 适配需要了解的背景知识
- 前端 RTL 适配方案
- 改造过程中的一些踩坑记录

## RTL 适配基础

RTL 是 "Right-to-Left" 的缩写，表示从右到左。它是一种文本书写和布局方向，与 LTR（"Left-to-Right"，从左到右）相对应。在 RTL 的布局中，文本和元素的方向是从右边开始，逐渐向左边延伸。这种方向通常用于阿拉伯语、希伯来语、波斯语等从右向左书写的语言。

为了更加直观地了解 RTL 适配，这里列举一些网站供参考:

- Al Jazeera (新闻) https://www.aljazeera.net/

- Asharq Al-Awsat (新闻) https://aawsat.com/

- Souq (亚马逊中东，电商) https://www.souq.com/sa-en/

- Emirates Airlines (航空) https://www.emirates.com/

- Arabian Business (商业) https://www.arabianbusiness.com/

总的来说，需要处理下列场景:

- 文本方向： 所有文本都需要正确地从右到左排列。包括标题、段落、列表和按钮等。确保文本的读取方向符合 RTL 语言的习惯。

- 布局方向： 整体布局需要调整，以确保页面元素在 RTL 方向下正确对齐。这可能涉及到盒模型、边距、填充以及其他与布局相关的样式。

- 导航菜单： 导航菜单的方向需要从左到右变为从右到左。菜单项的顺序和对齐也需要相应调整。

- 表单元素： 表单元素需要正确地适应 RTL 语言，包括输入框、复选框、单选按钮和提交按钮等。

- 图标和图像： 图标和图像**可能**需要根据文本方向进行翻转，以确保它们在 RTL 方向下显示正确。

- 动画和过渡： 如果有动画或过渡效果，需要确保它们在 RTL 方向下表现自然且不会导致混乱。

除了上述，还有一些细节需要注意，比如字体，letter-spacing, 我们在设计与开发的时候，可以参考一些比较有名的 guideline：

- [rtl-styling](https://rtlstyling.com/posts/rtl-styling)

- [material-ui bidirectionality](https://m2.material.io/design/usability/bidirectionality.html#mirroring-layout)

## 浏览器对 RTL 的支持

Web 对 RTL 的支持是通过 HTML 与 CSS 的属性来实现的

#### direction

dir 用于设置文本的书写方向, dir 属性是继承的，这意味着如果你在父元素上设置了 dir 属性，子元素会继承这个方向。这种继承性是按照文档流的方向来应用的。

例如，如果你在文档的 `<html>` 元素上设置了 dir="rtl"，**那么整个文档内的元素，除非被显式设置了不同的方向，否则都会继承这个右到左的方向**。这包括文本、块级元素、内联元素等。

因此一般而言，只需要在根元素 html 设置一次即可， CSSWG 也建议在 html 根元素上定义方向，以确保在没有 CSS 的情况下正确的双向布局。

```html
<html dir="rtl"></html>
```

#### direction 的不足

通过测试可以发现 direction 只能改变 display: flex/inline-block 元素的书写方向，对于 float/绝对定位等布局就无能为力

- [inline-block 布局](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/业务相关/_demo/css-direction/direction-inline-block.html)

- [flex 布局](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/业务相关/_demo/css-direction/direction-flex.html)

- [float 布局](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/业务相关/_demo/css-direction/direction-float.html)

- [绝对定位布局](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/业务相关/_demo/css-direction/direction-positioned.html.html)

另外 direction 无法改变 margin, padding, border 的水平方向，也就是说除非你的元素是居中的，否则当你的元素是不对称的话，即使你改变了元素的书写方向和顺序，margin-left 还是指向左边的，它并不会留出右边的空白。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/rtl-css-direction-margin-padding-border.png)

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/业务相关/_demo/css-direction/direction-border-margin-padding.html)

#### css 逻辑属性

逻辑属性是一组用于处理多语言文本布局的 CSS 属性，它们考虑了文本书写的逻辑流，而不仅仅是传统的从左到右（LTR）或从右到左（RTL）的概念。这些属性允许开发者以更直观的方式指定布局，而不受具体书写方向的限制。比如下面一段代码:

```css
.box {
  width: 100px;
  height: 100px;
  background-color: lightblue;
  margin-inline-start: 20px; /* 在LTR布局中为margin-left，在RTL布局中为margin-right */
}
```

margin-inline-start 属性在 LTR 布局中为 margin-left，在 RTL 布局中为 margin-right，这样就不需要在 LTR 和 RTL 布局中分别设置 margin-left 和 margin-right 了。

但总体来说逻辑属性还是比较新的，对于 TO C 产品需要考虑对应的兼容性问题，或者使用[插件](https://www.npmjs.com/package/postcss-logical)转化为安全的传统的 CSS 属性。

#### unicode-bidi

浏览器默认根据 HTML 根元素上的 dir 属性设置文本方向，也就是说**大部分情况下我们仅需要在根元素上设置 dir 属性即可。但是如果文本中混有左->右和右->左的文字（如英语+阿拉伯语），则开发人员需要使用 unicode-bidi 属性来控制方向**。

bidi 是"bidirectional"的缩写，表示双向文字，即一段文字包含两种不同方向的文字。Unicode 双向算法是处理这种文字的常见方法，而 unicode-bidi 属性用于重写此算法。

[在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/业务相关/_demo/css-direction/unicode-bidi.html)

## 前端 RTL 适配方案

### direction + 手动处理样式方案

从 MDN 的这个[视频](https://youtu.be/3qQeCPl3cjk)可以看到，”远古“时代的前端是如何处理 RTL 布局的:

- 通过在 html 根元素上设置 dir 属性
- 将样式表中的有方向与无方向的的属性进行分离
- 手动处理有方向的属性，比如将`margin-left`转换为`margin-right`

但是显而易见，这样的方式过于繁琐，而且容易出错，因此后续出现了一些自动化的方案。

### less/scss 预处理语言混合指令特性

首先创建一个名为`rtl.less`的公共 mixin 指令文件

```less
.margin-left(@val: 0) {
  margin-left: @val;

  [dir="rtl"] & {
    margin-left: initial;
    margin-right: @val;
  }
}
```

然后，在样式文件中引入该 mixin 文件，并使用`.margin-left`来调用：

```less
@import "path/to/rtl.less";

.el {
  border: 1px solid #000;
  .margin-left(10px);
}
```

最终生成的样式如下：

```css
.el {
  border: 1px solid #000;
  margin-left: 10px;
}

[dir="rtl"] .el {
  margin-left: initial;
  margin-right: 10px;
}
```

### rtlcss 等自动化方案

上述的 mixin 方案虽然有了很大的提升，但仍需显式处理每个有方向属性，增加维护成本。因此，后续出现了一些自动化的方案，比如[rtlcss](https://rtlcss.com/index.html)

rtlcss 是一个基于 Node.js 的自动化 RTL 转换工具，它可以自动转换 CSS 样式表中的属性，比如将`margin-left`转换为`margin-right`，并且可以自动处理一些边界情况，比如`border-radius`、`background-position`等。

下列代码

```css
.el {
  border: 1px solid #000;
  margin-left: 10px;
}
```

经过下列命令转换后

```bash
rtlcss styles.css styles-rtl.css
```

会生成一个新的文件 styles-rtl.css，其中包含了自动生成的 RTL 样式。

```css
.el {
  border: 1px solid #000;
  margin-left: auto;
  margin-right: 10px;
}
```

在 webpack 项目中，我们可以使用[postcss-rtlcss]()

另外，该方案有个缺点，就是对项目中的手写 style 无能为力，只能尽量不要在项目里面写 style

```js
const mySectionStyling = {flexDirection = i18n.dir === “ltr”? “row” :“row-reverse”}
```

### rtlcss + css 逻辑属性方案

前面提到 css 逻辑属性存在兼容性问题，但是对应项目不需要适配旧版本浏览器的话，可以考虑使用该方案。

旧版本的浏览器中可能存在兼容性问题，可以使用 `postcss-logical`插件来处理

### css in js 方案

和 rtlcss 类似，css in js 方案也是通过构建工具来自动处理样式，因为项目中没有用到，所以不做过多介绍，有兴趣可以参考[airbnb 的这个视频](https://www.youtube.com/watch?v=dZ9vQYSNVyo&ab_channel=ReactEurope)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/rtl-css-in-js-airbnb.jpg)

### 方案对比

| 方案                             | 描述                                                                                          | 优点                                                                                          | 缺点                                                                      |
| -------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| direction + 手动处理样式方案     | - 在 html 根元素上设置 dir 属性<br/>- 样式表中有方向与无方向属性分离<br/>- 手动处理有方向属性 | - 完全可控，手动处理每个有方向属性<br/>- 可以在不使用构建工具的情况下实现适配                 | - 繁琐，容易出错<br/>- 维护成本高                                         |
| less/scss 预处理语言混合指令特性 | - 创建 mixin 文件，混入使用<br/>- 自动生成 RTL 样式                                           | - 减少手动处理，提高效率<br/>- mixin 可以重复使用                                             | - 仍需显式处理每个有方向属性                                              |
| rtlcss 等自动化方案              | - 自动转换 CSS 样式表中的属性，如 margin-left 到 margin-right                                 | - 自动处理样式，减少手动操作<br/>- 处理一些边界情况，如 border-radius、background-position 等 | - 需要构建工具支持，配置可能略复杂<br/>- 部分情况下需要手动干预生成的样式 |
| rtlcss + css 逻辑属性方案        | - 使用 css 逻辑属性，如 margin-inline-start                                                   | - 适用于现代浏览器，不需要特殊构建工具                                                        | - 兼容性问题，可能需要使用 postcss-logical 插件进行处理                   |
| css in js 方案                   | - 通过构建工具自动处理样式                                                                    | - 可以使用现代构建工具实现自动处理<br/>- 与 React 等框架集成紧密                              | - 需要构建工具支持，可能需要学习新的工具和方式                            |

上述对比下来，考虑到项目需要在比较老的安卓机上跑，成员使用 css 逻辑变量等考虑，最后选定单纯的 rtlcss 方案，下面的内容都是基于该方案的。

## 改造过程记录

### 基本适配

第一步根据用户设置的语言来设置 html 根元素的 dir 属性

```js
function setDocumentLangDir(lang: Language) {
  const rtlLangs = ["ar-EG"];

  document.documentElement.setAttribute("lang", lang);

  if (rtlLangs.includes(lang)) {
    document.documentElement.setAttribute("dir", "rtl");
  } else {
    document.documentElement.setAttribute("dir", "ltr");
  }
}
```

效果如下, 部分页面的间距会有问题，这是因为是部分 CSS 属性没有正确设置

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/rtl-html-dir.png)

添加`postcss-rtlcss`插件，用于自动转换 CSS 属性，比如将`margin-left`转换为`margin-right`

```js
const postcssRTLCSS = require('postcss-rtlcss');
const { Mode, Source, Autorename } = require('postcss-rtlcss/options');

// postcss loader
 {
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        ident: 'postcss',
        config: false,
        plugins: [
          postcssRTLCSS({
            mode: Mode.combined,
          }),
        ],
      },
      sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
    },
}
```

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/rtl-postcss-rtl.jpg)

可以看到在对应的语言模式下运用了不同的样式表

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/rtl-postcss-rtl-stylesheet.png)

> ps: 上面两步搞完已经差不多能够满足 80%的场景了，但是还有一些场景需要额外处理

### 需要额外处理的场景

上面提到，通过在 html 根元素上设置 dir 属性，可以实现大部分场景的 RTL 适配，但是还有一些场景需要额外处理，比如:

#### 动态创建元素

一般来说，会根据 html 上的 dir 属性来设置输入框的方向，但是如果是动态创建的 input 组件且没有添加到 body 上， 则需要额外的处理, 比如下面 canvas 白板使用了动态创建的 input 组件，需要额外处理

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/rtl-dynamic-input.gif)

修改的代码如下:

```js
editable.dir = document.documentElement.dir;
```

#### 动画处理

部分组件涉及方向的动画需要做对应的适配，比如下面 Loading 组件的动画:

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/rtl-animation.gif)

该组件的原因是使用了 border 作为动画的边框，并且需要支持颜色配置, 因此自动的 postcss-rtl 无法自动处理。

```jsx
<div
  style={{
    borderRightColor: color,
    borderTopColor: color,
  }}></div>
```

这时候需要动态根据方向来设置对应的 border，问题来了，如何根据方向来动态设置对应的 border 呢？

[这里](https://github.com/ant-design/ant-design/blob/master/components/config-provider/index.tsx)以及[这里](https://github.com/rsuite/rsuite/blob/main/src/CustomProvider/CustomProvider.tsx)

对于 storybook 组件，由于暂时无法监听 storybook-addon-rtl 的方向变化，所以只能监听 html 的 dir 变化，然后强制刷新

```tsx
// preview.tsx
const preview: Preview = {
  decorators: [
    (Story) => {
      const forceUpdate = useForceUpdate(); // 暂时无法监听storybook-addon-rtl的方向变化，所以只能监听html的dir变化，然后强制刷新
      useHtmlDirAttributeObserver(forceUpdate);
      const direction = document.documentElement.getAttribute("dir") || "ltr";

      return (
        // @ts-ignore
        <ConfigProvider direction={direction}>
          <Story />
        </ConfigProvider>
      );
    },
  ],
};

const useHtmlDirAttributeObserver = (callback) => {
  const htmlElementRef = useRef(document.documentElement);

  useEffect(() => {
    const handleAttributeChange = (mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "dir"
        ) {
          const newDirValue = htmlElementRef.current.getAttribute("dir");
          callback(newDirValue);
        }
      });
    };

    const observer = new MutationObserver(handleAttributeChange);
    const config = { attributes: true };

    observer.observe(htmlElementRef.current, config);

    return () => {
      observer.disconnect();
    };
  }, [callback]);

  return htmlElementRef;
};

const useForceUpdate = () => {
  const [count, forceUpdate] = useState(0);
  return () => forceUpdate(() => count + 1);
};
```

又比如下面的 Message 组件

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/rtl-message-component.gif)

可以看到，Message 组件的动画是从左到右的，但是在 RTL 布局下，需要从右到左，因此需要根据方向来动态设置动画的方向。

```less
[dir="rtl"] .@{prefixName}-message {
  &.@{prefixName}-msg-visible {
    animation: by-ui-visible-rtl 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s 1 forwards;
  }

  &.@{prefixName}-msg-hidden {
    animation: by-ui-hidden-rtl 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86) 0s 1 forwards;
  }
}

// 这里添加了一个新的动画，用于RTL布局下的动画
@keyframes by-ui-visible-rtl {
  from {
    opacity: 0;
    transform: translate(50%, -100%);
  }
  to {
    opacity: 1;
    transform: translateY(50%, 100%);
  }
}

@keyframes by-ui-hidden-rtl {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateY(50%, 100%);
  }
}
```

#### 图标&背景

比如下面一个分页的页码，在 RTL 布局下，文字和图标都要进行处理

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/rtl-text-direction-before.png)

```css
// 处理按钮
[dir="rtl"] & {
  &:first-child,
  &:last-child {
    transform: scaleX(-1);
  }
}

// 处理文字
[dir="rtl"] & {
  unicode-bidi: bidi-override;
}
```

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/rtl-text-direction-after.gif)

对于图标的翻转，最好提供一个 mixin 的方式，方便复用

```less
.flip-img {
  [dir="rtl"] & {
    transform: scaleX(-1);
  }
}
```

#### 数字、日期处理

使用国际化组件的 API 进行处理

#### js 动态 style

#### boundingClientRect

需要注意的是，boundingClientRect 的值在 RTL 布局下依然是从左到右的，因此需要根据方向来动态设置

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/rtl-boundingClientRect.png)

```js
if (layout === "rtl") {
  target.style.right = （window.innerWidth - rect.right） + rect.width + gap + "px"; // 注意这里的计算方式是通过window.innerWidth - rect.right来计算的
  // target.style.left = "auto";
} else {
  target.style.left = rect.left + rect.width + gap + "px";
  target.style.right = "auto";
}
```

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/业务相关/_demo/css-direction/boundingClientRect.html), 查看示例代码请点击[此处](../_demo/css-direction/boundingClientRect.html)

#### 三方依赖的处理

##### 如果三方组件不支持 RTL

如果三方组件暂时不支持 RTL，可以暂时在容器的最外层强制设置为 LTR

```jsx
<div id="third-party-comp-wrapper" dir="ltr"></div>
```

##### google-drive

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/rtl-google-drive.png)

代码如下：

```js
const instance = picker
  .setOAuthToken(token)
  .addView(view)
  .setLocale(getLang()) // 通过这里的setLocale API 来设置语言
  .addView(new google.picker.DocsUploadView())
  .setCallback(setCallback)
  .build();
```

#### 忽略部分样式处理

有时候需要更加细粒度的控制，忽略部分样式(一种比较常见的场景是绝对定位中有绝对定位)

```less
.modal {
  position: absolute;
  top: 50%;
  /*rtl:ignore*/
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 其他

除此之外，还有一些额外的场景需要考虑

- 文字排序

限于篇幅，这里不做过多介绍

### 业务组件库处理

添加[`storybook-addon-rtl`]()插件，用于切换方向

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/rtl-storybook.gif)

由于无法无法监听到该插件的方向变化，因此只能在 preview 中监听 html 的 dir 变化，然后强制刷新 preview 页面

```tsx
// preview.tsx
const preview: Preview = {
  decorators: [
    (Story) => {
      const forceUpdate = useForceUpdate(); // 暂时无法监听storybook-addon-rtl的方向变化，所以只能监听html的dir变化，然后强制刷新
      useHtmlDirAttributeObserver(forceUpdate);
      const direction = document.documentElement.getAttribute("dir") || "ltr";

      return (
        // @ts-ignore
        <ConfigProvider direction={direction}>
          <Story />
        </ConfigProvider>
      );
    },
  ],
};

const useHtmlDirAttributeObserver = (callback) => {
  const htmlElementRef = useRef(document.documentElement);

  useEffect(() => {
    const handleAttributeChange = (mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "dir"
        ) {
          const newDirValue = htmlElementRef.current.getAttribute("dir");
          callback(newDirValue);
        }
      });
    };

    const observer = new MutationObserver(handleAttributeChange);
    const config = { attributes: true };

    observer.observe(htmlElementRef.current, config);

    return () => {
      observer.disconnect();
    };
  }, [callback]);

  return htmlElementRef;
};

const useForceUpdate = () => {
  const [count, forceUpdate] = useState(0);
  return () => forceUpdate(() => count + 1);
};
```

同时项目中，应该提供对应的 context, 在 dir 发生变化的时候，通知组件进行更新，一般组件库都会提供一个 contextProvider 处理这个逻辑，参考代码如下：

```tsx
import React, { useMemo, createContext } from "react";

export interface IConfigProviderProps {
  direction?: "rtl" | "ltr";
  children?: React.ReactNode;
}

export const ConfigProviderContext = createContext<IConfigProviderProps>({});

export const ConfigProvider: React.FC<IConfigProviderProps> = (props) => {
  const { direction = "ltr", children, ...restProps } = props;

  const config = useMemo(
    () => ({
      direction,
      ...restProps,
    }),
    [direction, restProps]
  );

  return (
    <ConfigProviderContext.Provider value={config}>
      {children}
    </ConfigProviderContext.Provider>
  );
};
```

业务中的使用

```tsx
 <ConfigProvider direction="rtl">
       {children}
        </StyleProvider>
      </ConfigProvider>
```

更加复杂的例子请参考

- antd, [用法](https://ant.design/components/config-provider-cn#config-provider-demo-direction), [源码](https://github.com/ant-design/ant-design/blob/master/components/config-provider/index.tsx)

- rsuite, [用法](https://github.com/rsuite/rsuite/blob/main/src/CustomProvider/CustomProvider.tsx#L52), [源码](https://github.com/rsuite/rsuite/blob/main/src/CustomProvider/CustomProvider.tsx#L52)

#### Dropdown 下拉选项框的处理

对于 placement 的处理，一旦涉及到方向`left`和`right`，就需要根据方向来动态设置，比如下面的代码

```tsx
<Dropdown
  placement={direction === "rtl" ? "bottomRight" : "bottomLeft"}
  align={{ offset: direction === "rtl" ? [179, 45] : [-179, 45] }}></Dropdown>
```

## 一些改进项 && TODO

1. 目前无法通过 postcss-rtl 插件自动处理适配，可以考虑添加 eslint 规则加以规范
2. babel 插件对内联 JSX 自动化处理
3. 样式动态加载(比如媒体查询)
4. 将上述方案整合为一个大的 plugin，方便复用到其他项目中

## 参考

- https://m2.material.io/design/usability/bidirectionality.html#mirroring-layout

- https://note.youdao.com/ynoteshare/index.html?id=9ae40d5b5c2a7f55c50b11e68a9f8da4&type=note

- https://rtlstyling.com/posts/rtl-styling

- https://github.com/MohammadYounes/rtlcss

- https://github.com/elchininet/postcss-rtlcss

- https://juejin.cn/post/6989055383486758919

- https://bootstrap.rtlcss.com/docs/4.1/components/forms/#custom-forms

- https://www.youtube.com/watch?v=dZ9vQYSNVyo&ab_channel=ReactEurope
