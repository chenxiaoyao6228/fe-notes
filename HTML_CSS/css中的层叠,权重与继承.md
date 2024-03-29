## 从一个例子讲起

请判断下面两个 div 内部文字的最终颜色

```css
// html
<div class="red blue">123</div>
<div class="blue red">123</div>

// css
.red {
  color: red;
}
.blue {
  color: blue;
}
```

答案是: 两个 div 的文字都是**蓝色**

👉[在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/HTML_CSS/_demo/css-inheritance/index.html)

如上面的例子演示中的那样,当多个选择器作用于同一个元素的时候, 浏览器是如何决定最终的样式的,毕竟一段文字不可能既是红色又是蓝色

要解决这个问题, 我们需要了解 css 中的**层叠**和**权重**

先来看看 w3c 是如何对**层叠**进行规范的

> The **cascade** takes a unordered list of declared values for a given property on a given element, sorts them by their declaration’s precedence, and outputs a single cascaded value.

简单而言就是, 浏览器会将所有作用于元素的样式按照**声明的优先级进行排序**, 最终产生一个**最终的层叠值**

## 声明的来源

而声明的优先级来源于四个方面

- 来源和重要性
- 选择器的特异性
- 出现的顺序
- 初始和继承属性（默认值）

### 重要性和来源

如果两处规则作用于同一元素, 带有!important 的胜出

```html
<p style="color: black;">Well, <em>hello</em> there!</p>
```

```css
p {color: gray !important;}
```

三种来源规则

- author: 前端开发人员制定的规则
- user: 浏览器用户自定义的规则(有多少用户会自定义?)
- user-agent: 浏览器厂商制定的规则

将上面两者进行简单结合得出的优先级由强到弱的顺序是:

1. 用户的 important 声明
2. 开发人员的 important 声明
3. 开发人员的普通声明
4. 用户的普通声明
5. 浏览器默认的声明

### 选择器的特异性

对于每条规则, 选择器的特异性按照四位数(0,0,0,0)进行排,按照同级向下排列, 遇到其中的一种就在对应的项添加 1

- 内联样式
- id 选择器
- 类和伪类选择器
- 元素选择器

举几个简单计算的例子

```css
h1 {
  color: red;
} /* specificity = 0,0,0,1 */
p em {
  color: purple;
} /* specificity = 0,0,0,2 */
.grape {
  color: purple;
} /* specificity = 0,0,1,0 */
*.bright {
  color: yellow;
} /* specificity = 0,0,1,0 */
p.bright em.dark {
  color: maroon;
} /* specificity = 0,0,2,2 */
#id216 {
  color: blue;
} /* specificity = 0,1,0,0 */
div#sidebar *[href] {
  color: silver;
} /* specificity = 0,1,1,1 */
```

比较的时候由最高级开始,当最高级不同时,值大的胜出, 若相同, 再向下比较

注意点:

css 选择器的层级与 DOM 元素的层级没有任何关系

```css
body.foo {
  color: red;
}
html.foo {
  color: blue;
}
```

虽然 body 作为 HTML 的子元素,离 foo 元素更近,但是 css 的计算规则不考虑 dom 元素层级

### 申明的顺序

如果两条 css 规则中上面的两项得出的权重都一样的话,那就按照申明的顺序进行排列(也可以理解为后者覆盖前者) 回到我们开头的例子, 之所以两个 div 最终的颜色都是蓝色, 是因为在两条规则都是内联样式,具有相同的选择器特异性,而.blue 的声明在.red 的后面, 将前面的样式覆盖了

我们可以利用这里的知识去解释 a 标签的推荐写法**LVFHA**

```css
a:link {
  color: blue;
}
a:visited {
  color: purple;
}
a:focus {
  color: green;
}
a:hover {
  color: red;
}
a:active {
  color: orange;
}
```

这些选择器的特异性都是(0,0,1,0),因此最后一个会胜出, 假设你不遵循推荐的写法，会出现什么后果呢？比如像下面这样

```css
a:active {
  color: orange;
}
a:focus {
  color: green;
}
a:hover {
  color: red;
}
a:link {
  color: blue;
}
a:visited {
  color: purple;
}
```

### 初始和继承值

注意两点:

1. 通用匹配符选择器(\*)不增加特异性

```css
* {
  color: gray;
} /* 0,0,0,0 */
```

2. 继承而来的属性没有特异性(**也就是比通用匹配符\*还低**), 比如下面的 em 元素最终表现为**红色**

```css
// html
<h1>Meerkat <em>Central</em></h1>

// css
h1 {
  color: gray;
}
* {
  color: red;
}
```

## 参考

- [css definite guide 4th edition](https://www.amazon.com/CSS-Definitive-Guide-Visual-Presentation/dp/1449393195)
- [css 世界](https://book.douban.com/subject/27615777/)
