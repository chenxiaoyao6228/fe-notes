---
title: 实现一个简易的javascript测试框架
date: 2019-07-13T13:45:11.000Z
categories:
  - tech
tags:
  - javascript
  - test
permalink: 2019-07-13-what-is-a-javascript-test
---

## 前言

进行软件测试的原因有很多, 对于我而言有两个

1. 提升软件开发的效率
2. 在进行代码修改的时候确保不破坏现有的代码

那么问题来了

- 你是否写过 Javascript 测试
- 你用过那些 Javacript 测试框架
- 你是否有从零搭建测试环境的经历
- 你是否深入理解测试框架, 并且能自己实现最小功能集合的框架

如果你的回答是否也不要紧, 希望阅读本文之后你能够对 Javascript 测试有一定见解, 写出更好的测试用例

我们先从为一个简单的 math.js 写测试开始

```js
const sum = (a, b) => a + b;
const subtract = (a, b) => a - b;
module.exports = { sum, subtract };
```

## 第一步

以下是我能想出的最简单的测试用例

```js
// basic-test.js
const atual = true
const expected = false
if(actual !== expected) {
    throw new Error(`${atual is not ${expected}`)
}
```

你可以通过运行 node basic-test.js 来测试其中的代码

有了上面的例子, 我们很容易理解什么是测试用例

> 测试用例, 就是一段当实际结果不符合预期时候抛出异常的一段代码

当需要测试的代码需要建立某些状态(比如一个组件在进行事件点击之前需要先渲染出来或者数据需要从数据库中提前取出的时候), 事情会变得稍微复杂一些, 但是, 类似上面 math.js 的"纯函数"(对于相同的输入总是能够返回相同的结果,并且不更改其他地方的状态)是很容易测试的

**actual !== expected**的部分称为**断言(assertion)**, 要通过测试, 实际的输出值要和预期的值一致. 断言的形式多样, 可以是实际值匹配某条正则规则, 或是数组满足特定长度, 总之如果断言失败, 就会抛出异常.

接下来我们为 math.js 写一段最简单的测试

```js
// 1.js
const { sum, subtract } = require("./math");
let result, expected;
result = sum(3, 7);
expected = 10;
if (result !== expected) {
  throw new Error(`${result} is not equal to ${expected}`);
}
result = subtract(7, 3);
expected = 4;
if (result !== expected) {
  throw new Error(`${result} is not equal to ${expected}`);
}
```

我们通过命令行运行**node 1.js**, 发现测试通过, 没有抛出异常, 但如果我们把+变成-号, 再次运行上述代码, 我们会看到以下信息

```js
$ node 1.js
/Users/kdodds/Desktop/js-test-example/1.js:8
  throw new Error(`${result} is not equal to ${expected}`)
  ^
Error: -4 is not equal to 10
    at Object.<anonymous> (/Users/kdodds/Desktop/js-test-example/1.js:8:9)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3
```

好极了, 我们现在已经有了最基本的测试用例, **对于测试框架(或者断言库)而言,错误信息是及其重要的**,当我们的测试不通过的时候, 第一眼看到的就是错误信息, 如果你不能立即从错误信息判断出哪处代码出现了问题,势必浪费时间. 很多时候, 错误信息的质量取决于你对正在使用的测试框架提供的断言库的理解程度.

## 第二步

实际上, node.js 中有一个和上述功能相似的[断言模块](https://nodejs.org/api/assert.html#assert_assert), 我们可以使用该模块对我们的代码进行重构

```js
// 2.js
const assert = require("assert");
const { sum, subtract } = require("./math");
let result, expected;
result = sum(3, 7);
expected = 10;
assert.strictEqual(result, expected);
result = subtract(7, 3);
expected = 4;
assert.strictEqual(result, expected);
```

好极了, 经过重构的测试模块功能一样, 但错误信息却稍微不同

```js
$ node 2.js
assert.js:42
  throw new errors.AssertionError({
  ^
AssertionError [ERR_ASSERTION]: -4 === 10
    at Object.<anonymous> (/Users/kdodds/Desktop/js-test-example/2.js:8:8)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3
```

## 第三步

我们可以通过上述的例子来打造属于自己的"测试框架"和"断言库". 我们先从断言库开始. 这次我们不使用 node 的 assert 模块, 相反, 我们创建一个 expect 的模块

```js
// 3.js
const { sum, subtract } = require("./math");
let result, expected;

result = sum(3, 7);
expected = 10;
expect(result).toBe(expected);

result = subtract(7, 3);
expected = 4;
expect(result).toBe(expected);

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`${actual} is not equal to ${expected}`);
      }
    },
  };
}
```

我们可以在 expecet 对象上添加许多断言方法(如 toMatchRegex 或 toHaveLength), 运行上述代码, 得到下列错误信息

```js
$ node 3.js
/Users/kdodds/Desktop/js-test-example/3.js:17
        throw new Error(`${actual} is not equal to ${expected}`)
        ^
Error: -4 is not equal to 10
    at Object.toBe (/Users/kdodds/Desktop/js-test-example/3.js:17:15)
    at Object.<anonymous> (/Users/kdodds/Desktop/js-test-example/3.js:7:16)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3
```

一切看起来还不错

## 第四步

上面的实现存在一个问题, 那就是因为现在的错误信息只告诉我们 expect 函数中的 actual !== expected 条件没有被满足, 但如何知道哪一个断言出了错, 也可能是 substract 模块出了问题, 并且, 我们的测试并没有对测试进行归类,这样当测试用例一多, 就会出混乱不堪

我们可以使用 helper 函数来解决问题

```js
// 4.js
const { sum, subtract } = require("./math");
test("sum adds numbers", () => {
  const result = sum(3, 7);
  const expected = 10;
  expect(result).toBe(expected);
});
test("subtract subtracts numbers", () => {
  const result = subtract(7, 3);
  const expected = 4;
  expect(result).toBe(expected);
});

function test(title, callback) {
  try {
    callback();
    console.log(`✓ ${title}`);
  } catch (error) {
    console.error(`✕ ${title}`);
    console.error(error);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`${actual} is not equal to ${expected}`);
      }
    },
  };
}
```

有了上面的 test 方法, 我们就可以将相关的测试合并到一起, 加以命名区分, 并且给出来的错误信息更加具体, 同时当某用例不通过的时候, 代码也不会终止执行, 而是执行完所有的测试用例. 下面是我们的输出的错误信息

```js
$ node 4.js
✕ sum adds numbers
Error: -4 is not equal to 10
    at Object.toBe (/Users/kdodds/Desktop/js-test-example/4.js:29:15)
    at test (/Users/kdodds/Desktop/js-test-example/4.js:6:18)
    at test (/Users/kdodds/Desktop/js-test-example/4.js:17:5)
    at Object.<anonymous> (/Users/kdodds/Desktop/js-test-example/4.js:3:1)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
✓ subtract subtracts numbers
```

有了 title, 我们很容易找到对应的错误代码, 予以修正.

## 第五步

现在我们需要做的就是写一个简单的 cli 工具,搜索我们的所有测试用例并执行.当然我们还可以在现有的基础上添加其他的功能

行文至此, 我们已经建立了一个简单的测试框架了.幸运的是, 社区中已经有了许多优秀的实现, 比如来自 facebook 的[jest.js](https://jestjs.io/)

我们用 jest 来重构上面的代码, 我们需要做的, 就是用 jest 的 test 和 expect 函数来替换我们的 test 和 expect 函数,

```js
// 5.js
const { sum, subtract } = require("./math");
test("sum adds numbers", () => {
  const result = sum(3, 7);
  const expected = 10;
  expect(result).toBe(expected);
});
test("subtract subtracts numbers", () => {
  const result = subtract(7, 3);
  const expected = 4;
  expect(result).toBe(expected);
});
```

运行上述代码, 会得到下列的错误信息

```js
$ jest
 FAIL  ./5.js
  ✕ sum adds numbers (5ms)
  ✓ subtract subtracts numbers (1ms)
● sum adds numbers
expect(received).toBe(expected)
    Expected value to be (using Object.is):
      10
    Received:
      -4
      4 |   const result = sum(3, 7)
      5 |   const expected = 10
    > 6 |   expect(result).toBe(expected)
      7 | })
      8 |
      9 | test('subtract subtracts numbers', () => {
      at Object.<anonymous>.test (5.js:6:18)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        0.6s, estimated 1s
Ran all test suites.
```

文字看起来有些不清楚, 实际上输出的结果是彩色的

![jest-output](https://kentcdodds.com/static/509c08a8fd5d6a2516e3b85fbe8b4213/8ff1e/0.png)

可以看到, jest 输出的错误信息更加一目了然

## 结论

我们还没有谈及一些 jest 中其他高级的功能, 如[beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout)或是[describe](https://jestjs.io/docs/en/api.html#describename-fn), 以及其他的断言形式, 如[toMatchObject](https://jestjs.io/docs/en/expect.html#tomatchobjectobject)或是[toContain](https://jestjs.io/docs/en/expect.html#tocontainitem), 但希望通过本文你已经对 javascript 测试有了一定的理解

感谢阅读!
