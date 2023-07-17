
## 前言

印象中正则表达式总是难学难记,学了忘,忘了又学, 这次痛定思痛, 决定这么操作:

1. 写一篇文章总结 Javascript 中正则的基本概念, 不涉及太多的细枝末节, 方便回顾
2. 准备一个练习库(常用的正则表达式), 提供基本的对照, 方便后续短时间内强化,毕竟熟能生巧

希望文章能对大家有帮助.

### 工具

[正则解析：regex101](https://regex101.com/)
[正则可视化：regexper](https://regexper.com/)
[正则速查符号速查](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet)

## 构建与使用

### 字面量还是构造函数

一句话: **当正则表达式在开发环境是明确的,推荐优先使用字面量语法;当需要在运行时动态创建字符串来构建正则表达式时,则使用构造函数的方式。**

比如要判断一个元素的 className 中是否包含名为 active 的类

```js
function isActive(ele) {
  let regex = /active/;
  return regex.test(elem.className);
}
```

如果要抽象为一个判断某个元素是否含有某个类

```js
function hasClass(className, ele) {
  const regex = new RegExp('(^|\\s)' + className + '(\\s|$)'); => className在构建的时候才知道
  return regex.test(elem.className)
}
```

### 字符串和正则表达式的常用方法

1. regex.match

2. str.replace

更多用法请看:

- 正则表达式: test, match, matchAll, exec
- 字符串: replace, split, search

其中, 最常用的是 regex.test, regex.match

## 匹配字符

匹配字符: 有横向匹配, 范围, 用**`[]`**,纵向匹配, 数量, 用`**{}**`, **可以想象成一个固定长度的密码锁**

横向匹配: 正反以及缩略形式

正向使用`[要匹配的内容]`,反向形式为使用`[^不要匹配的内容]`

- [abc], [^abc], 非 abc 其中的一个
- [a-zA-Z0-9]

纵向匹配 v

- ?, \*, +, {}

## 匹配位置

ps: 位置相当于空字符

1.开头和结尾

```js
/test/
/^test$/
```

2.边界

- 单词边界与非单词边界: ^, \$, \w, \W

## 前瞻与后顾

提供了前后相关的条件,但是**匹配结果不包含条件中的内容**

### x(?=y)

含义: 找到 x, 看看后面是不是 y, 是的话返回 x(无 y)，(当然也可以按照先查找 Y, 然后看前面是不是 X 来理解）

#### 基本

例子:

```js
let str = "肾6 售价为 5000RMB";
console.log(str.match(/\d+(?=RMB)/)[0]); // 5000
```

`/\d+(?=RMB)/`匹配的是**任意多个数字,后面紧跟 RMB**, 5000 满足条件, `RMB`是条件内容,因此不返回. 6 后面没有跟`RMB`, 没有符合条件

#### 稍微复杂的例子

另一个更加复杂的例子: **X(?=Y)(?=Z)**

匹配模式是这样的：

1. 找到 X
2. 检测 X 后面是不是 Y，如果不是就跳过
3. 检测 X 后面是不是 Z， 如果不是就跳过

也就是说 X 后面要同时跟上模式 Y 和模式 Z， 这怎么可能？唯一的可能是模式 Y 和 Z 并不是**互斥的**

比如 \d+(?=\s)(?=.\*5000), 匹配的是**一个或多个数字，后面紧跟着一个空格，然后在字符后面的某处有个 5000 的数字**

```js
let str = "肾6 售价为 5000RMB";
console.log(str.match(/\d+(?=\s)(?=.*5000)/)[0]); // 6
```

有比如，我们希望写一个简单的检查密码的正则， 密码格式为： 6-12 位，至少一个为数字，其余为字母

```js
let regex = /(?=\w{6,12})(?=\D*\d)/;
console.log(regex.test("xiaoyao666")); // true
console.log(regex.test("xiaoyao")); // false
```

### x(?!y)

与上面类似，就返回后面不是 Y 的 X

```
let str = '肾6 售价为 5000RMB'
console.log(str.match(/\d+(?!RMB)/)[0]) // 6
```

### (?<=y)x

找到 X，看前面是不是 Y，还是上面的例子

```js
let str = "肾6 售价为 $5000"; // 换成$
console.log(str.match(/(?<=\$)\d+/)[0]); // 5000
```

### (?<!y)x

```js
let str = "肾6 售价为 $5000";
console.log(str.match(/(?<!\$)\d+/)[0]); // 6
```

## 括号

分组与捕获

由于捕获与分组都使用圆括号表示,对于正则表达式处理器来说, 无法区分所添加的是捕获还是分组

括号的功能: 分组分支, 捕获以及引用

### 分支(或)

分支是指使用 `|` 字符将多个正则表达式连接起来形成一个选择。当正则表达式匹配时，它会优先选择其中的第一个分支，如果第一个分支不能匹配，则会继续尝试下一个分支，直到全部分支都尝试完成。

例如，正则表达式 `(cat|dog|fish)` 匹配包含 `cat`、`dog` 或 `fish` 的字符串。它将先尝试匹配 `cat`，如果不能匹配，则继续尝试 `dog` 和 `fish`。

分支在正则表达式中非常有用，因为它允许我们对多个不同的模式进行选择，提高了匹配的精确性和匹配范围。

### 分组捕获

#### 分组引用

在 Javascript 中已用, 使用**$**符

```js
let res = "Xiao Yao".replace(/(\w+)\s(\w+)/, "$2 $1"); // Yao Xiao
```

#### 反向引用

在正则表达式中使用，使用 \\符

```js
let repeatStr = "regex regex";
let repeatRegex = /(\w+)\s\1/;
repeatRegex.test(repeatStr); // true
```

### 非捕获

```js
(?:)
```

## 修饰符

Javascript 正则表达式中，一般使用以下五种修饰符：

1. `g`：全局匹配模式，表示匹配所有符合条件的文本，而不是只匹配第一个。

2. `i`：忽略大小写匹配模式，表示匹配时不区分大小写。

3. `m`：多行匹配模式，表示字符“^”和字符“$”在匹配时会匹配文本中的每一行，而不是只匹配整个文本的开头和结尾。

4. `u`：Unicode 匹配模式，用于支持 Unicode 字符集。

5. `y`：粘附匹配模式，表示从上次匹配的位置开始匹配，而不是从整个文本的开头开始。

在 Javascript 正则表达式中，修饰符是以字符串的形式放在表达式的末尾，如`/pattern/g`和`/pattern/i`。可以组合使用这些修饰符，例如`/pattern/gi`表示全局匹配、忽略大小写的模式。

当使用修饰符时，可以使用`flags`属性（或`options`属性）来获取这些修饰符，例如：

```js
let regex = /pattern/gi;
console.log(regex.flags); // 输出 "gi"
```

需要注意的是，在 Javascript 中，只有`g`和`i`修饰符是普遍支持的。其他修饰符需要在支持它们的 Javascript 引擎上才能正常运行。

## 参考

- [阮一峰-正则表达式 30 分钟入门教程](https://deerchao.cn/tutorials/regex/regex.htm)
- [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [《JavaScript 正则表达式迷你书》](https://juejin.im/book/5be84a72f265da61684a1bae/intro)
- [EasyJsBox-一些常用正则](https://easyjs.top/clean-pages.html)
- [Start Bootstrap - Regular Expressions Cheat Sheet](http://www.gethugothemes.com/docs/regular-expressions-cheat-sheet/)
