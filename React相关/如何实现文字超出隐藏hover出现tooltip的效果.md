## 前言

有这样一个需求: 在表格组件的 Item 中，当用户名超出的时候，实现打点的效果，hover 的时候出现 tooltip

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/tooltip-ellipsis.png)

## 基本原理

当元素渲染出来后，通过检测元素的 clientWidth 与 scrollWidth 来进行处理

```tsx
const isTextOverflow = (element: HTMLElement | null) => {
  if (!element) return false;
  return element.clientWidth < element.scrollWidth;
};
```

## React 代码

👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/React相关/_demo/TooltipWithEllipsis/index.html)

```tsx
import { Tooltip, TooltipProps } from "antd";
import debounce from "lodash-es/debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";

const isTextOverflow = (element: HTMLElement | null) => {
  if (!element) return false;
  return element.clientWidth < element.scrollWidth;
};

type TooltipWithEllipsisProps = {
  open?: boolean;
  children: React.ReactElement;
} & TooltipProps;

/**
 * 超出文案显示打点效果，hover出现tooltip组件
 * @param {*} props
 * @return {*}
 */
const TooltipWithEllipsis: React.FC<TooltipWithEllipsisProps> = (props) => {
  const { open, children, ...otherProps } = props;
  const _ref = useRef<HTMLElement | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(true);

  const checkOverflow = useCallback(() => {
    const isOverflow = isTextOverflow(_ref.current);
    setTooltipVisible(isOverflow);
  }, [setTooltipVisible]);

  useEffect(() => {
    if (_ref.current) {
      checkOverflow();
    }
  }, [children, checkOverflow]);

  // 在元素出现大小变化的时候重新计算
  useEffect(() => {
    const debounceHandler = debounce(() => {
      checkOverflow();
    }, 500);

    window.addEventListener("resize", debounceHandler);
    return () => {
      window.removeEventListener("resize", debounceHandler);
    };
  }, [checkOverflow]);

  // 打点效果
  const tooltipStyleDefault = {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  };

  return (
    <Tooltip
      open={open ? open : tooltipVisible ? undefined : false}
      {...otherProps}>
      {React.cloneElement(children, {
        ref: _ref,
        style: {
          ...children.props.style,
          ...tooltipStyleDefault,
        },
      })}
    </Tooltip>
  );
};

export default TooltipWithEllipsis;
```
