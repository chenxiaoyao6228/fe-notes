## 前言

在 JavaScript 中，有一部分内容，情况复杂，容易出错，饱受争议但有应用广泛，那就是类型转换。

在 ES6 前，JS 一共有六种数据类型：Undefined、Null、Boolean、Number、String、Object

## 类型转换的类型

首先我们要知道,在 JS 中类型转换只有三种情况,分别是:

- 转换为布尔值
- 转换为数字
- 转换为字符串

此外，也可分为两种类型转换，一种是显式转换，一种是隐式转换

- 显式转换：通过调用 JS 中的内置函数，将类型转换成其他类型，比如 Number、String、Boolean 等
- 隐式转换：通过 JS 引擎自动转换，比如 if 语句、逻辑运算符、== 等

## 原始值转布尔值

在 JavaScript 中，只有 6 种值可以被转成 false，其余的都转成 true

```js
Boolean(); // false
!!false; // false
!!undefined; // false
!!null; // false
!!+0; // false
!!-0; // false
!!NaN; // false
!!""; // false
```

## 原始值转数字

在 JavaScript 中，使用 Number 可以将类型转换成数字，如果无法转换，则返回 NaN

| 参数类型  | 结果                                   |
| --------- | -------------------------------------- |
| Undefined | NaN                                    |
| Null      | +0                                     |
| Boolean   | 如果参数是 true，则返回 1；否则返回 +0 |
| String    | 比较复杂，看例子                       |

```js 
Number() // +0
+undefined // NaN
+null // +0

+false // +0
+true // 1

+'123' // 123
+'-123' // -123
+'1.2' // 1.2
+'000123' // 123
+'-000123' // -123

+'0x11' // 17

+'' // 0
+' ' // 0

+'123 123' // NaN
+'foo' // NaN
+'100a' // NaN
```

## 原始值转字符串

| 参数类型  | 结果              |
| --------- | ----------------- |
| Undefined | "undefined"       |
| Null      | "Null"            |
| Boolean   | "true" \| "false" |
| Number    | 看例子            |
| String    | 不变              |

```js
String(); // ''
undefined + ""; // 'undefined'
null + ""; // 'null'

false + ""; // 'false'
true + ""; // 'true'

0 +
  "" - // 0
  0 +
  ""; // 0
NaN + ""; // 'NaN'
Infinity +
  "" - // 'Infinity'
  Infinity +
  ""; // -Infinity
1 + ""; // '1'
```

## 原始值转对象

new 一下就可以了

## 对象转布尔值

所有对象转成布尔值都转换成 true

## 对象转字符串

会输出一堆奇怪的东西

## 对象转数字

除了日期输出毫秒数意外，其余的都输出 NaN
