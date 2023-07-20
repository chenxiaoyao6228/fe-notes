# tabIndex

> tabindex=负值 (通常是 tabindex=“-1”)，表示元素是可聚焦的，但是不能通过键盘导航来访问到该元素，用 JS 做页面小组件内部键盘导航的时候非常有用。
tabindex="0" ，表示元素是可聚焦的，并且可以通过键盘导航来聚焦到该元素，它的相对顺序是当前处于的 DOM 结构来决定的。
tabindex=正值，表示元素是可聚焦的，并且可以通过键盘导航来访问到该元素；它的相对顺序按照tabindex 的数值递增而滞后获焦。如果多个元素拥有相同的 tabindex，它们的相对顺序按照他们在当前 DOM 中的先后顺序决定。

## tabIndex + onBlur实现下拉框效果
[案例](./_demo/tabIndex/index.html)