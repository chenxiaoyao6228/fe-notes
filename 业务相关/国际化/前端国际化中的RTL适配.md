## 前言

本文探讨下国际化 RTL 适配相关的知识, 内容包括:

- RTL 需要的背景知识
- RTL 适配需要的内容以及如何渐进修改
- 业务代码中的 RTL
- 基础组件库中的 RTL

## 前置知识

### 浏览器对 RTL 的支持

HTML 与 CSS 中有关方向与顺序的属性

#### direction

dir 用于设置文本的书写方向, dir 属性是继承的，这意味着如果你在父元素上设置了 dir 属性，子元素会继承这个方向。这种继承性是按照文档流的方向来应用的。

例如，如果你在文档的 `<html>` 元素上设置了 dir="rtl"，**那么整个文档内的元素，除非被显式设置了不同的方向，否则都会继承这个右到左的方向**。这包括文本、块级元素、内联元素等。

因此一般而言，只需要在根元素 html 设置一次即可， CSSWG 也建议在 html 根元素上定义方向，以确保在没有 CSS 的情况下正确的双向布局。

```html
<html dir="rtl"></html>
```

但这只能满足大多数场景，一些边界比如浮动，绝对定位等元素需要单独处理。

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/业务相关/_demo/css-direction/direction.html), 查看示例代码请点击[此处](../_demo/css-direction/direction.html)

#### CSS 逻辑属性

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

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/业务相关/_demo/css-direction/unicode-bidi.html), 查看示例代码请点击[此处](../_demo/css-direction/unicode-bidi.html)

### RTL 适配 Guideline

## 前端 RTL 适配方案

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

#### 输入框的处理

一般来说，会根据 html 上的 dir 属性来设置输入框的方向，但是如果是动态创建的 input 组件，则需要额外的处理, 比如下面 canvas 白板使用了动态创建的 input 组件，需要额外处理

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

#### 混合文字处理

#### 图标

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

更加复杂的例子请参考

- antd, [用法](https://ant.design/components/config-provider-cn#config-provider-demo-direction), [源码](https://github.com/ant-design/ant-design/blob/master/components/config-provider/index.tsx)

- rsuite, [用法](https://github.com/rsuite/rsuite/blob/main/src/CustomProvider/CustomProvider.tsx#L52), [源码](https://github.com/rsuite/rsuite/blob/main/src/CustomProvider/CustomProvider.tsx#L52)


## 一些注意事项

1. 尽量不要在JSX中写style， 无法通过postcss-rtl插件自动处理适配，后续可以考虑添加eslint规则加以规范


## 参考

- https://note.youdao.com/ynoteshare/index.html?id=9ae40d5b5c2a7f55c50b11e68a9f8da4&type=note

- https://m2.material.io/design/usability/bidirectionality.html#mirroring-layout

- https://rtlstyling.com/posts/rtl-styling

- https://github.com/MohammadYounes/rtlcss

- https://github.com/elchininet/postcss-rtlcss

- https://juejin.cn/post/6989055383486758919

- https://bootstrap.rtlcss.com/docs/4.1/components/forms/#custom-forms

- https://www.youtube.com/watch?v=dZ9vQYSNVyo&ab_channel=ReactEurope
