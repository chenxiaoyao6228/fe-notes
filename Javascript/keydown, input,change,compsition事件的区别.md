## 前言

本文主要总结下与文本输入的相关的事件。

测试地址见: 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/Javascript/_demo/input-event/input-order.html)

## keydown 事件

从按钮按下到弹起，会依次触发`keydown`、 `beforeinput`, `keypress`、`keyup`事件,

- `keydown`和`keyup`分别在用户按下与松开按键的时候触发
- `keypress(不推荐)`, `beforeinput` 会在按下**可显示内容（字符键：数字/字母/符号）**后在 keydown 之后触发，非字符键(Enter, Backspace, Delete, Esc)则不会。

这也就意味着如果我们想阻止默认的输入行为，就只能在 keydown 中进行对应的处理(此时浏览器默认行为未完成，输入框还没有更新显示)， 一般会配合`event.key`或者`event.code`来判断. 关于`keyCode`可以看看这篇[告别 JS keyCode](https://www.zhangxinxu.com/wordpress/2021/01/js-keycode-deprecated/)

## input 事件

当输入元素的值发生改变时，将触发"input"事件，**无论是键盘输入还是通过粘贴、剪切等方式改变值**。

"input"事件的特点是，它实时响应用户输入，并且对于支持自动填充和预测文本的浏览器，输入过程中也会触发该事件。

## change 事件

"change"事件在用户完成输入并且**焦点从输入元素移开后触发**。与"input"事件不同，"change"事件在用户确认完成输入后才会执行。(可以留意下文末的 gif 图)

同时，其他的表单表单元素也会触发`change`事件: `radio`, `checkbox` `selection`, `input[type="file"]`, `input[type="date"]`

## composition 合成事件

"composition"事件主要用于处理复杂的文本输入，例如中文输入法的候选词选择过程。它在输入法组合文本时触发，而不是在每次输入字符时触发。

"compositionstart"事件标志着合成过程的开始，"compositionupdate"事件用于在合成过程中更新文本，最后，当合成文本确定时，将触发"compositionend"事件。

> 对于 React 来说，需要做用户输入过滤拦截的时候，一定要考虑合成事件，不能简单地用 onChange 事件

## 用户输入事件触发顺序

在存在用户输入法输入的时候，事件的触发顺序如图：
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/html-input-order-composition.gif)

## 总结

本文只是简单的列举了一些文本输入相关的事件，实际项目中会遇到比较多的兼容性问题，需要针对对应的问题进行处理。

## 参考

- [告别 JS keyCode](https://www.zhangxinxu.com/wordpress/2021/01/js-keycode-deprecated/)
- [可能这些是你想要的 H5 软键盘兼容方案](https://segmentfault.com/a/1190000018959389)
- [textarea 的中文输入判断与搜狗输入法的特殊行为](https://stackoverflow.com/questions/51395393/how-to-trigger-paste-event-manually-in-javascript)
