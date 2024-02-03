## 前言

本节将从零实现 React 合成事件。

## 渲染函数 render

首先，我们来实现 render 函数。这个函数的主要任务是将虚拟 DOM 转化为真实 DOM，并建立 fiber 树。

```js
function render(parentElement, vdomNode, parentFiberNode) {
  let element = null;

  switch (vdomNode.type) {
    case "element":
      element = document.createElement(vdomNode.tagName);
      break;
    case "text":
      element = document.createTextNode(vdomNode.value);
      break;
    default:
      break;
  }

  let fiberNode = {
    stateNode: element,
    props: vdomNode.props,
    return: parentFiberNode,
  };

  parentFiberNode.next = fiberNode;
  element[_fiberNodeKey] = fiberNode;

  parentElement.appendChild(element);

  if (vdomNode.children && vdomNode.children.length > 0) {
    vdomNode.children.forEach((childVdomNode) => {
      render(element, childVdomNode, fiberNode);
    });
  }
}
```

ReactDOM 的 render 方法负责初始化渲染，创建根 fiber 节点，并调用 render 函数。

```js
const ReactDOM = {
  render: (container, vdomNode) => {
    let rootFiberNode = {
      stateNode: container,
      next: null,
      return: null,
      props: {},
    };

    render(container, vdomNode, rootFiberNode);
    console.log("rootFiberNode", rootFiberNode);

    // 遍历收集注册事件
    initEvents(container);
  },
};
```

## 事件初始化函数 initEvents

这个函数负责为容器上的事件初始化处理函数。

```js
function initEvents(container) {
  ["click"].forEach(function (eventType) {
    container.addEventListener(eventType, (e) => {
      dispatchEvent(container, eventType, e);
    });
  });
}
```

## 事件分发函数 dispatchEvent

函数负责处理事件的捕获和冒泡。

```js
function dispatchEvent(container, eventType, e) {
  const targetElement = e.target;
  const { capture, bubble } = collectPath(targetElement, container, eventType);

  console.log("capture, bubble", capture, bubble);

  const se = createSyntheticEvent(e);

  traverseEventFlow(capture, se);

  if (!se.__stopPropagation) {
    traverseEventFlow(bubble, se);
  }
}
```

## 路径收集函数 collectPath

```js
function collectPath(targetElement, container, eventType) {
  const paths = {
    capture: [],
    bubble: [],
  };

  while (targetElement && targetElement !== container) {
    const fiberNode = targetElement[_fiberNodeKey];
    const elementProps = fiberNode.props;

    if (elementProps) {
      const callbackNameList = getEventCallbackNameFromEventType(eventType);

      callbackNameList.forEach((callbackName, i) => {
        const eventCallback = elementProps[callbackName];

        if (eventCallback) {
          if (i === 0) {
            paths.capture.unshift(eventCallback);
          } else {
            paths.bubble.push(eventCallback);
          }
        }
      });
    }

    targetElement = targetElement.parentNode;
  }

  return paths;
}

function getEventCallbackNameFromEventType(eventType) {
  const mapping = {
    click: ["onClickCapture", "onClick"],
  };
  return mapping[eventType];
}

function traverseEventFlow(paths, se) {
  for (let i = 0; i < paths.length; i++) {
    const callback = paths[i];
    callback.call(null, se);
    if (se.__stopPropagation) {
      break;
    }
  }
}

function createSyntheticEvent(e) {
  const syntheticEvent = e;
  syntheticEvent.__stopPropagation = false;
  const originStopPropagation = e.stopPropagation;
  syntheticEvent.stopPropagation = () => {
    syntheticEvent.__stopPropagation = true;
    originStopPropagation && originStopPropagation.call(e);
  };
  return syntheticEvent;
}
```

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/React源码/_demo/synthetic-event/create-from-sratch/index.html), 查看示例代码请点击[此处](../_demo/synthetic-event/create-from-sratch/index.html)
