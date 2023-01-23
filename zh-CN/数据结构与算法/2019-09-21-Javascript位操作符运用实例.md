---

title: Javascript位操作符运用实例
date: 2019-09-21T23:39:50.000Z
categories:
  - tech
tags:
  - Javascript
permalink: 2019-09-21-javascript-bitwise-operator-in-real-life
---

## 前言

在使用 Javascript 实现二分搜索的时候发现社区中有人使用了这样一行代码

> var k = (n + m) >> 1; // k 是 m + n 的中位数

`位运算符`除了学 CSAPP 的时候了解过， 工作之后基本就没有碰过了， google 了一下， 社区中有一篇写得不错的文章，与大家一起分享

> 原文来自:[Using JavaScript’s Bitwise Operators in Real Life](https://codeburst.io/using-javascript-bitwise-operators-in-real-life-f551a731ff5)

## 正文

在 Javascript 中使用位操作符有些奇妙，如`(12 & 3) = 0`与`(12 * 4) = 4`。说真的， 你应该在控制台尝试一下。如果你不知道它的工作原理， 请继续往下阅读： 他们可能成为你手中悬而未决的问题的答案。

最近一位同事询问我们团队关于储存和检查四个独立真/假变量的最好办法。我们姑且把这些属性按 foo1 到 foo4 命名，在 Javascript(ES6)中的表示是这样的

```js
const myObject = {
  foo1: false,
  foo2: true,
  foo3: false,
  foo4: true
};
```

非常直观，但是，我们的应用需要检查这 4 个属性的多个组合， 更为困难的是， 我们可能会在某天添加额外的属性。因此两个显而易见的方案摆在了我们面前。

1 ) 构建所有可能的模型对象， 然后在需要的时候进行代码比对。

```js
const hasFoo2andFoo4 = {
  foo1: false,
  foo2: true,
  foo3: false,
  foo4: true
}

const hasFoo3andFoo4 = {
  foo1: false,
  foo2: false,
  foo3: true,
  foo4: true
}

// ...省略若干文字...

// 接下来的代码
if (isEqual(myObject, hasFoo2andFoo4)) {
  // 这是只有Foo2和Foo4的情况
```

如你所见，这方案槽透了。我们可能构建多达 16 个模型对象以进行比对。对于这么小的信息量而言开销似乎有点多。 并且， 如果未来我们添加额外的属性，模型对象的数量会翻倍。很显然，这是可以避免的。但是， 另外一个方案似乎看起来更糟糕。。。

2 ）只对条件语句中的每个独立属性做减检查

```js
if (myObject[2] && myObject[4] && !(myObject[1] || myObject[3])) {
  // 我们知道该对象只有Foo2和Foo4
}
```

另外一个梦魇就是, 我们需要在客户端代码中粘贴大约一百万个子句。 首先这很容易出错，其次，如果更改了任何的属性或者添加了新属性，那我们该怎么办？

某天早上我咖啡喝得有点多，大脑处于信息不足状态， 我意识到我们基本上是在模仿典型的 UNIX 文件系统使用的权限位屏蔽功能。如“755”代表“可读-可写-可执行”。尽管文件系统权限更为复杂， 但也许我们可以将其简化用于解决我们的问题。我开始思考一些关于如何为每个属性分配数字的想法， 然后为每个州添加唯一的数字。。。

另外一位同事提醒了我， 他说:“ 我们只是使用位运算符， 而不是重新发明文件权限系统？” 的确如此，我不清楚位运算符是什么-多年来我曾经使用〜几次，但我从未完全理解它们。幸运的是，这个同事在以前的项目中使用了它们，并且能够启发我们。

按位运算符操作确实与文件系统权限基于相同的概念，但是比我想象的要优雅得多。位运算符可以对代表每个整数的位进行处理，而不是对整数进行手动加法和减法运算，而是直接对它们进行比较和操作。因此，你可以使用它们根据 0 和 1 来操纵 4 位数字（亦或是 3 位或 12 位，乃至其他位），每个位代表你的 true/false 属性之一。

JavaScript 中的所有整数（在 64 位环境中最多为 9,007,199,254,740,991）都可以用二进制表示。你可以通过在它们上调用 toString（2）来查看它们是什么:

```js
(1).toString(2);
// 1
(2).toString(2);
// 10
(3).toString(2);
// 11
(4).toString(2);
// 100
// ...
(3877494).toString(2);
// 1110110010101001110110
```

我想你大概明白了。接下来是最重要额部分。整件事的真正诀窍是：按位运算符使你可以直接比较和操作那些二进制字符串。因此，按位运算符<<（在二进制字符串的右边放置零）将根据二进制规则增加整数十进制值， 举个例子:

```js
// 将 `fooBar`的值设为 2
let fooBar = 2;
fooBar.toString(2);
//  二进制表示为10
//  我们将一个0插入到二进制的fooBar的末尾，也就是100
foobar = fooBar << 1;
fooBar.toString(2);
//  这也就意味着，fooBar的十进制此时变成了4
console.log(fooBar);
// 4
```

你大概了解了基本操作。给定位运算符的全部色域，我们现在可以以二进制形式进行加，减和比较。在上面的特定示例中，我们可以将所有四个可能的属性存储在一个 4 位数字中，介于 0000-1111 之间，每个位代表 true（1）或 false（0）。因此，你可以想象使用此模式，二进制数 1111 表示所有属性为 true，其余属性为 false。 1000 将意味着只有第四个属性为 true，等等。（请注意，二进制计数从右到左；“第一个”属性为 1 或 0001；“第四个”属性为 1000）。

两个最重要的按位比较运算符是“＆”和“ |”。它们与“ &&”和“ ||”的相似之处是有意的，但可能会引起误解。 “＆”将返回你要比较的两个数字的交集的二进制表示形式，“ |”将返回并集。因此 1010 和 1001 将返回 1000，因为最左边的 1 是两者之间唯一的共同点； 1010 | 1001 将返回 1011，因为这些都是相同的位。

扯远了, 让我们回到之前的例子。

```js
// 让我们定义一个需要检查的对象。

// 在现实世界中，这可能来自API响应或用户互动或表格等。你可能事先并不知道。
const myObject = {
  foo1: false,
  foo2: true,
  foo3: false,
  foo4: true
};
// 我们还设置一些常量以使代码更易于后续阅读。

// 这些显然可以采用多种形式，也可以设置以不同的方式显示，但是我发现这是最直观的阅读方式：
const HAS_FOO1 = 1; // 0001
const HAS_FOO2 = 1 << 1; // 0010
const HAS_FOO3 = 1 << 2; // 0100
const HAS_FOO4 = 1 << 3; // 1000

// 构造按位数字， 具体如何操作将取决于用例

// 一种方法是：检查对象手动键入并使用if语句添加属性
let myBitNumber = 0;
if (myObject["foo1"] === true) myBitNumber = myBitNumber | HAS_FOO1;
// 使用 | 操作符取并集
if (myObject["foo2"] === true) myBitNumber = myBitNumber | HAS_FOO2;
if (myObject["foo3"] === true) myBitNumber = myBitNumber | HAS_FOO3;
if (myObject["foo4"] === true) myBitNumber = myBitNumber | HAS_FOO4;
console.log(myBitNumber.toString(2));
// 1010
/*
 * 按位数字现在是"1010".这是因为第2和第4的属性值为真
 *
 * | fourth | third | second | first | <= Attribute
 * |    1   |   0   |   1    |   0   | <= True/false
 *
 */
```

现在，进行测试。如果你要检查按位编号的属性，则可以检查以下四种可能的状态：你的编号是否具有某个特定属性的，是否具有给定属性数组的任意元素，是否仅具有指定的属性，或具有数组中的所有属性。这是一个有用的按位[备忘单](https://union.io/images/repo/20170531-00--895036.png)，后面是一些代码示例：

```js
// 测试您的位数是否具有单个属性。 '＆'确保
// an intersection between them.
if (myBitNumber & HAS_FOO1) {
  // False, in this example
}
if (myBitNumber & HAS_FOO2) {
  // True!
}
// 测试您的位数是否具有任何指定属性

if (myBitNumber & (HAS_FOO1 | HAS_FOO2)) {
  // True!
}
if (myBitNumber & (HAS_FOO1 | HAS_FOO3)) {
  // False
}
// 测试您的位数是否仅包含指定的属性
if (myBitNumber == (HAS_FOO2 | HAS_FOO4)) {
  // True
}
if (myBitNumber == (HAS_FOO2 | HAS_FOO3 | HAS_FOO4)) {
  // False
}

// 测试您的位数是否包含给定的全部属性。

// 属性的结合不能单独取代`myBitNumber`，反之它会包含一些

//该“ myBitNumber”没有。
if (myBitNumber == (myBitNumber | (HAS_FOO2 | HAS_FOO4))) {
  // True
}
if (myBitNumber == (myBitNumber | (HAS_FOO2 | HAS_FOO3 | HAS_FOO4))) {
  // False
}
```

简单总结一下，本文展示了如何使用位运算符有效存储和比较多个 true / false 属性。它相当容易阅读和理解，易于更新和维护，并且如果你需要编辑一个子句甚至添加另一个属性，这并不带来成倍的困难。

最妙的地方是你可以和 0 和 1 打交道。 因此，如果你喝足够的咖啡并闭上眼睛，在短暂的瞬间，你几乎可以假装自己是 1950 年代的使用机器语言的程序员。
